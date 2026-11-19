# VeriCourse AI

> **Continuous Trust Intelligence & Credibility Gateway for Online Education**  
> Verifying course claims, accreditation authenticity, and placement promises with a Multi-Agent AI Verification Pipeline.

---

## 🌟 Overview

**VeriCourse AI** is an advanced full-stack educational verification platform designed to protect students and career switchers from misleading online course marketing. Leveraging a specialized tri-agent pipeline powered by Google Gemini, the platform extracts course marketing claims, queries empirical evidence registries, evaluates curriculum depth and faculty legitimacy, and renders interactive credibility reports and 3D campus visualizations.

---

## 🚀 Key Features

- **3D Credibility Gateway**: Interactive Three.js/React Three Fiber 3D campus visualizer and verification portal.
- **Tri-Agent Verification Engine**:
  1. *Claim Extraction Agent*: Categorizes claims into Accreditation, Placement, Curriculum, and Faculty.
  2. *Evidence Verification Agent*: Cross-references claims against educational registries and authoritative datasets.
  3. *Risk Analysis Agent*: Weighs findings to compute multi-factor scores and overall Trust Rating (0–100).
- **Course Discovery & Search**: Filter and search audited courses with transparent verification statuses.
- **Side-by-Side Comparison**: Directly contrast two courses on fees, accreditation, syllabus depth, and placement reality.
- **Crowdsourced Student Experiences**: Verified reviews and authentic placement outcomes from real learners.
- **Enterprise DevOps Pipeline**: Multi-container Docker deployment and automated GitHub Actions CI/CD workflows.

---

## 🛠️ Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Three.js, React Three Fiber, Framer Motion, GSAP, Axios |
| **Backend API** | Python 3.10, FastAPI, Pydantic, SQLAlchemy 2.0, Uvicorn, Passlib (Argon2), PyJWT |
| **AI Multi-Agent**| Google Gemini 2.5 Flash API, Structured Verification Orchestrator |
| **Database** | PostgreSQL 16, Psycopg 3, Alembic |
| **DevOps & CI/CD**| Docker, Docker Compose, Nginx, GitHub Actions |

---

## 📂 Project Structure

```text
VeriCourse_AI/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── pull_request_template.md
│   └── workflows/
│       ├── backend-ci.yml
│       └── frontend-ci.yml
├── backend/
│   ├── app/
│   │   ├── agents/          # Claim, Evidence, Risk agents & Orchestrator
│   │   ├── api/routes/      # Auth, Courses, Reports, Experiences, Health
│   │   ├── core/            # Config, Security, Hashing
│   │   ├── database/        # Session, Base models
│   │   ├── models/          # SQLAlchemy ORM entities
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   └── services/        # Gemini, Evidence retrieval, Scoring
│   ├── migrations/          # Alembic migrations
│   ├── tests/               # Pytest suite with isolated test DB fixture
│   ├── Dockerfile           # Multi-stage production Python container
│   ├── requirements.txt
│   └── create_tables.py
├── frontend/
│   ├── src/
│   │   ├── components/      # 3D Canvas, Credibility Gateway, UI components
│   │   ├── contexts/        # AuthContext
│   │   ├── pages/           # Landing, Discovery, Report, Compare, Experiences
│   │   └── services/        # Axios API client
│   ├── nginx.conf           # SPA routing & API reverse proxy
│   ├── Dockerfile           # Multi-stage Node build & Nginx container
│   ├── package.json
│   └── vite.config.ts
├── docs/                    # CDD Academic Lab Documentation (Exp 1–14)
│   ├── CDD_EXPERIMENT_COMPLETION_MATRIX.md
│   ├── CDD_FINAL_PROJECT_REPORT.md
│   ├── GIT_WORKFLOW_AND_COLLABORATION.md
│   ├── GITHUB_ACTIONS_CI.md
│   ├── DOCKER_AND_CONTAINERIZATION.md
│   ├── UX_RESEARCH_AND_PERSONAS.md
│   ├── FIGMA_PROTOTYPE_AND_DESIGN_SYSTEM.md
│   ├── API_SPECIFICATIONS.md
│   ├── DATABASE_SCHEMA.md
│   ├── SETUP_GUIDE.md
│   └── SYSTEM_ARCHITECTURE.md
├── docker-compose.yml       # Full stack: db + backend + frontend
├── .dockerignore
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
python create_tables.py
pytest
uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run build
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🐳 Quick Start (Docker Compose)

Launch the complete multi-container stack (PostgreSQL + FastAPI + Nginx Frontend):
```bash
docker-compose up -d --build
```
- Frontend UI: `http://localhost:3000`
- Backend API: `http://localhost:8000/docs`
- Health Check: `curl http://localhost:8000/api/health`

---

## 📚 CDD Academic Curriculum Documentation

Complete documentation for Experiments 1 through 14 is available in the [`docs/`](./docs/) directory:
- [CDD Experiment Completion Matrix](./docs/CDD_EXPERIMENT_COMPLETION_MATRIX.md)
- [Git Workflow and Collaboration Guide (Exp 1–5)](./docs/GIT_WORKFLOW_AND_COLLABORATION.md)
- [GitHub Actions CI/CD Documentation (Exp 6–7)](./docs/GITHUB_ACTIONS_CI.md)
- [Docker and Multi-Container Guide (Exp 8–11)](./docs/DOCKER_AND_CONTAINERIZATION.md)
- [UX Research, Personas & Wireframes (Exp 12)](./docs/UX_RESEARCH_AND_PERSONAS.md)
- [Design System & Figma Specifications (Exp 13)](./docs/FIGMA_PROTOTYPE_AND_DESIGN_SYSTEM.md)
- [Final Capstone Project Report (Exp 14)](./docs/CDD_FINAL_PROJECT_REPORT.md)
