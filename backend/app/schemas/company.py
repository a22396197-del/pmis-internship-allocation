from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CompanyProfileBase(BaseModel):
    company_name: str
    industry: str = "IT & Software"
    website: Optional[str] = None
    location_city: str = ""
    location_state: str = ""
    description: Optional[str] = None
    logo_url: Optional[str] = None

class CompanyProfileUpdate(CompanyProfileBase):
    pass

class CompanyProfileOut(CompanyProfileBase):
    id: str
    user_id: str
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True
