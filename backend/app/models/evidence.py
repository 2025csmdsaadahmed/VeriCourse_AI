from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.session import Base


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)

    claim_id = Column(
        Integer,
        ForeignKey("claims.id"),
        nullable=False
    )

    source_name = Column(String(200), nullable=False)

    source_url = Column(String(500), nullable=True)

    evidence_description = Column(Text, nullable=True)

    evidence_status = Column(
    String(50),
    default="not_checked",
    nullable=False
)

    checked_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    claim = relationship("Claim", back_populates="evidence_items")