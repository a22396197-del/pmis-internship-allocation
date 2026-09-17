-- ==========================================================
-- AI-Powered Internship Allocation Engine - Database Schema
-- Prime Minister's Internship Scheme Prototype
-- ==========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT', -- STUDENT, COMPANY, ADMIN
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Student Profiles Table
CREATE TABLE IF NOT EXISTS student_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    education_level VARCHAR(100) DEFAULT 'B.Tech',
    field_of_study VARCHAR(150),
    institution_name VARCHAR(255),
    graduation_year INTEGER,
    cgpa_or_percentage NUMERIC(4, 2) DEFAULT 7.5,
    home_city VARCHAR(100) DEFAULT '',
    home_state VARCHAR(100) DEFAULT '',
    preferred_locations JSON DEFAULT '[]',
    career_interests JSON DEFAULT '[]',
    industry_preferences JSON DEFAULT '[]',
    resume_file_path VARCHAR(500),
    resume_raw_text TEXT,
    extracted_skills JSON DEFAULT '[]',
    bio TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_user ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_state ON student_profiles(home_state);

-- 3. Student Skills Table
CREATE TABLE IF NOT EXISTS student_skills (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(20) DEFAULT 'INTERMEDIATE',
    is_verified BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_skills_student ON student_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_skills_name ON student_skills(skill_name);

-- 4. Student Projects Table
CREATE TABLE IF NOT EXISTS student_projects (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    technologies JSON DEFAULT '[]',
    github_url VARCHAR(500),
    live_demo_url VARCHAR(500)
);

CREATE INDEX IF NOT EXISTS idx_projects_student ON student_projects(student_id);

-- 5. Student Experiences Table
CREATE TABLE IF NOT EXISTS student_experiences (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    duration_months INTEGER DEFAULT 1,
    description TEXT
);

CREATE INDEX IF NOT EXISTS idx_experience_student ON student_experiences(student_id);

-- 6. Company Profiles Table
CREATE TABLE IF NOT EXISTS company_profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(150) DEFAULT 'IT & Software',
    website VARCHAR(255),
    location_city VARCHAR(100) DEFAULT '',
    location_state VARCHAR(100) DEFAULT '',
    description TEXT,
    logo_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_company_user ON company_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_company_industry ON company_profiles(industry);

-- 7. Internships Table
CREATE TABLE IF NOT EXISTS internships (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    required_skills JSON DEFAULT '[]',
    min_education_level VARCHAR(100) DEFAULT 'Any',
    preferred_locations JSON DEFAULT '[]',
    industry VARCHAR(150) DEFAULT 'IT & Software',
    min_cgpa NUMERIC(4, 2) DEFAULT 6.0,
    vacancies INTEGER DEFAULT 1,
    allocated_count INTEGER DEFAULT 0,
    stipend_amount NUMERIC(10, 2) DEFAULT 10000.0,
    duration_months INTEGER DEFAULT 3,
    status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, CLOSED, FILLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_internship_company ON internships(company_id);
CREATE INDEX IF NOT EXISTS idx_internship_status ON internships(status);

-- 8. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    internship_id VARCHAR(36) NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'APPLIED', -- APPLIED, SHORTLISTED, ALLOCATED, REJECTED, ACCEPTED
    match_score NUMERIC(5, 2) DEFAULT 0.0,
    score_breakdown JSON DEFAULT '{}',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    allocated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_app_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_app_internship ON applications(internship_id);
CREATE INDEX IF NOT EXISTS idx_app_status ON applications(status);

-- 9. Allocation Runs Table
CREATE TABLE IF NOT EXISTS allocation_runs (
    id VARCHAR(36) PRIMARY KEY,
    run_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_candidates_considered INTEGER DEFAULT 0,
    total_internships_available INTEGER DEFAULT 0,
    total_allocated INTEGER DEFAULT 0,
    fairness_metrics JSON DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'COMPLETED'
);
