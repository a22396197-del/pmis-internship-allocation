import sys
import os

# Put backend root on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.models.user import User
from app.models.student import StudentProfile, StudentSkill
from app.models.company import CompanyProfile
from app.models.internship import Internship

client = TestClient(app)

def test_1_database_starts_clean():
    """Verify that no fake students, fake companies, or fake internships exist."""
    db = SessionLocal()
    try:
        # Check students count
        students_count = db.query(StudentProfile).count()
        assert students_count == 0, f"Expected 0 students in clean DB, found {students_count}"

        # Check companies count
        companies_count = db.query(CompanyProfile).count()
        assert companies_count == 0, f"Expected 0 companies in clean DB, found {companies_count}"

        # Check internships count
        internships_count = db.query(Internship).count()
        assert internships_count == 0, f"Expected 0 internships in clean DB, found {internships_count}"

        print("[OK] Test 1 Passed: Database starts completely clean with 0 mock entities.")
    finally:
        db.close()

def test_2_real_student_registration():
    """Register an actual student and verify database record."""
    reg_payload = {
        "name": "Abhishek Kumar",
        "email": "abhishek.student@test.gov.in",
        "password": "RealPassword123!",
        "role": "STUDENT",
        "phone": "+91 9876543210"
    }
    response = client.post("/api/v1/auth/register", json=reg_payload)
    assert response.status_code == 200, f"Registration failed: {response.text}"
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["role"] == "STUDENT"
    assert token_data["email"] == reg_payload["email"]
    assert token_data["name"] == "Abhishek Kumar"

    # Verify directly in database
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == reg_payload["email"]).first()
        assert user is not None, "User not found in DB!"
        assert user.role == "STUDENT"
        assert user.hashed_password != reg_payload["password"], "Password was NOT hashed!"
        
        # Verify profile is initialized with actual user name and NO fake data
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
        assert profile is not None, "StudentProfile not found in DB!"
        assert profile.full_name == "Abhishek Kumar"
        assert profile.education_level == ""  # Empty until filled by student
        assert profile.cgpa_or_percentage is None  # No fake 7.5

        print("[OK] Test 2 Passed: Student registered, password bcrypt-hashed, real profile created in DB.")
    finally:
        db.close()

def test_3_real_login_and_validation():
    """Test login with valid and invalid passwords."""
    # Invalid password
    bad_res = client.post("/api/v1/auth/login", json={
        "email": "abhishek.student@test.gov.in",
        "password": "WrongPassword"
    })
    assert bad_res.status_code == 401, "Expected 401 on wrong password"

    # Valid password
    good_res = client.post("/api/v1/auth/login", json={
        "email": "abhishek.student@test.gov.in",
        "password": "RealPassword123!"
    })
    assert good_res.status_code == 200, f"Login failed: {good_res.text}"
    token = good_res.json()["access_token"]
    assert token, "No token returned on valid login"

    print("[OK] Test 3 Passed: Password verification and JWT generation working correctly.")
    return token

def test_4_real_student_profile_persistence(token: str):
    """Update profile and skills, verify changes persist in the database."""
    headers = {"Authorization": f"Bearer {token}"}

    # Update profile
    update_payload = {
        "full_name": "Abhishek Kumar",
        "education_level": "B.Tech",
        "field_of_study": "Computer Science & Engineering",
        "institution_name": "National Institute of Technology",
        "graduation_year": 2026,
        "cgpa_or_percentage": 8.75,
        "home_city": "Patna",
        "home_state": "Bihar",
        "preferred_locations": ["Bengaluru", "Hyderabad", "Remote"],
        "career_interests": ["Backend Systems", "Distributed Computing"],
        "industry_preferences": ["IT & Software"]
    }
    update_res = client.put("/api/v1/students/profile", json=update_payload, headers=headers)
    assert update_res.status_code == 200, f"Profile update failed: {update_res.text}"

    # Add a real skill
    skill_res = client.post("/api/v1/students/skills", json={"skill_name": "Python"}, headers=headers)
    assert skill_res.status_code == 200

    # Verify directly via DB query
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "abhishek.student@test.gov.in").first()
        sp = user.student_profile
        assert sp.cgpa_or_percentage == 8.75, "CGPA was not persisted!"
        assert sp.home_city == "Patna", "Home city was not persisted!"
        assert sp.education_level == "B.Tech", "Education level was not persisted!"
        assert len(sp.skills) == 1, "Skill was not persisted in DB!"
        assert sp.skills[0].skill_name == "Python"

        print("[OK] Test 4 Passed: Profile edits and skills persisted directly in database.")
    finally:
        db.close()

def test_5_real_company_and_internship_persistence():
    """Register a real company and post an actual internship."""
    company_payload = {
        "name": "Bharat Innovations Ltd",
        "email": "careers@bharatinnovations.in",
        "password": "EnterpriseSecret2026!",
        "role": "COMPANY"
    }
    reg_res = client.post("/api/v1/auth/register", json=company_payload)
    assert reg_res.status_code == 200
    comp_token = reg_res.json()["access_token"]
    comp_headers = {"Authorization": f"Bearer {comp_token}"}

    # Post an actual internship
    job_payload = {
        "title": "Cloud Backend Engineer Intern",
        "description": "Develop microservices in Python and optimize database queries.",
        "required_skills": ["Python", "PostgreSQL", "FastAPI"],
        "min_education_level": "B.Tech",
        "preferred_locations": ["Bengaluru", "Remote"],
        "industry": "IT & Software",
        "min_cgpa": 7.0,
        "vacancies": 3,
        "stipend_amount": 18000.0,
        "duration_months": 6
    }
    job_res = client.post("/api/v1/internships", json=job_payload, headers=comp_headers)
    assert job_res.status_code == 200, f"Internship posting failed: {job_res.text}"
    job_id = job_res.json()["id"]

    # Verify in DB
    db = SessionLocal()
    try:
        internship = db.query(Internship).filter(Internship.id == job_id).first()
        assert internship is not None, "Internship not found in DB!"
        assert internship.title == "Cloud Backend Engineer Intern"
        assert internship.vacancies == 3
        assert "Python" in internship.required_skills

        print("[OK] Test 5 Passed: Company registration and internship posting persisted in DB.")
    finally:
        db.close()

if __name__ == "__main__":
    test_1_database_starts_clean()
    test_2_real_student_registration()
    token = test_3_real_login_and_validation()
    test_4_real_student_profile_persistence(token)
    test_5_real_company_and_internship_persistence()
    print("\n=======================================================")
    print("ALL REAL AUTHENTICATION & PERSISTENCE TESTS PASSED 100%")
    print("=======================================================")
