from app.schemas.user import UserCreate, UserLogin, UserOut, Token
from app.schemas.student import (
    StudentProfileUpdate,
    StudentProfileOut,
    StudentSkillCreate,
    StudentSkillOut,
    StudentProjectCreate,
    StudentProjectOut,
    StudentExperienceCreate,
    StudentExperienceOut
)
from app.schemas.company import CompanyProfileBase, CompanyProfileUpdate, CompanyProfileOut
from app.schemas.internship import InternshipCreate, InternshipUpdate, InternshipOut
from app.schemas.application import ApplicationCreate, ApplicationUpdateStatus, ApplicationOut
from app.schemas.matching import ScoreBreakdown, MatchRecommendation, CandidateRecommendation
