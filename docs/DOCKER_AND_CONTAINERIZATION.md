# Docker and Containerization Guide
**Project:** VeriCourse AI  
**Academic Reference:** CDD Lab Manual (Experiments 8, 9, 10 & 11)  
**Configuration Files:** `Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml`, `frontend/nginx.conf`

---

## 1. Overview and Objectives

This guide documents the container architecture and execution strategy for **VeriCourse AI**, directly implementing the specifications of **Experiments 8 through 11**:

- **Experiment 8: Creating Docker Images and Running Containers**
  - Working with the Docker daemon, inspecting images, tracking running containers, monitoring resource usage.
- **Experiment 9: Writing Dockerfiles for Application Packaging**
  - Multi-stage builds, non-root security profiles, layer caching optimization, and minimal attack surface.
- **Experiment 10: Multi-Container Orchestration with Docker Compose**
  - Service definitions (`db`, `backend`, `frontend`), isolated bridge networking (`vericourse_network`), persistent volume storage (`pgdata`), and inter-service health dependencies.
- **Experiment 11: Containerizing and Executing Python Application**
  - Packaging FastAPI with SQLAlchemy, managing PostgreSQL driver dependencies (`psycopg`), exposing REST API on port `8000`, and configuring environment injection.

---

## 2. Docker Architecture Diagram

```
                 HOST MACHINE (Browser / Developer)
             ┌───────────────────────┬──────────────────────┐
             │ Port 3000             │ Port 8000            │ Port 5432
             ▼                       ▼                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│ DOCKER BRIDGE NETWORK: vericourse_network                              │
│                                                                        │
│   ┌───────────────────────────┐      ┌───────────────────────────┐     │
│   │  Frontend (Nginx 1.25)    │      │  Backend (FastAPI)        │     │
│   │  Container: vericourse_   │ /api/│  Container: vericourse_   │     │
│   │             frontend      ├─────►│             backend       │     │
│   │  Port: 80                 │      │  Port: 8000               │     │
│   └───────────────────────────┘      └─────────────┬─────────────┘     │
│                                                    │                   │
│                                                    │ SQLAlchemy /      │
│                                                    │ psycopg           │
│                                                    ▼                   │
│                                      ┌───────────────────────────┐     │
│                                      │  Database (Postgres 16)   │     │
│                                      │  Container: vericourse_db │     │
│                                      │  Port: 5432               │     │
│                                      └─────────────┬─────────────┘     │
└────────────────────────────────────────────────────┼───────────────────┘
                                                     ▼
                                          ┌───────────────────────┐
                                          │ Named Volume: pgdata  │
                                          └───────────────────────┘
```

---

## 3. Container Lifecycle and CLI Operations (Experiment 8)

The core Docker commands utilized to manage container lifecycles in this project include:

```bash
# Check Docker daemon status and version
docker version
docker info

# Build image from local Dockerfile
docker build -t vericourse-backend:v1 ./backend

# List available images
docker images

# Run container in detached mode with port mapping
docker run -d --name vericourse_api -p 8000:8000 vericourse-backend:v1

# Inspect active running containers
docker ps

# Inspect logs from running container
docker logs -f vericourse_api

# Inspect container internal details and network settings
docker inspect vericourse_api

# Stop and remove container
docker stop vericourse_api
docker rm vericourse_api
```

---

## 4. Dockerfile Specifications (Experiment 9 & 11)

### 4.1 Backend Dockerfile (`backend/Dockerfile`)
The backend leverages a two-stage build to isolate compilation tools from the lightweight runtime image:
1. **Builder Stage (`python:3.10-slim`)**: Installs `build-essential` and `libpq-dev`, builds all pip wheels into `/root/.local`.
2. **Runtime Stage (`python:3.10-slim`)**:
   - Creates a dedicated non-root user (`appuser`, UID `1001`) adhering to least-privilege security principles.
   - Copies pre-compiled libraries from builder stage.
   - Sets `PYTHONPATH=/app` and `PYTHONUNBUFFERED=1`.
   - Embeds healthcheck pinging `http://localhost:8000/api/health`.
   - Launches application with `uvicorn app.main:app --host 0.0.0.0 --port 8000`.

### 4.2 Frontend Dockerfile (`frontend/Dockerfile`)
1. **Build Stage (`node:20-alpine`)**:
   - Executes deterministic `npm ci`.
   - Runs `npm run build` producing tree-shaken static assets in `/app/dist`.
2. **Web Server Stage (`nginx:1.25-alpine`)**:
   - Copies production static files to `/usr/share/nginx/html`.
   - Injects `nginx.conf` with Single Page Application (SPA) client-side routing fallback (`try_files $uri $uri/ /index.html`).
   - Reverse proxies all `/api/` HTTP traffic directly to the backend service container at `http://backend:8000/api/`.

---

## 5. Multi-Container Orchestration with Docker Compose (Experiment 10)

### 5.1 Service Composition
The `docker-compose.yml` coordinates three integrated services:
- **`db`**: `postgres:16-alpine` service with persistent storage on volume `pgdata` and automated healthcheck (`pg_isready`).
- **`backend`**: FastAPI application service that waits for `db` to achieve `healthy` status before starting.
- **`frontend`**: Nginx web server and reverse proxy exposing port `3000` on the host machine.

### 5.2 Starting the Multi-Container Stack
```bash
# Start all services in the background and build images if not present
docker-compose up -d --build

# Inspect status of all services
docker-compose ps

# View unified streaming logs
docker-compose logs -f

# Verify backend healthcheck
docker-compose exec backend curl -f http://localhost:8000/api/health

# Stop stack gracefully without deleting database records
docker-compose down

# Stop stack and remove volumes (clean reset)
docker-compose down -v
```

### 5.3 Port and URL Mapping Reference
| Service | Host URL | Container Port | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | `http://localhost:3000` | `80` | User Interface, 3D Canvas, Reports |
| **Backend REST API** | `http://localhost:8000` | `8000` | FastAPI endpoints, OpenAPI Swagger (`/docs`) |
| **PostgreSQL Database** | `localhost:5432` | `5432` | Relational persistence (`vericourse_db`) |
