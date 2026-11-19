from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.models.course import Course
from app.models.report import Report
from app.models.student_experience import StudentExperience
from app.core.dependencies import get_current_user
from app.schemas.user import UserResponse
from app.schemas.student_experience import StudentExperienceResponse

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Administrator privileges required."
        )
    return current_user


@router.get("/overview")
def get_admin_overview(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    total_users = db.query(User).count()
    total_courses = db.query(Course).count()
    total_reports = db.query(Report).count()
    total_experiences = db.query(StudentExperience).count()
    flagged_experiences = db.query(StudentExperience).filter(
        StudentExperience.moderation_status == "flagged"
    ).count()

    return {
        "total_users": total_users,
        "total_courses": total_courses,
        "total_reports": total_reports,
        "total_experiences": total_experiences,
        "flagged_experiences": flagged_experiences
    }


@router.get("/users", response_model=list[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.get("/experiences/pending", response_model=list[StudentExperienceResponse])
def get_pending_or_flagged_experiences(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    experiences = db.query(StudentExperience).order_by(
        StudentExperience.created_at.desc()
    ).all()

    return [
        StudentExperienceResponse(
            id=exp.id,
            course_id=exp.course_id,
            user_id=exp.user_id,
            enrollment_status=exp.enrollment_status,
            completion_status=exp.completion_status,
            amount_paid=exp.amount_paid,
            internship_promised=exp.internship_promised,
            internship_received=exp.internship_received,
            placement_promised=exp.placement_promised,
            placement_received=exp.placement_received,
            certificate_received=exp.certificate_received,
            rating=exp.rating,
            review_title=exp.review_title,
            review_text=exp.review_text,
            moderation_status=exp.moderation_status,
            is_verified_student=exp.is_verified_student,
            created_at=exp.created_at,
            student_name=exp.user.full_name if exp.user else "Anonymous",
            course_title=exp.course.title if exp.course else "Unknown Course"
        )
        for exp in experiences
    ]


@router.put("/experiences/{experience_id}/moderate")
def moderate_experience(
    experience_id: int,
    action: str,  # "approve", "reject", "flag"
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    exp = db.query(StudentExperience).filter(StudentExperience.id == experience_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Student experience not found")

    if action == "approve":
        exp.moderation_status = "approved"
    elif action == "reject":
        exp.moderation_status = "rejected"
    elif action == "flag":
        exp.moderation_status = "flagged"
    else:
        raise HTTPException(status_code=400, detail="Invalid moderation action")

    db.commit()
    return {"message": f"Experience status updated to {exp.moderation_status}"}
