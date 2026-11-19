from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional


# Data received when adding evidence
class EvidenceCreate(BaseModel):
    source_name: str = Field(min_length=2, max_length=200)
    source_url: Optional[str] = Field(default=None, max_length=500)
    evidence_description: Optional[str] = None
    evidence_status: str = "not_checked"


# Data returned to the frontend
class EvidenceResponse(BaseModel):
    id: int
    claim_id: int
    source_name: str
    source_url: Optional[str] = None
    evidence_description: Optional[str] = None
    evidence_status: str
    checked_at: datetime

    model_config = ConfigDict(from_attributes=True)