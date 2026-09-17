import re
from typing import Dict, Any, List
from pypdf import PdfReader
from app.ai.skill_extractor import extract_skills_from_text

def extract_text_from_pdf(file_path: str) -> str:
    """Extract full raw text from a PDF document."""
    try:
        reader = PdfReader(file_path)
        text_parts = []
        for page in reader.pages:
            content = page.extract_text()
            if content:
                text_parts.append(content)
        return "\n".join(text_parts)
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def parse_resume_content(raw_text: str) -> Dict[str, Any]:
    """
    Analyzes raw resume text and extracts structured fields:
    - Extracted skills
    - Detected education level
    - Estimated contact info
    """
    if not raw_text:
        return {
            "skills": [],
            "education_level": "B.Tech",
            "field_of_study": None,
            "cgpa_estimate": None
        }

    skills = extract_skills_from_text(raw_text)

    # Detect degree / education level
    education_level = "B.Tech"
    lowered = raw_text.lower()
    if "m.tech" in lowered or "master" in lowered or "mca" in lowered:
        education_level = "Postgraduate / Master's"
    elif "b.tech" in lowered or "bachelor of technology" in lowered or "b.e" in lowered:
        education_level = "B.Tech / B.E."
    elif "bca" in lowered or "b.sc" in lowered or "bachelor" in lowered:
        education_level = "Bachelor's Degree"
    elif "diploma" in lowered or "polytechnic" in lowered:
        education_level = "Diploma"

    # Field of study heuristic
    field_of_study = "Computer Science & Engineering"
    if "mechanical" in lowered:
        field_of_study = "Mechanical Engineering"
    elif "electrical" in lowered or "electronics" in lowered:
        field_of_study = "Electronics & Communication"
    elif "civil" in lowered:
        field_of_study = "Civil Engineering"
    elif "data science" in lowered:
        field_of_study = "Data Science"
    elif "commerce" in lowered or "b.com" in lowered:
        field_of_study = "Commerce / Finance"

    # CGPA / percentage regex
    cgpa_estimate = None
    cgpa_match = re.search(r"(?:cgpa|gpa|pointer)[\s:]*([0-9]\.[0-9]+|[0-9]+(?:\.[0-9]+)?)", lowered)
    if cgpa_match:
        try:
            val = float(cgpa_match.group(1))
            if 4.0 <= val <= 10.0:
                cgpa_estimate = val
        except ValueError:
            pass

    return {
        "skills": skills,
        "education_level": education_level,
        "field_of_study": field_of_study,
        "cgpa_estimate": cgpa_estimate
    }
