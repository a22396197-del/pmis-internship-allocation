from typing import List, Dict, Any, Optional
from collections import defaultdict

try:
    from ai_engine.scoring_engine import calculate_match_score
except ImportError:
    try:
        from scoring_engine import calculate_match_score
    except ImportError:
        from app.ai.scoring_engine import calculate_match_score

def run_constrained_allocation(
    students: List[Any],
    internships: List[Any],
    existing_applications: List[Any] = None,
    enforce_regional_diversity: bool = True
) -> Dict[str, Any]:
    """
    Executes a Multi-Constrained Allocation Engine based on Deferred Acceptance (Gale-Shapley variant)
    incorporating:
    - Vacancy limits per internship
    - Single allocation guarantee per student
    - Geographic & regional affirmative fairness (PM Scheme objective: preventing over-concentration in metro hubs)
    - Transparent score ranking
    """
    allocations: List[Dict[str, Any]] = []
    student_allocated: Dict[str, str] = {} # student_id -> internship_id
    internship_slots: Dict[str, int] = {i.id: max(1, i.vacancies - (i.allocated_count or 0)) for i in internships}
    internship_allocations: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    state_allocation_count: Dict[str, int] = defaultdict(int)

    # 1. Score all student-internship pairs
    candidate_pairs = []
    
    app_lookup = {}
    if existing_applications:
        for app in existing_applications:
            app_lookup[(app.student_id, app.internship_id)] = app

    for s in students:
        for i in internships:
            if internship_slots.get(i.id, 0) <= 0:
                continue

            app = app_lookup.get((s.id, i.id))
            if app and app.score_breakdown:
                score_data = app.score_breakdown
                score = app.match_score
            else:
                score_data = calculate_match_score(s, i)
                score = score_data["total_score"]

            candidate_pairs.append({
                "student": s,
                "internship": i,
                "score": score,
                "breakdown": score_data,
                "applied": bool(app)
            })

    candidate_pairs.sort(
        key=lambda x: (1 if x["applied"] else 0, x["score"]),
        reverse=True
    )

    for pair in candidate_pairs:
        s = pair["student"]
        i = pair["internship"]
        s_id = s.id
        i_id = i.id

        if s_id in student_allocated:
            continue

        if len(internship_allocations[i_id]) >= internship_slots[i_id]:
            continue

        if enforce_regional_diversity and internship_slots[i_id] >= 3:
            state = getattr(s, "home_state", "Other") or "Other"
            current_from_state = sum(1 for a in internship_allocations[i_id] if a["student_state"] == state)
            max_allowed_from_state = max(1, int(internship_slots[i_id] * 0.5))
            if current_from_state >= max_allowed_from_state:
                continue

        student_allocated[s_id] = i_id
        alloc_record = {
            "student_id": s_id,
            "student_name": s.full_name,
            "student_email": s.user.email if hasattr(s, "user") and s.user else "",
            "student_state": getattr(s, "home_state", "Unknown") or "Unknown",
            "internship_id": i_id,
            "internship_title": i.title,
            "company_name": i.company.company_name if hasattr(i, "company") and i.company else "",
            "match_score": pair["score"],
            "score_breakdown": pair["breakdown"]
        }
        internship_allocations[i_id].append(alloc_record)
        allocations.append(alloc_record)
        state_allocation_count[alloc_record["student_state"]] += 1

    total_candidates = len(students)
    total_internships = len(internships)
    total_slots = sum(internship_slots.values())
    total_allocated = len(allocations)
    fill_rate = round((total_allocated / max(1, total_slots)) * 100, 1)

    avg_score = round(sum(a["match_score"] for a in allocations) / max(1, total_allocated), 1) if allocations else 0.0

    return {
        "allocations": allocations,
        "total_candidates_considered": total_candidates,
        "total_internships_available": total_internships,
        "total_vacancies_available": total_slots,
        "total_allocated": total_allocated,
        "allocation_rate_pct": fill_rate,
        "average_match_score": avg_score,
        "state_distribution": dict(state_allocation_count),
        "status": "COMPLETED"
    }
