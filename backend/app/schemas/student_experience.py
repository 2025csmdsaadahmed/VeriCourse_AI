from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional


class StudentExperienceCreate(BaseModel):
    course_id: int
    enrollment_status: str = Field(min_length=2, max_length=50)
    completion_status: bool = False
    amount_paid: Optional[float] = Field(default=None, ge=0)
    internship_promised: bool = False
    internship_received: bool = False
    placement_promised: bool = False
    placement_received: bool = False
    certificate_received: bool = False
    rating: int = Field(ge=1, le=5)
    review_title: Optional[str] = Field(default=None, max_length=200)
    review_text: str = Field(min_length=10)


class StudentExperienceResponse(BaseModel):
    id: int
    course_id: int
    user_id: int
    enrollment_status: str
    completion_status: bool
    amount_paid: Optional[float] = None
    internship_promised: bool
    internship_received: bool
    placement_promised: bool
    placement_received: bool
    certificate_received: bool
    rating: int
    review_title: Optional[str] = None
    review_text: str
    moderation_status: str
    is_verified_student: bool
    created_at: datetime
    student_name: Optional[str] = None
    course_title: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ExperienceAggregation(BaseModel):
    total_reviews: int
    average_rating: float
    internships_promised: int
    internships_received: int
    placements_promised: int
    placements_received: int
    certificates_received: int
    positive_count: int
    mixed_count: int
    negative_count: int
