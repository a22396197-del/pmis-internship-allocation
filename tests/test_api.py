import sys
import os

# Put project root and backend on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api_health():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "online"

def test_demo_seed_endpoint():
    res = client.post("/api/v1/seed-demo-data")
    assert res.status_code == 200
    assert "message" in res.json()

def test_student_and_admin_workflow():
    # 1. Admin login
    admin_login = client.post("/api/v1/auth/login", json={
        "email": "admin@pmscheme.gov.in",
        "password": "admin123"
    })
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 2. Check stats
    stats_res = client.get("/api/v1/admin/stats", headers=admin_headers)
    assert stats_res.status_code == 200
    assert stats_res.json()["total_students"] > 0

    # 3. Student login
    student_login = client.post("/api/v1/auth/login", json={
        "email": "aarav.sharma@example.com",
        "password": "student123"
    })
    assert student_login.status_code == 200
    student_token = student_login.json()["access_token"]
    student_headers = {"Authorization": f"Bearer {student_token}"}

    # 4. Get recommendations
    rec_res = client.get("/api/v1/matching/recommendations", headers=student_headers)
    assert rec_res.status_code == 200
    recs = rec_res.json()
    assert len(recs) > 0
    assert 0 <= recs[0]["match_score"] <= 100

if __name__ == "__main__":
    test_api_health()
    test_demo_seed_endpoint()
    test_student_and_admin_workflow()
    print("API tests passed successfully!")
