# API Specification

Base URL: `http://localhost:8000/api/v1`

---

## Authentication (`/auth`)

- `POST /auth/register`: Register new user (`email`, `password`, `role`).
- `POST /auth/login`: Authenticate and obtain JWT access token.
- `GET /auth/me`: Fetch authenticated user profile details.

---

## Students (`/students`)

- `GET /students/profile`: Get student profile with academic history, skills, and projects.
- `PUT /students/profile`: Update contact details, location, and career interests.
- `POST /students/resume/upload`: Upload PDF/TXT resume and trigger NLP parsing.
- `POST /students/skills`: Add skill manually.
- `DELETE /students/skills/{id}`: Delete skill.
- `POST /students/projects`: Add practical project.
- `DELETE /students/projects/{id}`: Delete project.

---

## Companies & Internships (`/companies`, `/internships`)

- `GET /companies/profile`: Get recruiter profile.
- `PUT /companies/profile`: Update company details.
- `GET /companies/dashboard-stats`: Aggregate recruiter metrics.
- `GET /internships`: Search open internships with filters (`search`, `location`, `industry`).
- `POST /internships`: Create internship posting (recruiter role).
- `GET /internships/{id}/candidates`: Fetch ranked candidate recommendations with 0–100 match breakdown.

---

## Matching & Applications (`/matching`, `/applications`)

- `GET /matching/recommendations`: Top internships for logged-in student, ranked by AI match score.
- `GET /matching/calculate/{id}`: Calculate on-the-fly score breakdown for a specific internship.
- `POST /applications`: Submit application.
- `GET /applications/my`: Current student's application tracking list.
- `PUT /applications/{id}/status`: Update candidate application status.

---

## Admin & Policy (`/admin`)

- `GET /admin/stats`: National macro KPIs.
- `GET /admin/analytics/skills`: Side-by-side skill demand vs. supply comparison.
- `GET /admin/analytics/geographic`: State-wise candidate representation and opportunity distribution.
- `POST /admin/allocation/run`: Execute the automated fairness-constrained allocation engine.
- `GET /admin/allocation/history`: Review past batch allocation logs.
