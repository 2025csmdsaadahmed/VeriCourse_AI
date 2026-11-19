from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


# Data received when creating a claim
class ClaimCreate(BaseModel):
    claim_text: str = Field(min_length=5)
    claim_category: str = Field(min_length=2, max_length=50)


# Data returned to the frontend
class ClaimResponse(BaseModel):
    id: int
    course_id: int
    claim_text: str
    claim_category: str
    verification_status: str
    extracted_at: datetime

    model_config = ConfigDict(from_attributes=True)