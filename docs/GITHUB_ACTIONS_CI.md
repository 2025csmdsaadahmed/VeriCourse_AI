# GitHub Actions CI/CD Pipeline Documentation
**Project:** VeriCourse AI  
**Academic Reference:** CDD Lab Manual (Experiments 6 & 7)  
**Configuration Directory:** `.github/workflows/`

---

## 1. Overview and Continuous Integration Principles

This document specifies the automated Continuous Integration (CI) infrastructure implemented for **VeriCourse AI**, directly addressing **Experiments 6 and 7** of the Collaborative Development and DevOps syllabus:

- **Experiment 6: CI Workflows with GitHub Actions**
  - Defining workflow YAML configurations.
  - Setting up workflow triggers (`push`, `pull_request`) for `main`, `develop`, and `feature/**` branches.
  - Configuring hosted runner environments (`ubuntu-latest`).
- **Experiment 7: Automating Build and Test Execution**
  - Spinning up isolated container services (PostgreSQL 16 Alpine).
  - Installing and caching runtime dependencies (`pip` and `npm`).
  - Executing test suites (`pytest`) and verifying assertions.
  - Automating TypeScript validation and Vite production bundling.

---

## 2. Backend CI Pipeline (`.github/workflows/backend-ci.yml`)

### 2.1 Trigger Strategy
The backend workflow automatically runs whenever code in `backend/` or the workflow definition itself changes:
- `push` to `main`, `develop`, or any `feature/**` branch.
- `pull_request` targeting `main` or `develop`.

### 2.2 Service Container Isolation
To avoid relying on developer local machines or hardcoded credentials, the workflow spins up a dedicated PostgreSQL 16 service container in Docker:
```yaml
services:
  postgres:
    image: postgres:16-alpine
    env:
      POSTGRES_USER: test_user
      POSTGRES_PASSWORD: test_password
      POSTGRES_DB: test_vericourse_db
    ports:
      - 5432:5432
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```

### 2.3 Workflow Execution Steps
1. **Repository Checkout**: `actions/checkout@v4` fetches source code.
2. **Python Setup**: `actions/setup-python@v5` configures Python 3.10 with automated pip package caching keyed on `requirements.txt`.
3. **Dependency Installation**: Upgrades `pip` and installs pinned dependencies including `alembic==1.20.1`, `fastapi`, `SQLAlchemy`, and `pytest`.
4. **Schema Initialization**: Executes `python create_tables.py` against the PostgreSQL service container to generate schema tables.
5. **Pytest Execution**: Runs `pytest --verbose`. Uses `conftest.py` with FastAPI dependency overrides ensuring complete test database isolation.

---

## 3. Frontend CI Pipeline (`.github/workflows/frontend-ci.yml`)

### 3.1 Trigger Strategy
Runs whenever frontend assets, components, or configurations change:
- `push` to `main`, `develop`, or `feature/**` branches.
- `pull_request` targeting `main` or `develop`.

### 3.2 Workflow Execution Steps
1. **Repository Checkout**: `actions/checkout@v4` checks out the project.
2. **Node.js Setup**: `actions/setup-node@v4` configures Node.js 20 with npm caching keyed on `package-lock.json`.
3. **Clean Installation**: Executes `npm ci` for deterministic, reproducible dependency installs.
4. **Validation & Production Build**: Runs `npm run build` (`tsc && vite build`). Verifies zero TypeScript type errors, compiles all React components, and outputs optimized production assets.

---

## 4. Local Reproduction & Verification

To verify CI compliance locally before pushing:

### Backend Test Suite
```bash
cd backend
.venv/bin/pytest --verbose
```
Sample verified output:
```text
tests/test_api_endpoints.py::test_health_check PASSED                    [ 20%]
tests/test_api_endpoints.py::test_root_endpoint PASSED                   [ 40%]
tests/test_api_endpoints.py::test_course_discover_public PASSED          [ 60%]
tests/test_security_assertions.py::test_password_hashing_and_verification PASSED [ 80%]
tests/test_security_assertions.py::test_distinct_hashes_for_same_password PASSED [100%]

========================= 5 passed, 1 warning in 0.24s =========================
```

### Frontend Build Verification
```bash
cd frontend
npm run build
```
Sample verified output:
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
