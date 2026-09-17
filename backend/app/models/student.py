import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Text, JSON, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    
    # Education
    education_level = Column(String, default="", nullable=True)  # Diploma, B.Tech, B.Sc, BCA, M.Tech, MCA, etc.
    field_of_study = Column(String, nullable=True)     # Computer Science, Mechanical, Commerce, etc.
    institution_name = Column(String, nullable=True)
    graduation_year = Column(Integer, nullable=True)
    cgpa_or_percentage = Column(Float, nullable=True, default=None)
    
    # Location
    home_city = Column(String, default="")
    home_state = Column(String, default="")
    preferred_locations = Column(JSON, default=list)  # ["Bengaluru", "Hyderabad", "Remote"]
    
    # Preferences
    career_interests = Column(JSON, default=list)     # ["Full Stack", "Data Analytics"]
    industry_preferences = Column(JSON, default=list) # ["IT & Software", "FinTech"]
    
    # Resume & NLP Data
    resume_file_path = Column(String, nullable=True)
    resume_raw_text = Column(Text, nullable=True)
    extracted_skills = Column(JSON, default=list)      # Extracted skills from parser
    
    bio = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="student_profile")
    skills = relationship("StudentSkill", back_populates="student", cascade="all, delete-orphan")
    projects = relationship("StudentProject", back_populates="student", cascade="all, delete-orphan")
    experiences = relationship("StudentExperience", back_populates="student", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")

class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String, nullable=False)
    proficiency_level = Column(String, default="INTERMEDIATE")  # BEGINNER, INTERMEDIATE, ADVANCED
    is_verified = Column(Boolean, default=False)

    student = relationship("StudentProfile", back_populates="skills")

class StudentProject(Base):
    __tablename__ = "student_projects"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    technologies = Column(JSON, default=list)  # ["React", "FastAPI"]
    github_url = Column(String, nullable=True)
    live_demo_url = Column(String, nullable=True)

    student = relationship("StudentProfile", back_populates="projects")

class StudentExperience(Base):
    __tablename__ = "student_experiences"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    organization = Column(String, nullable=False)
    duration_months = Column(Integer, default=1)
    description = Column(Text, nullable=True)

    student = relationship("StudentProfile", back_populates="experiences")
