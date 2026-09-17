import os
import sys
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal, check_db_connection
from app.api.v1.api_router import api_router
from app.core.security import get_password_hash
from app.models.user import User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("internship_engine")

# 1. Initialize relational database tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database schema initialized successfully.")
except Exception as e:
    logger.error(f"Error initializing database schema: {e}")

# 2. Ensure initial System Administrator and PMIS data exist
def init_system_admin():
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL.lower()).first()
        if not admin_user:
            admin_user = User(
                email=settings.ADMIN_EMAIL.lower(),
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                role="ADMIN"
            )
            db.add(admin_user)
            db.commit()
            logger.info(f"System administrator account created: {settings.ADMIN_EMAIL}")
    except Exception as e:
        logger.error(f"Failed to verify/create system administrator: {e}")
        db.rollback()
    finally:
        db.close()

def auto_seed_pmis():
    try:
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        if root_dir not in sys.path:
            sys.path.insert(0, root_dir)
        from database.init_pmis_opportunities import init_pmis_opportunities
        init_pmis_opportunities()
    except Exception as e:
        logger.warning(f"PMIS auto-seed status: {e}")

init_system_admin()
auto_seed_pmis()

# 3. Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Real-world AI-Powered Internship Allocation Engine for the Prime Minister's Internship Scheme",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# 4. CORS configuration (permits any origin from any mobile or laptop)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Static uploads directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=os.path.dirname(settings.UPLOAD_DIR)), name="uploads")

# 6. Mount API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    db_ok = check_db_connection()
    return {
        "status": "healthy" if db_ok else "degraded",
        "database": "connected" if db_ok else "unavailable"
    }

# 7. Unified Frontend SPA Serving (production single-link support)
from fastapi.responses import FileResponse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FRONTEND_DIST = os.path.join(BASE_DIR, "frontend", "dist")

if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    def serve_root():
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"status": "online", "message": "Frontend build not detected."}

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        # Prevent intercepting API routes or health
        if full_path.startswith("api/") or full_path == "health" or full_path.startswith("docs") or full_path.startswith("openapi"):
            return {"detail": "Not Found"}
        target_file = os.path.join(FRONTEND_DIST, full_path)
        if os.path.isfile(target_file):
            return FileResponse(target_file)
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"detail": "Not Found"}
else:
    @app.get("/")
    def root():
        db_ok = check_db_connection()
        return {
            "status": "online" if db_ok else "database_disconnected",
            "service": settings.PROJECT_NAME,
            "database_connected": db_ok,
            "docs_url": "/docs",
            "api_v1": settings.API_V1_STR
        }
