from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.api.routes.auth import router as auth_router
from app.api.routes.courses import router as courses_router
from app.api.routes.claims import router as claims_router
from app.api.routes.evidence import router as evidence_router
from app.api.routes.reports import router as reports_router

app = FastAPI(
    title="VeriCourse AI",
    description="Intelligent Educational Verification and Continuous Trust Intelligence Platform",
    version="1.0.0"
)

# Frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# API routes
app.include_router(health_router, prefix="/api", tags=["Health"])

app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["Authentication"]
)
app.include_router(
    courses_router,
    prefix="/api",
    tags=["Courses"]
)
app.include_router(
    claims_router,
    prefix="/api",
    tags=["Claims"]
)
app.include_router(
    evidence_router,
    prefix="/api",
    tags=["Evidence"]
)
app.include_router(
    reports_router,
    prefix="/api",
    tags=["Reports"]
)
@app.get("/")
def root():
    return {
        "project": "VeriCourse AI",
        "status": "running",
        "version": "1.0.0"
    }