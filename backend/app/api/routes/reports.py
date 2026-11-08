from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.course import Course
from app.models.report import Report
from app.models.user import User
from app.schemas.report import ReportResponse
from app.core.dependencies import get_current_user

router = APIRouter()


# Create a pending report for a course
@router.post(
    "/courses/{course_id}/reports/",
    response_model=ReportResponse,
    status_code=status.HTTP_201_CREATED
)
def create_report(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Verify that the course exists and belongs to the user
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.submitted_by == current_user.id
    ).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    # Create a pending report
    new_report = Report(
        course_id=course_id,
        overall_status="pending",
        risk_level="undetermined",
        summary="Verification has not started yet.",
        recommendations="Evidence verification is pending."
    )

    try:
        db.add(new_report)
        db.commit()
        db.refresh(new_report)

        return new_report

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to create report"
        )


# Get all reports belonging to a course
@router.get(
    "/courses/{course_id}/reports/",
    response_model=list[ReportResponse]
)
def get_course_reports(
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

    reports = db.query(Report).filter(
        Report.course_id == course_id
    ).all()

    return reports