# Database Architecture & Schema

This directory contains the database migration scripts, DDL schema definitions, and relationship mappings for the **AI-Powered Internship Allocation Engine**.

---

## Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o| STUDENT_PROFILES : "has"
    USERS ||--o| COMPANY_PROFILES : "has"

    STUDENT_PROFILES ||--o{ STUDENT_SKILLS : "possesses"
    STUDENT_PROFILES ||--o{ STUDENT_PROJECTS : "showcases"
    STUDENT_PROFILES ||--o{ STUDENT_EXPERIENCES : "has"
    STUDENT_PROFILES ||--o{ APPLICATIONS : "submits"

    COMPANY_PROFILES ||--o{ INTERNSHIPS : "publishes"

    INTERNSHIPS ||--o{ APPLICATIONS : "receives"

    USERS {
        string id PK
        string email
        string hashed_password
        string role
        boolean is_active
        timestamp created_at
    }

    STUDENT_PROFILES {
        string id PK
        string user_id FK
        string full_name
        string education_level
        float cgpa_or_percentage
        string home_city
        string home_state
        json preferred_locations
        json career_interests
        json industry_preferences
        string resume_file_path
        text resume_raw_text
        json extracted_skills
    }

    COMPANY_PROFILES {
        string id PK
        string user_id FK
        string company_name
        string industry
        string location_city
        string location_state
    }

    INTERNSHIPS {
        string id PK
        string company_id FK
        string title
        text description
        json required_skills
        string min_education_level
        json preferred_locations
        string industry
        int vacancies
        int allocated_count
        float stipend_amount
        string status
    }

    APPLICATIONS {
        string id PK
        string student_id FK
        string internship_id FK
        string status
        float match_score
        json score_breakdown
        timestamp applied_at
        timestamp allocated_at
    }

    ALLOCATION_RUNS {
        string id PK
        timestamp run_date
        int total_candidates_considered
        int total_internships_available
        int total_allocated
        json fairness_metrics
        string status
    }
```

---

## Configuration

- **PostgreSQL**: Set the environment variable `DATABASE_URL` in `.env` or system environment:
  ```
  DATABASE_URL=postgresql://postgres:password@localhost:5432/pm_internship
  ```
- **SQLite Fallback**: If no database URL is set, the engine smoothly defaults to local SQLite (`sqlite:///./internship_engine.db`).
