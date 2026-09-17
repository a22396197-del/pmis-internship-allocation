import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    internship_id = Column(String, ForeignKey("internships.id", ondelete="CASCADE"), nullable=False)
    
    status = Column(String, default="APPLIED")  # APPLIED, SHORTLISTED, ALLOCATED, REJECTED, ACCEPTED
    match_score = Column(Float, default=0.0)
    score_breakdown = Column(JSON, default=dict) # {skills, education, preference, location, experience, industry}
    
    applied_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    allocated_at = Column(DateTime, nullable=True)

    student = relationship("StudentProfile", back_populates="applications")
    internship = relationship("Internship", back_populates="applications")
