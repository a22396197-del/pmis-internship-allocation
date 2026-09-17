import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class CompanyProfile(Base):
    __tablename__ = "company_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    company_name = Column(String, nullable=False)
    industry = Column(String, default="IT & Software")
    website = Column(String, nullable=True)
    location_city = Column(String, default="")
    location_state = Column(String, default="")
    description = Column(Text, nullable=True)
    logo_url = Column(String, nullable=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="company_profile")
    internships = relationship("Internship", back_populates="company", cascade="all, delete-orphan")
