import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Powered Internship Allocation Engine"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "pm-internship-allocation-engine-production-secret-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Database Configuration:
    # Set DATABASE_URL to your PostgreSQL connection string in .env:
    # e.g. postgresql://postgres:password@localhost:5432/pm_internship
    # or a cloud PostgreSQL instance (Neon, Supabase, AWS RDS).
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'internship_engine.db')}"
    )

    # Uploads directory
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads", "resumes")

    # Initial System Admin (only created if database is completely empty)
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@pmscheme.gov.in")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "Admin@PMIS2026")

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
