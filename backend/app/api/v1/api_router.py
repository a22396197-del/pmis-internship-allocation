from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    students,
    companies,
    internships,
    matching,
    applications,
    admin
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(students.router, prefix="/students", tags=["Students"])
api_router.include_router(companies.router, prefix="/companies", tags=["Companies"])
api_router.include_router(internships.router, prefix="/internships", tags=["Internships"])
api_router.include_router(matching.router, prefix="/matching", tags=["AI Matching & Recommendations"])
api_router.include_router(applications.router, prefix="/applications", tags=["Applications"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin & National Analytics"])
