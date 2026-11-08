from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.course import Course
from app.models.user import User
from app.schemas.course import (
    CourseCreate,
    CourseUpdate,
    CourseResponse
)
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)


# 1. Submit a new course
@router.post(
    "/",
    response_model=CourseResponse,
    status_code=status.HTTP_201_CREATED
)
def create_course(
    course_data: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_course = Course(
        title=course_data.title,
        provider=course_data.provider,
        course_url=str(course_data.course_url) if course_data.course_url else None,
        description=course_data.description,
        fee=course_data.fee,
        submitted_by=current_user.id
    )

    try:
        db.add(new_course)
        db.commit()
        db.refresh(new_course)

        return new_course

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Course submission failed"
        )


# 2. List courses submitted by the logged-in user
@router.get(
    "/",
    response_model=list[CourseResponse]
)
def get_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    courses = db.query(Course).filter(
        Course.submitted_by == current_user.id
    ).order_by(Course.created_at.desc()).all()

    return courses


# 3. Get a specific course
@router.get(
    "/{course_id}",
    response_model=CourseResponse
)
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    course = db.query(Course).filter(
        Course.id == course_id,
        Course.submitted_by == current_user.id
    ).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    return course


# 4. Update a course
@router.put(
    "/{course_id}",
    response_model=CourseResponse
)
def update_course(
    course_id: int,
    course_data: CourseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    course = db.query(Course).filter(
        Course.id == course_id,
        Course.submitted_by == current_user.id
    ).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    update_data = course_data.model_dump(exclude_unset=True)

    for field in ("title", "provider"):
        if field in update_data and update_data[field] is None:
            raise HTTPException(
                status_code=422,
                detail=f"{field} cannot be null"
            )

    if "course_url" in update_data and update_data["course_url"] is not None:
        update_data["course_url"] = str(update_data["course_url"])

    for field, value in update_data.items():
        setattr(course, field, value)

    try:
        db.commit()
        db.refresh(course)

        return course

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Course update failed"
        )