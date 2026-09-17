from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user, require_role
from app.models.user import User
from app.models.student import StudentProfile
from app.models.company import CompanyProfile
from app.models.internship import Internship
from app.models.application import Application
from app.schemas.application import (
    ApplicationCreate, 
    ApplicationUpdateStatus, 
    ApplicationOut, 
    StudentDecisionRequest, 
    StudentApplicationStats
)
from app.ai.scoring_engine import calculate_match_score

router = APIRouter()

@router.post("", response_model=ApplicationOut)
@router.post("/", response_model=ApplicationOut)
def apply_to_internship(
    app_in: ApplicationCreate,
    current_user: User = Depends(require_role(["STUDENT"])),
    db: Session = Depends(get_db)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    internship = db.query(Internship).filter(Internship.id == app_in.internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    # Check if already applied
    existing = db.query(Application).filter(
        Application.student_id == student.id,
        Application.internship_id == internship.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied for this internship")

    # Calculate match score at submission time
    score_data = calculate_match_score(student, internship)

    application = Application(
        student_id=student.id,
        internship_id=internship.id,
        status="APPLIED",
        match_score=score_data["total_score"],
        score_breakdown=score_data
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    out = ApplicationOut.model_validate(application)
    out.internship_title = internship.title
    out.company_name = internship.company.company_name if internship.company else None
    return out

@router.get("/stats", response_model=StudentApplicationStats)
def get_student_application_stats(
    current_user: User = Depends(require_role(["STUDENT"])),
    db: Session = Depends(get_db)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    apps = db.query(Application).filter(Application.student_id == student.id).all()
    total_applied = len(apps)
    total_got = sum(1 for a in apps if a.status in ["ALLOCATED", "OFFERED"])
    total_attended = sum(1 for a in apps if a.status in ["ATTENDED", "ACCEPTED"])
    total_rejected = sum(1 for a in apps if a.status in ["REJECTED_BY_STUDENT", "DECLINED", "REJECTED"])

    return StudentApplicationStats(
        total_applied=total_applied,
        total_got=total_got,
        total_attended=total_attended,
        total_rejected=total_rejected
    )

@router.put("/{application_id}/decision", response_model=ApplicationOut)
def record_student_offer_decision(
    application_id: str,
    decision_in: StudentDecisionRequest,
    current_user: User = Depends(require_role(["STUDENT"])),
    db: Session = Depends(get_db)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    application = db.query(Application).filter(
        Application.id == application_id,
        Application.student_id == student.id
    ).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application record not found")

    if application.status not in ["ALLOCATED", "OFFERED", "SHORTLISTED", "ATTENDED"]:
        raise HTTPException(status_code=400, detail=f"Cannot record decision for application in '{application.status}' state")

    action = decision_in.decision.upper().strip()
    if action == "ACCEPT":
        application.status = "ATTENDED"
    elif action == "REJECT":
        application.status = "REJECTED_BY_STUDENT"
        if application.internship and (application.internship.allocated_count or 0) > 0:
            application.internship.allocated_count -= 1
            if application.internship.status == "FILLED":
                application.internship.status = "OPEN"
    else:
        raise HTTPException(status_code=400, detail="Decision must be 'ACCEPT' or 'REJECT'")

    db.commit()
    db.refresh(application)

    out = ApplicationOut.model_validate(application)
    if application.internship:
        out.internship_title = application.internship.title
        out.stipend_amount = application.internship.stipend_amount
        out.duration_months = application.internship.duration_months
        out.responsibilities = application.internship.responsibilities
        out.benefits = application.internship.benefits
        if application.internship.company:
            out.company_name = application.internship.company.company_name
            out.company_city = application.internship.company.location_city
    return out

@router.get("/my", response_model=List[ApplicationOut])
def get_my_applications(
    current_user: User = Depends(require_role(["STUDENT"])),
    db: Session = Depends(get_db)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    applications = db.query(Application).filter(Application.student_id == student.id).order_by(Application.applied_at.desc()).all()
    
    out_list = []
    for app in applications:
        out = ApplicationOut.model_validate(app)
        if app.internship:
            out.internship_title = app.internship.title
            out.stipend_amount = app.internship.stipend_amount
            out.duration_months = app.internship.duration_months
            out.responsibilities = app.internship.responsibilities
            out.benefits = app.internship.benefits
            if app.internship.company:
                out.company_name = app.internship.company.company_name
                out.company_city = app.internship.company.location_city
        out_list.append(out)

    return out_list

@router.get("/internship/{internship_id}", response_model=List[ApplicationOut])
def get_internship_applications(
    internship_id: str,
    current_user: User = Depends(require_role(["COMPANY", "ADMIN"])),
    db: Session = Depends(get_db)
):
    applications = db.query(Application).filter(Application.internship_id == internship_id).order_by(Application.match_score.desc()).all()
    
    out_list = []
    for app in applications:
        out = ApplicationOut.model_validate(app)
        if app.student:
            out.student_name = app.student.full_name
            out.student_email = app.student.user.email if app.student.user else None
            out.student_education = app.student.education_level
            out.student_city = app.student.home_city
            out.student_skills = [s.skill_name for s in (app.student.skills or [])]
        out_list.append(out)

    return out_list

@router.put("/{application_id}/status", response_model=ApplicationOut)
def update_application_status(
    application_id: str,
    status_update: ApplicationUpdateStatus,
    current_user: User = Depends(require_role(["COMPANY", "ADMIN"])),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    application.status = status_update.status.upper()
    if application.status == "ALLOCATED":
        application.allocated_at = datetime.now(timezone.utc)
        # Update internship allocated count
        if application.internship:
            application.internship.allocated_count = (application.internship.allocated_count or 0) + 1

    db.commit()
    db.refresh(application)
    return application
