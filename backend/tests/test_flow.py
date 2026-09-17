import sys
import os

# Ensure backend root is on PYTHONPATH
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_seed_demo_data():
    response = client.post("/api/v1/seed-demo-data")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data

def test_student_login():
    response = client.post("/api/v1/auth/login", json={
        "email": "aarav.sharma@example.com",
        "password": "student123"
    })
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token

    # Check recommendations for Aarav
    headers = {"Authorization": f"Bearer {token}"}
    rec_resp = client.get("/api/v1/matching/recommendations", headers=headers)
    assert rec_resp.status_code == 200
    recs = rec_resp.json()
    assert len(recs) > 0
    # Verify match score is between 0 and 100
    top_score = recs[0]["match_score"]
    assert 0 <= top_score <= 100
    assert "score_breakdown" in recs[0]
    breakdown = recs[0]["score_breakdown"]
    assert breakdown["skills_score"] <= 40
    assert breakdown["education_score"] <= 20
    assert breakdown["preference_score"] <= 15
    assert breakdown["location_score"] <= 10
    assert breakdown["experience_score"] <= 10
    assert breakdown["industry_score"] <= 5

def test_admin_allocation_run():
    # Login as admin
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "admin@pmscheme.gov.in",
        "password": "admin123"
    })
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    alloc_resp = client.post("/api/v1/admin/allocation/run?enforce_regional_diversity=true", headers=headers)
    assert alloc_resp.status_code == 200
    result = alloc_resp.json()
    assert result["status"] == "COMPLETED"
    assert result["total_allocated"] > 0
    assert result["total_candidates_considered"] > 0

    # Check stats
    stats_resp = client.get("/api/v1/admin/stats", headers=headers)
    assert stats_resp.status_code == 200
    stats = stats_resp.json()
    assert stats["total_students"] > 0
    assert stats["total_companies"] > 0

def test_analytics():
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "admin@pmscheme.gov.in",
        "password": "admin123"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    skill_res = client.get("/api/v1/admin/analytics/skills", headers=headers)
    assert skill_res.status_code == 200
    assert "skills_comparison" in skill_res.json()

    geo_res = client.get("/api/v1/admin/analytics/geographic", headers=headers)
    assert geo_res.status_code == 200
    assert "state_distribution" in geo_res.json()

if __name__ == "__main__":
    test_root()
    test_seed_demo_data()
    test_student_login()
    test_admin_allocation_run()
    test_analytics()
    print("ALL TESTS PASSED SUCCESSFULLY!")
