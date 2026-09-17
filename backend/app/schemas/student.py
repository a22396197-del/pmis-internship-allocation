from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class StudentSkillBase(BaseModel):
    skill_name: str
    proficiency_level: str = "INTERMEDIATE"

class StudentSkillCreate(StudentSkillBase):
    pass

class StudentSkillOut(StudentSkillBase):
    id: str
    student_id: str
    is_verified: bool

    class Config:
        from_attributes = True

class StudentProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    technologies: List[str] = []
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None

class StudentProjectCreate(StudentProjectBase):
    pass

class StudentProjectOut(StudentProjectBase):
    id: str
    student_id: str

    class Config:
        from_attributes = True

class StudentExperienceBase(BaseModel):
    title: str
    organization: str
    duration_months: int = 1
    description: Optional[str] = None

class StudentExperienceCreate(StudentExperienceBase):
    pass

class StudentExperienceOut(StudentExperienceBase):
    id: str
    student_id: str

    class Config:
        from_attributes = True

class StudentProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    education_level: Optional[str] = None
    field_of_study: Optional[str] = None
    institution_name: Optional[str] = None
    graduation_year: Optional[int] = None
    cgpa_or_percentage: Optional[float] = None
    home_city: Optional[str] = None
    home_state: Optional[str] = None
    preferred_locations: Optional[List[str]] = None
    career_interests: Optional[List[str]] = None
    industry_preferences: Optional[List[str]] = None
    bio: Optional[str] = None

class StudentProfileOut(BaseModel):
    id: str
    user_id: str
    full_name: str
    phone: Optional[str] = None
    education_level: Optional[str] = ""
    field_of_study: Optional[str] = None
    institution_name: Optional[str] = None
    graduation_year: Optional[int] = None
    cgpa_or_percentage: Optional[float] = None
    home_city: Optional[str] = ""
    home_state: Optional[str] = ""
    preferred_locations: List[str] = []
    career_interests: List[str] = []
    industry_preferences: List[str] = []
    resume_file_path: Optional[str] = None
    extracted_skills: List[str] = []
    bio: Optional[str] = None
    skills: List[StudentSkillOut] = []
    projects: List[StudentProjectOut] = []
    experiences: List[StudentExperienceOut] = []
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
