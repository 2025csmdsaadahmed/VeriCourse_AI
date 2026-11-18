from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.saved_course import SavedCourse
from app.models.course import Course
from app.models.user import User
from app.core.dependencies import get_current_user
from app.schemas.saved_course import SavedCourseResponse
from app.schemas.course import CourseResponse

router = APIRouter(
    prefix="/saved-courses",
    tags=["Saved Courses"]
)


@router.post("/{course_id}", response_model=SavedCourseResponse, status_code=status.HTTP_201_CREATED)
def save_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    existing = db.query(SavedCourse).filter(
        SavedCourse.user_id == current_user.id,
        SavedCourse.course_id == course_id
    ).first()

    if existing:
        return SavedCourseResponse(
            id=existing.id,
            user_id=existing.user_id,
            course_id=existing.course_id,
            saved_at=existing.saved_at,
            course=CourseResponse.model_validate(existing.course)
        )

    saved = SavedCourse(user_id=current_user.id, course_id=course_id)
    try:
        db.add(saved)
        db.commit()
        db.refresh(saved)
        return SavedCourseResponse(
            id=saved.id,
            user_id=saved.user_id,
            course_id=saved.course_id,
            saved_at=saved.saved_at,
            course=CourseResponse.model_validate(course)
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save course")


@router.get("/", response_model=list[SavedCourseResponse])
def get_user_saved_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    saved_items = db.query(SavedCourse).filter(
        SavedCourse.user_id == current_user.id
    ).order_by(SavedCourse.saved_at.desc()).all()

    return [
        SavedCourseResponse(
            id=item.id,
            user_id=item.user_id,
            course_id=item.course_id,
            saved_at=item.saved_at,
            course=CourseResponse.model_validate(item.course)
        )
        for item in saved_items
    ]


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_saved_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    saved = db.query(SavedCourse).filter(
        SavedCourse.user_id == current_user.id,
        SavedCourse.course_id == course_id
    ).first()

    if not saved:
        raise HTTPException(status_code=404, detail="Saved course entry not found")

    db.delete(saved)
    db.commit()
    return None
