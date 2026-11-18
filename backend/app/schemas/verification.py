from pydantic import BaseModel, Field
from typing import Optional


class EvidenceInput(BaseModel):
    source_name: str = Field(min_length=2, max_length=200)
    source_url: Optional[str] = Field(default=None, max_length=500)
    evidence_description: Optional[str] = None


class VerificationRequest(BaseModel):
    evidence_by_claim: dict[int, list[EvidenceInput]] = Field(
        default_factory=dict
    )