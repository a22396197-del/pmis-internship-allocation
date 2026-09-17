import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Integer, Float, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Internship(Base):
    __tablename__ = "internships"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id = Column(String, ForeignKey("company_profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    
    # Requirements
    required_skills = Column(JSON, default=list)        # ["Python", "SQL", "FastAPI"]
    min_education_level = Column(String, default="Any") # Any, Diploma, B.Tech, etc.
    preferred_locations = Column(JSON, default=list)    # ["Bengaluru", "Remote"]
    industry = Column(String, default="IT & Software")
    min_cgpa = Column(Float, default=6.0)
    
    # Capacity & Terms
    vacancies = Column(Integer, default=1)
    allocated_count = Column(Integer, default=0)
    stipend_amount = Column(Float, default=10000.0)
    duration_months = Column(Integer, default=3)
    
    # Work & Value Details
    responsibilities = Column(JSON, default=list)       # ["Design REST APIs", "Optimize queries"]
    benefits = Column(JSON, default=list)               # ["PMIS Certificate", "₹18,000 Stipend", "Mentorship"]
    
    status = Column(String, default="OPEN")  # OPEN, CLOSED, FILLED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    company = relationship("CompanyProfile", back_populates="internships")
    applications = relationship("Application", back_populates="internship", cascade="all, delete-orphan")
