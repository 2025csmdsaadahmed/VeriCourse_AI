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

    # AI assessment fields
    source_credibility = Column(
        String(30),
        default="unknown",
        nullable=False
    )

    evidence_relevance = Column(
        String(30),
        default="low",
        nullable=False
    )

    verification_explanation = Column(
        Text,
        nullable=True
    )

    verification_limitations = Column(
        Text,
        nullable=True
    )

    # Retrieval provenance
    page_title = Column(
        String(500),
        nullable=True
    )

    content_hash = Column(
        String(64),
        nullable=True
    )

    fetched_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    checked_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    claim = relationship(
        "Claim",
        back_populates="evidence_items"
    )