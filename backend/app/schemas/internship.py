from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class InternshipBase(BaseModel):
    title: str
    description: str
    required_skills: List[str] = []
    min_education_level: str = "Any"
    preferred_locations: List[str] = []
    industry: str = "IT & Software"
    min_cgpa: float = 6.0
    vacancies: int = 1
    stipend_amount: float = 10000.0
    duration_months: int = 3
    responsibilities: List[str] = []
    benefits: List[str] = []

class InternshipCreate(InternshipBase):
    pass

class InternshipUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    min_education_level: Optional[str] = None
    preferred_locations: Optional[List[str]] = None
    industry: Optional[str] = None
    min_cgpa: Optional[float] = None
    vacancies: Optional[int] = None
    stipend_amount: Optional[float] = None
    duration_months: Optional[int] = None
    responsibilities: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    status: Optional[str] = None

class InternshipOut(InternshipBase):
    id: str
    company_id: str
    company_name: Optional[str] = None
    company_city: Optional[str] = None
    company_state: Optional[str] = None
    company_logo: Optional[str] = None
    allocated_count: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
