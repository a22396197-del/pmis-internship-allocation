import re
from typing import List, Set

SKILL_TAXONOMY = {
    # Programming Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "c", "go", "rust", "ruby", "php", "swift", "kotlin", "r", "matlab", "scala",
    
    # Web & Full Stack
    "react", "react.js", "next.js", "vue", "vue.js", "angular", "node.js", "express", "django", "flask", "fastapi", "spring boot", "asp.net",
    "html", "html5", "css", "css3", "tailwind css", "tailwind", "bootstrap", "graphql", "rest api", "soap",
    
    # Databases & Big Data
    "sql", "postgresql", "mysql", "sqlite", "mongodb", "redis", "elasticsearch", "cassandra", "oracle", "snowflake", "dynamodb", "firebase",
    
    # Cloud, DevOps & Tools
    "aws", "azure", "gcp", "docker", "kubernetes", "git", "github", "gitlab", "ci/cd", "terraform", "jenkins", "linux", "nginx", "apache",
    
    # AI, ML & Data Science
    "machine learning", "deep learning", "nlp", "computer vision", "artificial intelligence", "data analysis", "data science",
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "keras", "opencv", "power bi", "tableau", "excel", "llm", "genai",
    
    # Electronics, Core & IoT
    "embedded systems", "iot", "arduino", "raspberry pi", "vlsi", "matlab/simulink", "autocad", "solidworks", "plc", "scada", "pcb design",
    
    # Management & Soft Skills
    "project management", "agile", "scrum", "product management", "business analysis", "communication", "leadership", "digital marketing",
    "seo", "content writing", "ui/ux", "figma", "wireframing", "accounting", "financial analysis"
}

def extract_skills_from_text(text: str) -> List[str]:
    """
    Extract recognized skills from arbitrary resume or job text using normalized matching.
    """
    if not text:
        return []

    lowered_text = text.lower()
    found_skills: Set[str] = set()

    for skill in SKILL_TAXONOMY:
        # Match as whole word / token boundary
        pattern = r"(?<![a-zA-Z0-9])" + re.escape(skill) + r"(?![a-zA-Z0-9])"
        if re.search(pattern, lowered_text):
            # Standardize casing
            found_skills.add(skill.title() if len(skill) > 3 else skill.upper())

    return sorted(list(found_skills))
