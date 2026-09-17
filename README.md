# AI-Powered Internship Allocation Engine

An intelligent matching and allocation engine inspired by the **Prime Minister's Internship Scheme (PMIS)**, developed as a high-impact hackathon prototype.

---

## Key Features

1. **Role-Based Portals**:
   - **Student**: Profile management, resume upload with NLP parsing, transparent match scores, one-click apply, application tracking.
   - **Company**: Post internships, specify technical/education requirements, inspect AI-ranked candidate pools, shortlist candidates.
   - **Admin**: National KPI monitoring, Recharts-powered skill demand vs. supply gaps, state-wise student participation, and the automated fairness allocation engine.

2. **Transparent 6-Factor Matching Model (0 to 100)**:
   - **Skills Alignment (40%)**: Jaccard and semantic similarity between student skills and job requirements.
   - **Education & CGPA (20%)**: Degree level compatibility and academic benchmark achievement.
   - **Candidate Preference (15%)**: Semantic alignment with aspirational career interests.
   - **Location Compatibility (10%)**: Preferred cities, home city/state matching, or remote willingness.
   - **Experience & Projects (10%)**: Completed projects, tech stack overlap, and practical tenure.
   - **Industry Interest (5%)**: Synergistic domain interest with the company's sector.

3. **Autonomous Fairness & Geographic Allocation Engine**:
   - Implements **Multi-Constrained Deferred Acceptance (Gale-Shapley)**.
   - Enforces company vacancy caps and single-assignment guarantees.
   - Applies affirmative regional quotas to avoid over-concentration in tier-1 metro hubs and reserve opportunities for aspirational districts.

4. **NLP Resume Parser**:
   - Ingests PDF and text resumes, segments sections, and extracts technical competencies into a verified skills portfolio.

---

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, React Router DOM, Axios, Recharts, Lucide Icons.
- **Backend**: Python 3, FastAPI, SQLAlchemy ORM, Pydantic v2, JWT Security (Bcrypt).
- **Database**: PostgreSQL support via `DATABASE_URL` (with automatic fallback to SQLite for local evaluation).
- **AI & NLP**: Python NLP, scikit-learn, TF-IDF + Cosine Vectorization, Sentence Transformers architecture.

---

## Quick Start Guide

### 1. Start the Backend API

```powershell
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
- API Documentation (Swagger UI): `http://localhost:8000/docs`

### 2. Start the Frontend Application

```powershell
cd frontend
npm run dev
```
- Web Application: `http://localhost:5173`

---

## Demo Credentials

The prototype comes with pre-seeded PM Scheme accounts:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@pmscheme.gov.in` | `admin123` | National analytics, fairness allocation engine |
| **Student** | `aarav.sharma@example.com` | `student123` | B.Tech student from Madhya Pradesh |
| **Student** | `priya.patel@example.com` | `student123` | Electronics student from Gujarat (EV / IoT) |
| **Company** | `careers@tatamotors.com` | `company123` | Tata Motors (Automotive / EV listings) |
| **Company** | `internships@infosys.com` | `company123` | Infosys Technologies (Cloud & AI listings) |
