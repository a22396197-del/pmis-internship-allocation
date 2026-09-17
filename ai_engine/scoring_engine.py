from typing import Dict, Any, List

try:
    from ai_engine.embeddings import calculate_text_similarity
except ImportError:
    try:
        from embeddings import calculate_text_similarity
    except ImportError:
        from app.ai.embeddings import calculate_text_similarity

def calculate_match_score(student: Any, internship: Any) -> Dict[str, Any]:
    """
    Calculates a transparent match score from 0 to 100 between a student profile and an internship.
    Formula:
      - Skills: 40%
      - Education: 20%
      - Candidate Preference: 15%
      - Location Compatibility: 10%
      - Experience / Projects: 10%
      - Industry Interest: 5%
    """
    # 1. Skills Match (40%)
    req_skills = [s.strip().lower() for s in (internship.required_skills or []) if s.strip()]
    student_skills_list = []
    
    if hasattr(student, 'skills') and student.skills:
        student_skills_list.extend([s.skill_name.strip().lower() for s in student.skills])
    if hasattr(student, 'extracted_skills') and student.extracted_skills:
        student_skills_list.extend([s.strip().lower() for s in student.extracted_skills])
    
    student_skills_set = set(student_skills_list)
    
    matched_skills = []
    missing_skills = []
    
    if req_skills:
        for r_skill in req_skills:
            found = False
            for s_skill in student_skills_set:
                if r_skill == s_skill or r_skill in s_skill or s_skill in r_skill:
                    found = True
                    break
            if found:
                matched_skills.append(r_skill)
            else:
                missing_skills.append(r_skill)
        skill_ratio = len(matched_skills) / len(req_skills)
        skills_score = round(skill_ratio * 40.0, 1)
    else:
        skills_score = 35.0
        matched_skills = list(student_skills_set)[:3]

    # 2. Education Match (20%)
    edu_pts = 12.0
    req_min_edu = (internship.min_education_level or "Any").lower()
    stud_edu = (student.education_level or "B.Tech").lower()
    
    if req_min_edu != "any":
        if "master" in req_min_edu or "m.tech" in req_min_edu:
            if not ("master" in stud_edu or "m.tech" in stud_edu or "mca" in stud_edu):
                edu_pts = 6.0
        elif "bachelor" in req_min_edu or "b.tech" in req_min_edu:
            if "diploma" in stud_edu:
                edu_pts = 7.0

    stud_cgpa = getattr(student, "cgpa_or_percentage", 7.5) or 7.5
    min_cgpa = getattr(internship, "min_cgpa", 6.0) or 6.0
    if stud_cgpa >= min_cgpa:
        cgpa_pts = 8.0
    else:
        cgpa_pts = max(2.0, round((stud_cgpa / max(min_cgpa, 1.0)) * 8.0, 1))

    education_score = round(edu_pts + cgpa_pts, 1)

    # 3. Candidate Preference (15%)
    interests = student.career_interests or []
    interests_text = " ".join(interests) if isinstance(interests, list) else str(interests)
    internship_text = f"{internship.title} {internship.description or ''}"
    
    if interests_text.strip():
        pref_sim = calculate_text_similarity(interests_text, internship_text)
        preference_score = round(pref_sim * 15.0, 1)
        preference_score = max(5.0, preference_score)
    else:
        preference_score = 9.0

    # 4. Location Compatibility (10%)
    req_locations = [l.strip().lower() for l in (internship.preferred_locations or []) if l.strip()]
    pref_locations = [l.strip().lower() for l in (student.preferred_locations or []) if l.strip()]
    home_city = (student.home_city or "").strip().lower()
    home_state = (student.home_state or "").strip().lower()

    if any("remote" in l for l in req_locations) or any("remote" in l for l in pref_locations):
        location_score = 10.0
        loc_reason = "Remote opportunity / Remote preference matched"
    elif any(l in pref_locations for l in req_locations):
        location_score = 10.0
        loc_reason = "Matched preferred location"
    elif any(home_city and home_city in l for l in req_locations):
        location_score = 9.0
        loc_reason = "Matches candidate's home city"
    elif any(home_state and home_state in l for l in req_locations):
        location_score = 6.0
        loc_reason = "Matches candidate's home state"
    else:
        location_score = 4.0
        loc_reason = "Relocation required"

    # 5. Experience / Projects (10%)
    project_pts = 0.0
    projects = getattr(student, "projects", []) or []
    experiences = getattr(student, "experiences", []) or []
    
    for p in projects:
        techs = [t.lower() for t in (p.technologies or [])]
        overlap = [t for t in techs if any(r in t or t in r for r in req_skills)]
        if overlap:
            project_pts += 3.0
        else:
            project_pts += 1.5

    exp_pts = len(experiences) * 2.5
    experience_score = min(10.0, round(project_pts + exp_pts, 1))
    if experience_score == 0 and (projects or experiences):
        experience_score = 4.0

    # 6. Industry Interest (5%)
    student_industries = [i.strip().lower() for i in (student.industry_preferences or []) if i.strip()]
    company_industry = (internship.industry or "").strip().lower()

    if any(company_industry in si or si in company_industry for si in student_industries):
        industry_score = 5.0
        ind_reason = f"Candidate is interested in {internship.industry}"
    elif student_industries:
        industry_score = 2.5
        ind_reason = "Related domain interest"
    else:
        industry_score = 3.0
        ind_reason = "General industry preference"

    total_score = round(
        skills_score + education_score + preference_score + location_score + experience_score + industry_score,
        1
    )
    total_score = min(100.0, max(0.0, total_score))

    breakdown = {
        "skills_score": skills_score,
        "education_score": education_score,
        "preference_score": preference_score,
        "location_score": location_score,
        "experience_score": experience_score,
        "industry_score": industry_score,
        "total_score": total_score,
        "details": {
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "location_reason": loc_reason,
            "industry_reason": ind_reason,
            "candidate_cgpa": stud_cgpa,
            "min_required_cgpa": min_cgpa,
        }
    }

    return breakdown
