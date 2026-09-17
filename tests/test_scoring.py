import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ai_engine")))

from scoring_engine import calculate_match_score

class MockStudent:
    def __init__(self, skills, edu="B.Tech", cgpa=8.0, city="Bengaluru", state="Karnataka", interests=None, industries=None):
        self.skills = [type("Skill", (), {"skill_name": s}) for s in skills]
        self.extracted_skills = []
        self.education_level = edu
        self.cgpa_or_percentage = cgpa
        self.home_city = city
        self.home_state = state
        self.preferred_locations = [city]
        self.career_interests = interests or ["Software Development"]
        self.industry_preferences = industries or ["IT & Software"]
        self.projects = []
        self.experiences = []

class MockInternship:
    def __init__(self, title, req_skills, min_edu="B.Tech", min_cgpa=6.0, locations=None, industry="IT & Software", vacancies=2):
        self.id = "test-internship-1"
        self.title = title
        self.description = "Test description"
        self.required_skills = req_skills
        self.min_education_level = min_edu
        self.min_cgpa = min_cgpa
        self.preferred_locations = locations or ["Bengaluru"]
        self.industry = industry
        self.vacancies = vacancies
        self.allocated_count = 0

def test_perfect_skills_match():
    student = MockStudent(skills=["Python", "React", "SQL", "FastAPI"])
    internship = MockInternship(title="Full Stack Intern", req_skills=["Python", "React", "SQL", "FastAPI"])
    result = calculate_match_score(student, internship)

    # Max score checks
    assert result["skills_score"] == 40.0
    assert result["education_score"] <= 20.0
    assert result["preference_score"] <= 15.0
    assert result["location_score"] <= 10.0
    assert result["experience_score"] <= 10.0
    assert result["industry_score"] <= 5.0
    assert 0.0 <= result["total_score"] <= 100.0
    assert result["total_score"] >= 80.0

def test_zero_skills_match():
    student = MockStudent(skills=["Civil Engineering", "AutoCAD"])
    internship = MockInternship(title="Python Developer", req_skills=["Python", "Django", "FastAPI"])
    result = calculate_match_score(student, internship)

    assert result["skills_score"] == 0.0
    assert 0.0 <= result["total_score"] <= 100.0

if __name__ == "__main__":
    test_perfect_skills_match()
    test_zero_skills_match()
    print("Scoring engine tests passed successfully!")
