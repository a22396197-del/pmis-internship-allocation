from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User
from app.models.student import StudentProfile
from app.models.company import CompanyProfile
from app.schemas.user import UserCreate, UserLogin, Token, UserOut
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # 1. Check if email already exists
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please sign in instead."
        )

    # 2. Securely hash password and create user in database
    user = User(
        email=user_in.email.lower(),
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role.upper()
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 3. Create initial clean profile with NO FAKE DATA
    full_name = user_in.name.strip()
    if user.role == "STUDENT":
        profile = StudentProfile(
            user_id=user.id,
            full_name=full_name,
            phone=user_in.phone or "",
            education_level="",
            field_of_study="",
            institution_name="",
            graduation_year=None,
            cgpa_or_percentage=None,
            home_city="",
            home_state="",
            preferred_locations=[],
            career_interests=[],
            industry_preferences=[],
            extracted_skills=[],
            bio=""
        )
        db.add(profile)
        db.commit()
    elif user.role == "COMPANY":
        company = CompanyProfile(
            user_id=user.id,
            company_name=full_name,
            industry="",
            website="",
            location_city="",
            location_state="",
            description=""
        )
        db.add(company)
        db.commit()

    # 4. Generate JWT access token
    token = create_access_token(subject=user.id, role=user.role)
    return Token(
        access_token=token,
        token_type="bearer",
        role=user.role,
        user_id=user.id,
        email=user.email,
        name=full_name
    )

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email.lower()).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is deactivated. Contact system administrator."
        )

    # Resolve display name
    name = user.email.split("@")[0]
    if user.role == "STUDENT" and user.student_profile and user.student_profile.full_name:
        name = user.student_profile.full_name
    elif user.role == "COMPANY" and user.company_profile and user.company_profile.company_name:
        name = user.company_profile.company_name

    token = create_access_token(subject=user.id, role=user.role)
    return Token(
        access_token=token,
        token_type="bearer",
        role=user.role,
        user_id=user.id,
        email=user.email,
        name=name
    )

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile_data = None
    if current_user.role == "STUDENT" and current_user.student_profile:
        sp = current_user.student_profile
        profile_data = {
            "profile_id": sp.id,
            "full_name": sp.full_name,
            "education_level": sp.education_level,
            "home_city": sp.home_city,
            "home_state": sp.home_state,
            "is_profile_complete": bool(sp.education_level and sp.home_city and (sp.skills or sp.extracted_skills))
        }
    elif current_user.role == "COMPANY" and current_user.company_profile:
        cp = current_user.company_profile
        profile_data = {
            "company_id": cp.id,
            "company_name": cp.company_name,
            "industry": cp.industry,
            "is_profile_complete": bool(cp.industry and cp.location_city)
        }

    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "profile": profile_data
    }
