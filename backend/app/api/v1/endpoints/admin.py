from typing import List, Dict, Any
from datetime import datetime, timezone
from collections import Counter
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import require_role
from app.models.user import User
from app.models.student import StudentProfile, StudentSkill
from app.models.company import CompanyProfile
from app.models.internship import Internship
from app.models.application import Application
from app.models.allocation import AllocationRun
from app.ai.fairness_allocator import run_constrained_allocation

router = APIRouter()

@router.get("/stats")
def get_national_stats(
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    total_students = db.query(StudentProfile).count()
    total_companies = db.query(CompanyProfile).count()
    total_internships = db.query(Internship).count()
    
    internships = db.query(Internship).all()
    total_vacancies = sum(i.vacancies for i in internships)
    total_allocated = sum(i.allocated_count or 0 for i in internships)
    
    total_applications = db.query(Application).count()
    
    # Average match score across all applications
    all_scores = [a.match_score for a in db.query(Application).all() if a.match_score]
    avg_score = round(sum(all_scores) / max(1, len(all_scores)), 1) if all_scores else 0.0

    return {
        "total_students": total_students,
        "total_companies": total_companies,
        "total_internships": total_internships,
        "total_vacancies": total_vacancies,
        "total_allocated": total_allocated,
        "total_applications": total_applications,
        "average_match_score": avg_score,
        "allocation_rate": round((total_allocated / max(1, total_vacancies)) * 100, 1)
    }

@router.get("/analytics/skills")
def get_skills_analytics(
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    # 1. Supply: Count skills students possess
    student_skills_records = db.query(StudentSkill.skill_name).all()
    supply_counter = Counter(s[0].strip().title() for s in student_skills_records if s[0])
    
    # Also include extracted skills
    for sp in db.query(StudentProfile.extracted_skills).all():
        if sp[0] and isinstance(sp[0], list):
            for sk in sp[0]:
                supply_counter[sk.strip().title()] += 1

    # 2. Demand: Count skills internships require
    demand_counter = Counter()
    for row in db.query(Internship.required_skills).all():
        if row[0] and isinstance(row[0], list):
            for sk in row[0]:
                demand_counter[sk.strip().title()] += 1

    # Merge top skills for side-by-side comparison chart
    top_demanded = [skill for skill, _ in demand_counter.most_common(10)]
    top_supplied = [skill for skill, _ in supply_counter.most_common(10)]
    all_featured = list(dict.fromkeys(top_demanded + top_supplied))[:12]

    chart_data = []
    for skill in all_featured:
        chart_data.append({
            "skill": skill,
            "demand": demand_counter.get(skill, 0),
            "supply": supply_counter.get(skill, 0),
            "gap": demand_counter.get(skill, 0) - supply_counter.get(skill, 0)
        })

    return {
        "skills_comparison": chart_data,
        "top_in_demand": demand_counter.most_common(5),
        "top_supplied": supply_counter.most_common(5)
    }

@router.get("/analytics/geographic")
def get_geographic_analytics(
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    # Candidate distribution by state
    students = db.query(StudentProfile.home_state).all()
    state_counter = Counter(s[0].strip().title() for s in students if s[0])
    
    # Internship distribution by location
    internship_loc_counter = Counter()
    for row in db.query(Internship.preferred_locations).all():
        if row[0] and isinstance(row[0], list):
            for loc in row[0]:
                internship_loc_counter[loc.strip().title()] += 1

    geo_data = []
    for state, count in state_counter.most_common(10):
        geo_data.append({
            "region": state,
            "students": count,
            "internships": internship_loc_counter.get(state, 0)
        })

    return {
        "state_distribution": geo_data,
        "total_states_represented": len(state_counter)
    }

@router.get("/analytics/industries")
def get_industry_analytics(
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    companies = db.query(CompanyProfile.industry).all()
    company_ind_counter = Counter(c[0].strip() for c in companies if c[0])

    internships = db.query(Internship.industry).all()
    internship_ind_counter = Counter(i[0].strip() for i in internships if i[0])

    data = []
    for industry, count in internship_ind_counter.most_common(8):
        data.append({
            "industry": industry,
            "internships": count,
            "companies": company_ind_counter.get(industry, 0)
        })

    return {"industry_breakdown": data}

@router.post("/allocation/run")
def trigger_batch_allocation(
    enforce_regional_diversity: bool = True,
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    students = db.query(StudentProfile).all()
    internships = db.query(Internship).filter(Internship.status == "OPEN").all()
    applications = db.query(Application).all()

    if not students or not internships:
        raise HTTPException(status_code=400, detail="Cannot run allocation without students and open internships")

    result = run_constrained_allocation(
        students=students,
        internships=internships,
        existing_applications=applications,
        enforce_regional_diversity=enforce_regional_diversity
    )

    # Persist allocation records and update application statuses
    for alloc in result["allocations"]:
        s_id = alloc["student_id"]
        i_id = alloc["internship_id"]
        
        app = db.query(Application).filter(
            Application.student_id == s_id,
            Application.internship_id == i_id
        ).first()

        if app:
            app.status = "ALLOCATED"
            app.allocated_at = datetime.now(timezone.utc)
            app.match_score = alloc["match_score"]
            app.score_breakdown = alloc["score_breakdown"]
        else:
            new_app = Application(
                student_id=s_id,
                internship_id=i_id,
                status="ALLOCATED",
                match_score=alloc["match_score"],
                score_breakdown=alloc["score_breakdown"],
                allocated_at=datetime.now(timezone.utc)
            )
            db.add(new_app)

        # Increment allocated count on internship
        target_internship = next((it for it in internships if it.id == i_id), None)
        if target_internship:
            target_internship.allocated_count = (target_internship.allocated_count or 0) + 1
            if target_internship.allocated_count >= target_internship.vacancies:
                target_internship.status = "FILLED"

    # Record run in history
    run_log = AllocationRun(
        total_candidates_considered=result["total_candidates_considered"],
        total_internships_available=result["total_internships_available"],
        total_allocated=result["total_allocated"],
        fairness_metrics={
            "fill_rate": result["allocation_rate_pct"],
            "average_match_score": result["average_match_score"],
            "regional_distribution": result["state_distribution"]
        },
        status="COMPLETED"
    )
    db.add(run_log)
    db.commit()

    return result

@router.get("/allocation/history")
def get_allocation_history(
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    runs = db.query(AllocationRun).order_by(AllocationRun.run_date.desc()).limit(10).all()
    return runs
