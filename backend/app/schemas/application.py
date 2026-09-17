from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

class ApplicationCreate(BaseModel):
    internship_id: str

class ApplicationUpdateStatus(BaseModel):
    status: str  # APPLIED, SHORTLISTED, ALLOCATED, REJECTED, ACCEPTED

class StudentDecisionRequest(BaseModel):
    decision: str  # ACCEPT or REJECT

class StudentApplicationStats(BaseModel):
    total_applied: int
    total_got: int       # ALLOCATED / OFFERED
    total_attended: int  # ATTENDED / ACCEPTED
    total_rejected: int  # DECLINED / REJECTED_BY_STUDENT / REJECTED

class ApplicationOut(BaseModel):
    id: str
    student_id: str
    internship_id: str
    status: str
    match_score: float
    score_breakdown: Dict[str, Any] = {}
    applied_at: datetime
    allocated_at: Optional[datetime] = None
    
    # Nested preview details
    student_name: Optional[str] = None
    student_email: Optional[str] = None
    student_education: Optional[str] = None
    student_city: Optional[str] = None
    student_skills: Optional[list] = None
    internship_title: Optional[str] = None
    company_name: Optional[str] = None
    company_city: Optional[str] = None
    stipend_amount: Optional[float] = None
    duration_months: Optional[int] = None
    responsibilities: Optional[list] = None
    benefits: Optional[list] = None

    class Config:
        from_attributes = True
