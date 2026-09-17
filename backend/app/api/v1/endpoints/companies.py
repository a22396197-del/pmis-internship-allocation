from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import require_role
from app.models.user import User
from app.models.company import CompanyProfile
from app.models.internship import Internship
from app.models.application import Application
from app.schemas.company import CompanyProfileOut, CompanyProfileUpdate

router = APIRouter()

@router.get("/profile", response_model=CompanyProfileOut)
def get_company_profile(
    current_user: User = Depends(require_role(["COMPANY", "ADMIN"])),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")
    return profile

@router.put("/profile", response_model=CompanyProfileOut)
def update_company_profile(
    profile_in: CompanyProfileUpdate,
    current_user: User = Depends(require_role(["COMPANY"])),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")

    update_data = profile_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile

@router.get("/dashboard-stats")
def get_company_dashboard_stats(
    current_user: User = Depends(require_role(["COMPANY"])),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")

    internships = db.query(Internship).filter(Internship.company_id == profile.id).all()
    internship_ids = [i.id for i in internships]
    
    total_vacancies = sum(i.vacancies for i in internships)
    total_allocated = sum(i.allocated_count for i in internships)

    applications = db.query(Application).filter(Application.internship_id.in_(internship_ids)).all() if internship_ids else []
    
    return {
        "active_internships": len(internships),
        "total_vacancies": total_vacancies,
        "total_allocated": total_allocated,
        "total_applications": len(applications),
        "shortlisted_count": sum(1 for a in applications if a.status == "SHORTLISTED")
    }
