# System Architecture

## Overview

The **AI-Powered Internship Allocation Engine** is built using a decoupled Client-Server architecture designed to scale seamlessly while delivering real-time multi-constraint matching and high transparency.

```mermaid
flowchart TD
    subgraph Client["Frontend Layer (React 18 + Vite + Tailwind)"]
        SP["Student Portal"]
        CP["Company Portal"]
        AP["Admin Portal"]
    end

    subgraph Server["API Gateway & Service Layer (FastAPI)"]
        AuthRouter["Auth & Security (JWT)"]
        StudentRouter["Student Services"]
        CompanyRouter["Company & Job Services"]
        MatchRouter["Matching & Application Services"]
        AdminRouter["National Policy & KPI Services"]
    end

    subgraph AI["AI Subsystem (Python / NLP)"]
        Parser["Resume Parser (PDF/TXT NLP)"]
        Taxonomy["Technical Skill Extractor"]
        Scorer["6-Factor Transparent Scoring Engine"]
        Allocator["Constrained Gale-Shapley Fairness Allocator"]
    end

    subgraph Data["Persistence Layer"]
        DB[("PostgreSQL / SQLite Database")]
        Storage["Resume File Storage"]
    end

    Client --> Server
    Server --> AI
    Server --> Data
    AI --> Data
```

## Directory Responsibilities

- **`frontend/`**: Interactive Single Page Application (SPA) with dedicated interfaces for Students, Companies, and Government Administrators.
- **`backend/`**: FastAPI REST server providing authentication, schema validation (Pydantic), and database transactions (SQLAlchemy).
- **`ai_engine/`**: Standalone NLP, embedding vectors, 0–100 scoring model, and Gale-Shapley matching algorithms.
- **`database/`**: DDL schemas, ER diagrams, indexing strategies, and database seeding routines.
- **`tests/`**: Integration and unit test suites covering the entire platform.
- **`docs/`**: Technical and policy documentation.
