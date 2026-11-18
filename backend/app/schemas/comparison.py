from pydantic import BaseModel
from typing import Optional
from app.schemas.course import CourseResponse
from app.schemas.student_experience import ExperienceAggregation


class CourseComparisonItem(BaseModel):
    course: CourseResponse
    credibility_score: Optional[float] = None
    evidence_coverage: Optional[float] = None
    risk_level: Optional[str] = "undetermined"
    total_claims: int = 0
    verified_claims: int = 0
    conflicting_claims: int = 0
    unverified_claims: int = 0
    student_metrics: Optional[ExperienceAggregation] = None


class CourseComparisonResponse(BaseModel):
    courses: list[CourseComparisonItem]
