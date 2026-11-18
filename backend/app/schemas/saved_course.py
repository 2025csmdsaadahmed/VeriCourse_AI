from pydantic import BaseModel
from datetime import datetime
from app.schemas.course import CourseResponse


class SavedCourseResponse(BaseModel):
    id: int
    user_id: int
    course_id: int
    saved_at: datetime
    course: CourseResponse
