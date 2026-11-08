from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.session import Base


class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)

    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)

    claim_text = Column(Text, nullable=False)

    claim_category = Column(
        String(50),
        nullable=False
    )

    verification_status = Column(
        String(50),
        default="not_checked",
        nullable=False
    )

    extracted_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    course = relationship("Course", back_populates="claims")

    evidence_items = relationship(
        "Evidence",
        back_populates="claim",
        cascade="all, delete-orphan"
    )