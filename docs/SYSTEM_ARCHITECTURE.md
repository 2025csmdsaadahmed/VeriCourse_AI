# VeriCourse AI — System Architecture
**Architecture Style:** Decoupled Microservices / Multi-Agent AI Pipeline

---

## 1. High-Level Architectural Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                              │
│                                                                        │
│   React 18 + Vite SPA | Tailwind CSS | Framer Motion | GSAP            │
│   Three.js & React Three Fiber (3D Campus Credibility Gateway)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST / JSON
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION API LAYER                           │
│                                                                        │
│   FastAPI (Python 3.10) | Pydantic Schema Validation | CORS Middleware │
│   JWT Bearer Authentication & Argon2 Password Hashing                  │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │               MULTI-AGENT VERIFICATION ENGINE                  │   │
│   │                                                                │   │
│   │  ┌─────────────────────────┐     ┌──────────────────────────┐  │   │
│   │  │ Claim Extraction Agent  │────►│ Evidence Retrieval Agent │  │   │
│   │  │ (Gemini 2.5 Flash)      │     │ (Search & Cross-Exam)    │  │   │
│   │  └─────────────────────────┘     └────────────┬─────────────┘  │   │
│   │                                               ▼                │   │
│   │                                  ┌──────────────────────────┐  │   │
│   │                                  │ Risk Analysis Agent      │  │   │
│   │                                  │ (Scoring & Trust Engine) │  │   │
│   │                                  └────────────┬─────────────┘  │   │
│   │                                               ▼                │   │
│   │                                  ┌──────────────────────────┐  │   │
│   │                                  │ Verification Orchestrator│  │   │
│   │                                  └──────────────────────────┘  │   │
│   └────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ SQLAlchemy 2.0 (psycopg)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        PERSISTENCE LAYER                               │
│                                                                        │
│   PostgreSQL 16 Relational Database                                    │
│   Alembic Database Migration Engine                                    │
│   Tables: users, courses, claims, evidence, reports, experiences       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Agent AI Verification Pipeline

The platform uses three specialized AI agents coordinated by the `VerificationOrchestrator`:

1. **Claim Extraction Agent (`claim_extraction_agent.py`)**:
   - Parses unstructured course marketing copy, landing pages, and syllabi.
   - Categorizes claims into discrete types: *Accreditation, Placement Guarantee, Curriculum Scope, Faculty Credentials, and Refund Terms*.
   - Outputs structured Pydantic claim objects.

2. **Evidence Verification Agent (`evidence_verification_agent.py`)**:
   - Queries verified educational registries, regulatory databases, and authoritative repositories.
   - Evaluates whether factual corroboration exists for each extracted claim.
   - Computes an evidence reliability score.

3. **Risk Analysis Agent (`risk_analysis_agent.py`)**:
   - Weighs verified evidence against known high-risk predatory marketing patterns.
   - Calculates dimension scores: Curriculum Depth (0–100), Placement Risk, Faculty Credibility (0–100).
   - Generates the final composite **Trust Score (0–100)** and executive report summary.
