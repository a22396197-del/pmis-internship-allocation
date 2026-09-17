from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ScoreBreakdown(BaseModel):
    skills_score: float         # max 40
    education_score: float      # max 20
    preference_score: float     # max 15
    location_score: float       # max 10
    experience_score: float     # max 10
    industry_score: float       # max 5
    total_score: float          # max 100
    details: Dict[str, Any] = {}

class MatchRecommendation(BaseModel):
    internship_id: str
    title: str
    company_name: str
    company_city: Optional[str] = None
    company_state: Optional[str] = None
    company_logo: Optional[str] = None
    required_skills: List[str] = []
    min_education_level: Optional[str] = "Any"
    min_cgpa: Optional[float] = 6.0
    stipend_amount: float
    duration_months: int
    vacancies: int
    match_score: float
    score_breakdown: ScoreBreakdown
    
    is_eligible: bool = True
    eligibility_status: str = "ELIGIBLE"  # ELIGIBLE, CONDITIONAL
    eligibility_reasons: List[str] = []
    is_near_me: bool = False
    location_tag: str = "Remote / Nationwide"
    is_verified_partner: bool = True

    # Skill Gap & Value Propositions
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    responsibilities: List[str] = []
    benefits: List[str] = []

class CandidateRecommendation(BaseModel):
    student_id: str
    full_name: str
    education_level: Optional[str] = ""
    field_of_study: Optional[str] = None
    cgpa_or_percentage: Optional[float] = None
    home_city: Optional[str] = ""
    home_state: Optional[str] = ""
    skills: List[str] = []
    match_score: float
    score_breakdown: ScoreBreakdown
