import os
import uuid
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.api.deps import get_current_user, require_role
from app.models.user import User
from app.models.student import StudentProfile, StudentSkill, StudentProject, StudentExperience
from app.schemas.student import (
    StudentProfileOut, StudentProfileUpdate,
    StudentSkillCreate, StudentSkillOut,
    StudentProjectCreate, StudentProjectOut,
    StudentExperienceCreate, StudentExperienceOut
)
from app.ai.resume_parser import extract_text_from_pdf, parse_resume_content

router = APIRouter()

@router.get("/profile", response_model=StudentProfileOut)
def get_student_profile(
    current_user: User = Depends(require_role(["STUDENT", "ADMIN"])),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return profile

@router.put("/profile", response_model=StudentProfileOut)
def update_student_profile(
    profile_in: StudentProfileUpdate,
    current_user: User = Depends(require_role(["STUDENT"])),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    update_data = profile_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile

@router.post("/resume/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(require_role(["STUDENT"])),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    if not file.filename.lower().endswith((".pdf", ".txt")):
        raise HTTPException(status_code=400, detail="Only PDF and TXT resume files are supported")

    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text and parse using NLP module
    if filename.lower().endswith(".pdf"):
        raw_text = extract_text_from_pdf(file_path)
    else:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            raw_text = f.read()

    parsed_data = parse_resume_content(raw_text)

    profile.resume_file_path = f"/uploads/resumes/{filename}"
    profile.resume_raw_text = raw_text
    profile.extracted_skills = parsed_data["skills"]
    if parsed_data.get("education_level"):
        profile.education_level = parsed_data["education_level"]
    if parsed_data.get("field_of_study"):
        profile.field_of_study = parsed_data["field_of_study"]
    if parsed_data.get("cgpa_estimate"):
        profile.cgpa_or_percentage = parsed_data["cgpa_estimate"]

    # Automatically synchronize extracted skills to student_skills table
    existing_skills = {s.skill_name.lower() for s in profile.skills}
    for sk in parsed_data["skills"]:
        if sk.lower() not in existing_skills:
            new_skill = StudentSkill(
                student_id=profile.id,
                skill_name=sk,
                proficiency_level="INTERMEDIATE",
                is_verified=True
            )
            db.add(new_skill)
            existing_skills.add(sk.lower())

    db.commit()
    db.refresh(profile)

    return {
        "message": "Resume analyzed successfully",
        "extracted_skills": parsed_data["skills"],
        "education_level": profile.education_level,
        "field_of_study": profile.field_of_study,
        "cgpa": profile.cgpa_or_percentage,
        "skills_count": len(parsed_data["skills"])
    }

@router.post("/skills", response_model=StudentSkillOut)
def add_skill(
    skill_in: StudentSkillCreate,
    current_user: User = Depends(require_role(["STUDENT"])),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    existing = db.query(StudentSkill).filter(
        StudentSkill.student_id == profile.id,
        StudentSkill.skill_name.ilike(skill_in.skill_name)
    ).first()
    if existing:
        return existing

    skill = StudentSkill(
        student_id=profile.id,
        skill_name=skill_in.skill_name.strip(),
        proficiency_level=skill_in.proficiency_level
    )
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill

@router.delete("/skills/{skill_id}")
def delete_skill(
    skill_id: str,
    current_user: User = Depends(require_role(["STUDENT"])),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    skill = db.query(StudentSkill).filter(
        StudentSkill.id == skill_id,
        StudentSkill.student_id == profile.id
    ).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(skill)
    db.commit()
    return {"message": "Skill removed"}

@router.post("/projects", response_model=StudentProjectOut)
def add_project(
    project_in: StudentProjectCreate,
    current_user: User = Depends(require_role(["STUDENT"])),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    project = StudentProject(
        student_id=profile.id,
        title=project_in.title,
        description=project_in.description,
        technologies=project_in.technologies,
        github_url=project_in.github_url,
        live_demo_url=project_in.live_demo_url
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.delete("/projects/{project_id}")
def delete_project(
    project_id: str,
    current_user: User = Depends(require_role(["STUDENT"])),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    proj = db.query(StudentProject).filter(
        StudentProject.id == project_id,
        StudentProject.student_id == profile.id
    ).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(proj)
    db.commit()
    return {"message": "Project removed"}

@router.post("/experience", response_model=StudentExperienceOut)
def add_experience(
    exp_in: StudentExperienceCreate,
    current_user: User = Depends(require_role(["STUDENT"])),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    exp = StudentExperience(
        student_id=profile.id,
        title=exp_in.title,
        organization=exp_in.organization,
        duration_months=exp_in.duration_months,
        description=exp_in.description
    )
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp

@router.delete("/experience/{exp_id}")
def delete_experience(
    exp_id: str,
    current_user: User = Depends(require_role(["STUDENT"])),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    exp = db.query(StudentExperience).filter(
        StudentExperience.id == exp_id,
        StudentExperience.student_id == profile.id
    ).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    db.delete(exp)
    db.commit()
    return {"message": "Experience removed"}
