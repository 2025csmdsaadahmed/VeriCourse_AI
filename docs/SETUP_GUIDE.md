# VeriCourse AI — Development & Setup Guide

---

## 1. Prerequisites

- **Python**: 3.10.x
- **Node.js**: 20.x or higher (npm 10+)
- **PostgreSQL**: 16.x
- **Docker & Docker Compose**: Optional (for containerized execution)
- **Git**: 2.x+

---

## 2. Local Environment Setup

### 2.1 Clone Repository
```bash
git clone https://github.com/organization/VeriCourse_AI.git
cd VeriCourse_AI
git checkout feature/backend-ai
```

### 2.2 Backend Configuration
1. Navigate to backend directory and activate virtual environment:
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure environment variables in `backend/.env`:
   ```ini
   DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/vericourse_db
   GEMINI_API_KEY=your_gemini_api_key_here
   JWT_SECRET=super_secret_jwt_key_min_32_chars
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   ENVIRONMENT=development
   ```
4. Initialize database schema:
   ```bash
   python create_tables.py
   ```
5. Run automated test suite:
   ```bash
   pytest
   ```
6. Start FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### 2.3 Frontend Configuration
1. Open a new terminal session and navigate to `frontend`:
   ```bash
   cd frontend
   npm install
   ```
2. Configure frontend environment variables in `frontend/.env`:
   ```ini
   VITE_API_URL=http://localhost:8000
   ```
3. Run production build test:
   ```bash
   npm run build
   ```
4. Start Vite development server:
   ```bash
   npm run dev
   ```
5. Access the application at `http://localhost:5173`.

---

## 3. Containerized Setup (Docker Compose)

For instant multi-container execution without configuring local PostgreSQL or Python environments:

```bash
# Build and run containers in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Web app accessible at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/docs
```
