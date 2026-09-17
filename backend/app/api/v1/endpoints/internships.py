from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user, require_role
from app.models.user import User
from app.models.company import CompanyProfile
from app.models.internship import Internship
from app.models.student import StudentProfile
from app.schemas.internship import InternshipCreate, InternshipUpdate, InternshipOut
from app.schemas.matching import CandidateRecommendation, ScoreBreakdown
from app.ai.scoring_engine import calculate_match_score

router = APIRouter()

@router.get("", response_model=List[InternshipOut])
@router.get("/", response_model=List[InternshipOut])
def list_internships(
    search: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    min_stipend: Optional[float] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Internship)
    
    if search:
        query = query.filter(
            (Internship.title.ilike(f"%{search}%")) |
            (Internship.description.ilike(f"%{search}%"))
        )
    if industry:
        query = query.filter(Internship.industry.ilike(f"%{industry}%"))
    if min_stipend is not None:
        query = query.filter(Internship.stipend_amount >= min_stipend)

    internships = query.order_by(Internship.created_at.desc()).all()

    # If location filter provided
    if location:
        loc_lowered = location.lower()
        internships = [
            i for i in internships
            if any(loc_lowered in str(l).lower() for l in (i.preferred_locations or [])) or
               (i.company and loc_lowered in (i.company.location_city or "").lower())
        ]

    # Map company details into response
    out_list = []
    for i in internships:
        out_item = InternshipOut.model_validate(i)
        if i.company:
            out_item.company_name = i.company.company_name
            out_item.company_city = i.company.location_city
            out_item.company_state = i.company.location_state
            out_item.company_logo = i.company.logo_url
        out_list.append(out_item)

    return out_list

@router.get("/{internship_id}", response_model=InternshipOut)
def get_internship(internship_id: str, db: Session = Depends(get_db)):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    out_item = InternshipOut.model_validate(internship)
    if internship.company:
        out_item.company_name = internship.company.company_name
        out_item.company_city = internship.company.location_city
        out_item.company_state = internship.company.location_state
        out_item.company_logo = internship.company.logo_url
    return out_item

@router.post("", response_model=InternshipOut)
@router.post("/", response_model=InternshipOut)
def create_internship(
    internship_in: InternshipCreate,
    current_user: User = Depends(require_role(["COMPANY"])),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not registered")

    internship = Internship(
        company_id=profile.id,
        title=internship_in.title,
        description=internship_in.description,
        required_skills=internship_in.required_skills,
        min_education_level=internship_in.min_education_level,
        preferred_locations=internship_in.preferred_locations or [profile.location_city],
        industry=internship_in.industry or profile.industry,
        min_cgpa=internship_in.min_cgpa,
        vacancies=internship_in.vacancies,
        stipend_amount=internship_in.stipend_amount,
        duration_months=internship_in.duration_months
    )
    db.add(internship)
    db.commit()
    db.refresh(internship)

    out_item = InternshipOut.model_validate(internship)
    out_item.company_name = profile.company_name
    out_item.company_city = profile.location_city
    out_item.company_state = profile.location_state
    return out_item

@router.put("/{internship_id}", response_model=InternshipOut)
def update_internship(
    internship_id: str,
    internship_in: InternshipUpdate,
    current_user: User = Depends(require_role(["COMPANY"])),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    internship = db.query(Internship).filter(
        Internship.id == internship_id,
        Internship.company_id == profile.id
    ).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found or unauthorized")

    update_data = internship_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(internship, field, value)

    db.commit()
    db.refresh(internship)

    out_item = InternshipOut.model_validate(internship)
    out_item.company_name = profile.company_name
    return out_item

@router.delete("/{internship_id}")
def delete_internship(
    internship_id: str,
    current_user: User = Depends(require_role(["COMPANY", "ADMIN"])),
    db: Session = Depends(get_db)
):
    query = db.query(Internship).filter(Internship.id == internship_id)
    if current_user.role == "COMPANY":
        profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
        query = query.filter(Internship.company_id == profile.id)

    internship = query.first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found or unauthorized")

    db.delete(internship)
    db.commit()
    return {"message": "Internship deleted successfully"}

@router.get("/{internship_id}/candidates", response_model=List[CandidateRecommendation])
def get_ranked_candidates_for_internship(
    internship_id: str,
    current_user: User = Depends(require_role(["COMPANY", "ADMIN"])),
    db: Session = Depends(get_db)
):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    students = db.query(StudentProfile).all()
    ranked_candidates = []

    for student in students:
        score_data = calculate_match_score(student, internship)
        student_skills = [s.skill_name for s in (student.skills or [])]
        if not student_skills and student.extracted_skills:
            student_skills = student.extracted_skills

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

        ranked_candidates.append(
            CandidateRecommendation(
                student_id=student.id,
                full_name=student.full_name,
                education_level=student.education_level,
                field_of_study=student.field_of_study,
                cgpa_or_percentage=student.cgpa_or_percentage,
                home_city=student.home_city,
                home_state=student.home_state,
                skills=student_skills,
                match_score=score_data["total_score"],
                score_breakdown=breakdown
            )
        )

    # Sort descending by match score
    ranked_candidates.sort(key=lambda c: c.match_score, reverse=True)
    return ranked_candidates
