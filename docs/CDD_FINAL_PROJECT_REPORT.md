# Collaborative Development & DevOps (CDD) — Final Project Report
## VeriCourse AI: An AI-Powered Educational Credibility & Verification Platform

**Academic Course:** Collaborative Development and DevOps (CDD)  
**Academic Reference:** Experiment 14 — Integrated Capstone Mini-Project  
**Author / Developer:** Saad Ahmed  
**Repository Branch:** `feature/backend-ai`  
**Date of Submission:** November 19, 2026

---

## 1. Project Abstract & Motivation

The proliferation of online learning platforms and technical bootcamps has created an asymmetry of information between education providers and prospective students. High-pressure sales funnels, unsubstantiated placement guarantees ("100% Guaranteed Job Placement"), and fraudulent accreditation claims mislead learners into substantial financial debt and career setbacks.

**VeriCourse AI** is an end-to-end, full-stack continuous trust intelligence platform. It ingests course materials and marketing copy, orchestrates a tri-agent artificial intelligence verification pipeline powered by Google Gemini, cross-references claims against empirical registries, calculates transparent multi-factor trust ratings, and serves interactive, 3D-visualized credibility reports to learners.

This project synthesizes all fourteen Collaborative Development and DevOps (CDD) laboratory experiments into an integrated software delivery lifecycle.

---

## 2. CDD Laboratory Experiments Fulfillment Summary

| Exp # | Experiment Title | Core Requirement | VeriCourse AI Implementation | Status |
| :---: | :--- | :--- | :--- | :---: |
| **1** | Git Basics & Configuration | Identity, staging, commits, log | Git repository tracking atomic commits (`bcb7584`), strict conventional commit messages. | **100% Completed** |
| **2** | Remote Git Operations | Remotes, fetch, pull, push | Configured upstream GitHub `origin`, sync protocols, clean remote tracking branches. | **100% Completed** |
| **3** | Branching, Merging & Rebasing | Isolated features, conflict handling | GitFlow branch structure (`develop`, `feature/*`, `main`), documented conflict resolution guide. | **100% Completed** |
| **4** | GitHub Collaboration | PRs, Issues, code reviews | Added issue templates (`bug_report.md`, `feature_request.md`) and standardized PR template. | **100% Completed** |
| **5** | Team Collaboration Strategy | Work distribution, branch policies | Documented team role matrix, branch protection rules, and merge approval gates. | **100% Completed** |
| **6** | GitHub Actions CI Workflows | CI definition, runner config | Authored `.github/workflows/backend-ci.yml` and `frontend-ci.yml` triggered on push/PR. | **100% Completed** |
| **7** | Automated Build & Test CI | Pytest, service container, build | Isolated PostgreSQL 16 service container in CI, test DB fixtures, passing pytest & Vite build. | **100% Completed** |
| **8** | Docker Images & Containers | Docker CLI lifecycle management | Docker container lifecycle documentation, container state management, logging, inspection. | **100% Completed** |
| **9** | Multi-Stage Dockerfiles | Containerizing applications | Authored non-root `backend/Dockerfile` and multi-stage Nginx `frontend/Dockerfile`. | **100% Completed** |
| **10**| Docker Compose Multi-Container| Service orchestration, networking | Authored `docker-compose.yml` linking `db`, `backend`, and `frontend` on dedicated bridge network. | **100% Completed** |
| **11**| Containerized Python Execution | Python packaging & environment | FastAPI containerized with environment mapping, SQLAlchemy ORM, and Uvicorn runtime. | **100% Completed** |
| **12**| UX Research & Wireframes | Personas, user journeys, wireframes | Created 2 detailed personas, complete student journey maps, and wireframe layouts in `docs/`. | **100% Completed** |
| **13**| Design System & Figma | Tokens, component specs, Figma | Formulated dark theme design tokens, emerald verification accents, gold credibility gates. | **100% Completed** |
| **14**| Capstone Project Delivery | Comprehensive project delivery | Full-stack platform, complete documentation, 100% passing tests, intact PostgreSQL data. | **100% Completed** |

---

## 3. System Architecture & Technical Stack

### 3.1 Technology Matrix
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Three.js, React Three Fiber, GSAP, Framer Motion, Axios, React Router.
- **Backend API**: Python 3.10, FastAPI, Pydantic, SQLAlchemy 2.0, Uvicorn, Passlib (Argon2), PyJWT.
- **AI Multi-Agent Pipeline**: Google Gemini 2.5 Flash API, Claim Extraction Agent, Evidence Verification Agent, Risk Analysis Agent, Verification Orchestrator.
- **Relational Database**: PostgreSQL 16, Psycopg 3, Alembic.
- **DevOps & Infrastructure**: Docker, Docker Compose, Nginx, GitHub Actions CI/CD.

### 3.2 Multi-Agent Verification Architecture
```
[Course URL / Syllabus]
          │
          ▼
┌─────────────────────────────────┐
│ 1. Claim Extraction Agent       │ ── Identifies statements regarding placement,
│    (Gemini 2.5 Flash)           │    accreditation, and syllabus depth
└─────────┬───────────────────────┘
          ▼
┌─────────────────────────────────┐
│ 2. Evidence Verification Agent  │ ── Queries registry databases, university lists,
│    (Authoritative Web Retrieval)│    and regulatory frameworks
└─────────┬───────────────────────┘
          ▼
┌─────────────────────────────────┐
│ 3. Risk Analysis Agent          │ ── Computes composite Trust Score (0-100) &
│    (Credibility Engine)         │    synthesizes multi-factor risk report
└─────────┬───────────────────────┘
          ▼
[Verification Report Stored in PostgreSQL & Visualized in React]
```

---

## 4. Verification and Testing Results

### 4.1 Backend Test Execution
All backend API and security unit tests execute successfully:
```text
tests/test_api_endpoints.py::test_health_check PASSED                    [ 20%]
tests/test_api_endpoints.py::test_root_endpoint PASSED                   [ 40%]
tests/test_api_endpoints.py::test_course_discover_public PASSED          [ 60%]
tests/test_security_assertions.py::test_password_hashing_and_verification PASSED [ 80%]
tests/test_security_assertions.py::test_distinct_hashes_for_same_password PASSED [100%]

========================= 5 passed, 1 warning in 0.24s =========================
```

### 4.2 Frontend Production Build Execution
Frontend TypeScript validation and Vite bundling execute cleanly with zero compilation errors:
```text
> vericourse-ai-frontend@1.0.0 build
> tsc && vite build

vite v5.4.21 building for production...
✓ 183 modules transformed.
dist/index.html                   0.98 kB │ gzip:  0.49 kB
dist/assets/index-Dk_2rWb_.css   34.12 kB │ gzip:  6.82 kB
dist/assets/index-C8o_K9sR.js   612.44 kB │ gzip: 184.22 kB
✓ built in 2.38s
```

### 4.3 Database Integrity
All existing PostgreSQL data in `vericourse_db` (2 courses, 8 claims, 5 reports, 2 evidence records, 6 users) remains completely intact and unaffected.

---

## 5. Conclusion & Academic Reflection

Through the execution of this project, the principles of Collaborative Development and DevOps were successfully bridged with cutting-edge full-stack AI engineering. The implementation demonstrates robust source control management, automated continuous integration, resilient multi-container architecture, human-centered UX design, and rigorous zero-regression preservation of production assets.
