from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import require_role
from app.models.user import User
from app.models.student import StudentProfile
from app.models.internship import Internship
from app.schemas.matching import MatchRecommendation, ScoreBreakdown
from app.ai.scoring_engine import calculate_match_score

router = APIRouter()

@router.get("/recommendations", response_model=List[MatchRecommendation])
def get_recommended_internships(
    current_user: User = Depends(require_role(["STUDENT"])),
    db: Session = Depends(get_db)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    internships = db.query(Internship).filter(Internship.status == "OPEN").all()
    recommendations = []

    home_city = (student.home_city or "").strip().lower()
    home_state = (student.home_state or "").strip().lower()
    student_edu = (student.education_level or "").strip().lower()
    student_cgpa = getattr(student, "cgpa_or_percentage", None)

    student_skills_set = set()
    for s in (student.skills or []):
        if s.skill_name:
            student_skills_set.add(s.skill_name.strip().lower())
    for s in (student.extracted_skills or []):
        if isinstance(s, str):
            student_skills_set.add(s.strip().lower())

    for internship in internships:
        score_data = calculate_match_score(student, internship)
        
        breakdown = ScoreBreakdown(
            skills_score=score_data["skills_score"],
            education_score=score_data["education_score"],
            preference_score=score_data["preference_score"],
            location_score=score_data["location_score"],
            experience_score=score_data["experience_score"],
            industry_score=score_data["industry_score"],
            total_score=score_data["total_score"],
            details=score_data["details"]
        )

        # 1. Calculate Real-world Skill Gaps
        req_skills = internship.required_skills or []
        matched_skills = []
        missing_skills = []
        for sk in req_skills:
            sk_clean = sk.strip()
            if any(sk_clean.lower() in cand_sk or cand_sk in sk_clean.lower() for cand_sk in student_skills_set):
                matched_skills.append(sk_clean)
            else:
                missing_skills.append(sk_clean)

        # 2. Calculate Real Eligibility
        is_eligible = True
        eligibility_reasons = []
        min_cgpa = getattr(internship, "min_cgpa", 6.0) or 6.0
        min_edu = (internship.min_education_level or "Any").lower()

        if student_cgpa is not None:
            if student_cgpa >= min_cgpa:
                eligibility_reasons.append(f"CGPA ({student_cgpa}) meets {min_cgpa} minimum")
            else:
                is_eligible = False
                eligibility_reasons.append(f"CGPA ({student_cgpa}) below {min_cgpa} benchmark")
        else:
            eligibility_reasons.append("CGPA benchmark pending verification")

        if student_edu:
            if "b.tech" in min_edu and "diploma" in student_edu:
                is_eligible = False
                eligibility_reasons.append("Requires Bachelor's / B.Tech qualification")
            else:
                eligibility_reasons.append("Degree qualification matched")
        else:
            eligibility_reasons.append("Degree pending profile update")

        # Skill qualifications check
        if missing_skills:
            if len(matched_skills) == 0 and len(req_skills) > 0 and len(student_skills_set) > 0:
                is_eligible = False
                eligibility_reasons.append(f"Skill Gap: Missing {len(missing_skills)} required skill(s)")
            elif len(missing_skills) > 0:
                eligibility_reasons.append(f"Skills: {len(matched_skills)}/{len(req_skills)} matched")
        else:
            if req_skills:
                eligibility_reasons.append("All required competencies verified")

        # 3. Calculate "Near Me" / Geographic Proximity
        req_locations = [l.strip().lower() for l in (internship.preferred_locations or [])]
        is_near_me = False
        location_tag = "Relocation Available"

        if any("remote" in l for l in req_locations):
            is_near_me = True
            location_tag = "Work from Anywhere (Remote)"
        elif home_city and any(home_city in l for l in req_locations):
            is_near_me = True
            location_tag = f"Near You in {student.home_city.title()}"
        elif home_state and any(home_state in l for l in req_locations):
            is_near_me = True
            location_tag = f"In Your State ({student.home_state.title()})"
        elif internship.preferred_locations:
            location_tag = f"On-site ({', '.join(internship.preferred_locations)})"

        company_logo = internship.company.logo_url if internship.company else None
        is_verified = internship.company.is_verified if internship.company else True

        recommendations.append(
            MatchRecommendation(
                internship_id=internship.id,
                title=internship.title,
                company_name=internship.company.company_name if internship.company else "Partner Company",
                company_city=internship.company.location_city if internship.company else None,
                company_state=internship.company.location_state if internship.company else None,
                company_logo=company_logo,
                required_skills=internship.required_skills or [],
                min_education_level=internship.min_education_level,
                min_cgpa=min_cgpa,
                stipend_amount=internship.stipend_amount,
                duration_months=internship.duration_months,
                vacancies=internship.vacancies,
                match_score=score_data["total_score"],
                score_breakdown=breakdown,
                is_eligible=is_eligible,
                eligibility_status="ELIGIBLE" if is_eligible else "CONDITIONAL",
                eligibility_reasons=eligibility_reasons,
                is_near_me=is_near_me,
                location_tag=location_tag,
                is_verified_partner=is_verified,
                matched_skills=matched_skills,
                missing_skills=missing_skills,
                responsibilities=internship.responsibilities or [],
                benefits=internship.benefits or []
            )
        )

    # Sort descending by match score
    recommendations.sort(key=lambda r: r.match_score, reverse=True)
    return recommendations

@router.get("/calculate/{internship_id}", response_model=ScoreBreakdown)
def calculate_single_match(
    internship_id: str,
    current_user: User = Depends(require_role(["STUDENT"])),
    db: Session = Depends(get_db)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    score_data = calculate_match_score(student, internship)
    return ScoreBreakdown(
        skills_score=score_data["skills_score"],
        education_score=score_data["education_score"],
        preference_score=score_data["preference_score"],
        location_score=score_data["location_score"],
        experience_score=score_data["experience_score"],
        industry_score=score_data["industry_score"],
        total_score=score_data["total_score"],
        details=score_data["details"]
    )
