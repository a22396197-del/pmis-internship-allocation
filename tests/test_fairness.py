import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ai_engine")))

from fairness_allocator import run_constrained_allocation
from test_scoring import MockStudent, MockInternship

def test_allocation_capacity_and_single_assignment():
    students = [
        MockStudent(skills=["Python", "React"], state="Gujarat"),
        MockStudent(skills=["Python", "SQL"], state="Madhya Pradesh"),
        MockStudent(skills=["Python"], state="Maharashtra"),
    ]
    # Assign ids and names
    for idx, s in enumerate(students):
        s.id = f"student-{idx}"
        s.full_name = f"Student {idx}"
        s.user = type("User", (), {"email": f"s{idx}@test.com"})

    internships = [
        MockInternship(title="Python Intern", req_skills=["Python"], vacancies=2)
    ]
    internships[0].company = type("Company", (), {"company_name": "Tech Corp"})

    res = run_constrained_allocation(students, internships, enforce_regional_diversity=False)
    
    assert res["status"] == "COMPLETED"
    assert res["total_allocated"] <= 2  # Cannot exceed vacancies
    allocated_students = [a["student_id"] for a in res["allocations"]]
    assert len(allocated_students) == len(set(allocated_students))  # No double allocations

if __name__ == "__main__":
    test_allocation_capacity_and_single_assignment()
    print("Fairness allocator tests passed successfully!")
