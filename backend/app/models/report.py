from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.session import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    course_id = Column(
        Integer,
        ForeignKey("courses.id"),
        nullable=False
    )

    overall_status = Column(
        String(50),
        default="pending",
        nullable=False
    )

    risk_level = Column(
        String(30),
        default="undetermined",
        nullable=False
    )

    summary = Column(Text, nullable=True)

    recommendations = Column(Text, nullable=True)

    generated_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    course = relationship("Course", back_populates="reports")