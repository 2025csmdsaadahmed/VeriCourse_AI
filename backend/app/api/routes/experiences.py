from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db
from app.models.student_experience import StudentExperience
from app.models.course import Course
from app.models.user import User
from app.core.dependencies import get_current_user
from app.schemas.student_experience import (
    StudentExperienceCreate,
    StudentExperienceResponse,
    ExperienceAggregation
)

router = APIRouter(
    prefix="/experiences",
    tags=["Student Experiences"]
)


@router.post("/", response_model=StudentExperienceResponse, status_code=status.HTTP_201_CREATED)
def submit_experience(
    experience_data: StudentExperienceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    course = db.query(Course).filter(Course.id == experience_data.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    new_experience = StudentExperience(
        course_id=experience_data.course_id,
        user_id=current_user.id,
        enrollment_status=experience_data.enrollment_status,
        completion_status=experience_data.completion_status,
        amount_paid=experience_data.amount_paid,
        internship_promised=experience_data.internship_promised,
        internship_received=experience_data.internship_received,
        placement_promised=experience_data.placement_promised,
        placement_received=experience_data.placement_received,
        certificate_received=experience_data.certificate_received,
        rating=experience_data.rating,
        review_title=experience_data.review_title,
        review_text=experience_data.review_text,
        moderation_status="approved",  # default to approved unless flagged
        is_verified_student=True
    )

    try:
        db.add(new_experience)
        db.commit()
        db.refresh(new_experience)

        # Build response with student name (anonymized for privacy)
        initials = current_user.full_name[:2].upper() if current_user.full_name else "ST"
        return StudentExperienceResponse(
            id=new_experience.id,
            course_id=new_experience.course_id,
            user_id=new_experience.user_id,
            enrollment_status=new_experience.enrollment_status,
            completion_status=new_experience.completion_status,
            amount_paid=new_experience.amount_paid,
            internship_promised=new_experience.internship_promised,
            internship_received=new_experience.internship_received,
            placement_promised=new_experience.placement_promised,
            placement_received=new_experience.placement_received,
            certificate_received=new_experience.certificate_received,
            rating=new_experience.rating,
            review_title=new_experience.review_title,
            review_text=new_experience.review_text,
            moderation_status=new_experience.moderation_status,
            is_verified_student=new_experience.is_verified_student,
            created_at=new_experience.created_at,
            student_name=f"Student {initials}***",
            course_title=course.title
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit student experience: {e}")


@router.get("/course/{course_id}", response_model=list[StudentExperienceResponse])
def get_course_experiences(course_id: int, db: Session = Depends(get_db)):
    experiences = db.query(StudentExperience).filter(
        StudentExperience.course_id == course_id,
        StudentExperience.moderation_status == "approved"
    ).order_by(StudentExperience.created_at.desc()).all()

    results = []
    for exp in experiences:
        user = db.query(User).filter(User.id == exp.user_id).first()
        initials = user.full_name[:2].upper() if user and user.full_name else "ST"
        results.append(
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
                student_name=f"Student {initials}***",
                course_title=exp.course.title if exp.course else None
            )
        )
    return results


@router.get("/course/{course_id}/summary", response_model=ExperienceAggregation)
def get_course_experience_summary(course_id: int, db: Session = Depends(get_db)):
    experiences = db.query(StudentExperience).filter(
        StudentExperience.course_id == course_id,
        StudentExperience.moderation_status == "approved"
    ).all()

    total = len(experiences)
    if total == 0:
        return ExperienceAggregation(
            total_reviews=0,
            average_rating=0.0,
            internships_promised=0,
            internships_received=0,
            placements_promised=0,
            placements_received=0,
            certificates_received=0,
            positive_count=0,
            mixed_count=0,
            negative_count=0
        )

    avg_rating = sum(e.rating for e in experiences) / total
    intern_prom = sum(1 for e in experiences if e.internship_promised)
    intern_rec = sum(1 for e in experiences if e.internship_received)
    place_prom = sum(1 for e in experiences if e.placement_promised)
    place_rec = sum(1 for e in experiences if e.placement_received)
    cert_rec = sum(1 for e in experiences if e.certificate_received)

    positive = sum(1 for e in experiences if e.rating >= 4)
    mixed = sum(1 for e in experiences if e.rating == 3)
    negative = sum(1 for e in experiences if e.rating <= 2)

    return ExperienceAggregation(
        total_reviews=total,
        average_rating=round(avg_rating, 1),
        internships_promised=intern_prom,
        internships_received=intern_rec,
        placements_promised=place_prom,
        placements_received=place_rec,
        certificates_received=cert_rec,
        positive_count=positive,
        mixed_count=mixed,
        negative_count=negative
    )
