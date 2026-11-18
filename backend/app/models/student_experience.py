from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.session import Base


class StudentExperience(Base):
    __tablename__ = "student_experiences"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    enrollment_status = Column(String(50), nullable=False)  # enrolled, completed, dropped_out
    completion_status = Column(Boolean, default=False)
    amount_paid = Column(Float, nullable=True)

    internship_promised = Column(Boolean, default=False)
    internship_received = Column(Boolean, default=False)

    placement_promised = Column(Boolean, default=False)
    placement_received = Column(Boolean, default=False)

    certificate_received = Column(Boolean, default=False)

    rating = Column(Integer, nullable=False)  # 1 to 5
    review_title = Column(String(200), nullable=True)
    review_text = Column(Text, nullable=False)

    # Verification / moderation status: pending, approved, rejected, flagged
    moderation_status = Column(String(30), default="approved", nullable=False)
    is_verified_student = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="student_experiences")
    user = relationship("User", back_populates="experiences")
