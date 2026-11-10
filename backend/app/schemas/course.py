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


# Schema for returning course details
class CourseResponse(BaseModel):
    id: int
    title: str
    provider: str
    course_url: Optional[str] = None
    description: Optional[str] = None
    fee: Optional[float] = None
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