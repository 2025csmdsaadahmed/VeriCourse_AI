from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


# Data used to generate a credibility report
class ReportCreate(BaseModel):
    course_id: int
    overall_status: str = "pending"
    risk_level: str = "undetermined"
    summary: Optional[str] = None
    recommendations: Optional[str] = None


# Report returned to the frontend
class ReportResponse(BaseModel):
    id: int
    course_id: int
    overall_status: str
    risk_level: str
    summary: Optional[str] = None
    recommendations: Optional[str] = None
    generated_at: datetime

    model_config = {"from_attributes": True}