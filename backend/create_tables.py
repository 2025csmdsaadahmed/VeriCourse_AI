from app.database.session import engine, Base

# Register all models
from app.models import User, Course, Claim, Evidence, Report

# Create database tables
Base.metadata.create_all(bind=engine)

print("VeriCourse AI database tables created successfully!")