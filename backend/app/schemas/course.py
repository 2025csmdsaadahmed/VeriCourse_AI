from pydantic import BaseModel, Field, HttpUrl, ConfigDict
from datetime import datetime
from typing import Optional


# Schema for creating a course
class CourseCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    provider: str = Field(min_length=2, max_length=150)
    course_url: Optional[HttpUrl] = None
    description: Optional[str] = None
    fee: Optional[float] = Field(default=None, ge=0)
    category: Optional[str] = Field(default="General", max_length=100)
    duration: Optional[str] = Field(default=None, max_length=50)


# Schema for returning course details
class CourseResponse(BaseModel):
    id: int
    title: str
    provider: str
    course_url: Optional[str] = None
    description: Optional[str] = None
    fee: Optional[float] = None
    category: Optional[str] = None
    duration: Optional[str] = None
    submitted_by: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Schema for updating a course
class CourseUpdate(BaseModel):
    title: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=200
    )

    provider: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=150
    )

    course_url: Optional[HttpUrl] = None
    description: Optional[str] = None
    fee: Optional[float] = Field(default=None, ge=0)
    category: Optional[str] = Field(default=None, max_length=100)
    duration: Optional[str] = Field(default=None, max_length=50)


# Schema for public course discovery with latest report metrics
class CourseDiscoveryItem(BaseModel):
    id: int
    title: str
    provider: str
    course_url: Optional[str] = None
    description: Optional[str] = None
    fee: Optional[float] = None
    category: Optional[str] = None
    duration: Optional[str] = None
    created_at: datetime
    credibility_score: Optional[float] = None
    evidence_coverage: Optional[float] = None
    risk_level: Optional[str] = None
    total_claims: int = 0
    verified_claims: int = 0
    student_rating: Optional[float] = None
    total_reviews: int = 0

    model_config = ConfigDict(from_attributes=True)
