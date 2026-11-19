from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.session import Base


class SavedCourse(Base):
    __tablename__ = "saved_courses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    saved_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="saved_courses")
    course = relationship("Course", back_populates="saved_by_users")

    __table_args__ = (
        UniqueConstraint("user_id", "course_id", name="uq_user_saved_course"),
    )
