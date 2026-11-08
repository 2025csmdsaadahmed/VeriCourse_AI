from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.session import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)
    provider = Column(String(150), nullable=False)
    course_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    fee = Column(Float, nullable=True)

    submitted_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="courses")
    claims = relationship("Claim", back_populates="course")
    reports = relationship("Report", back_populates="course")