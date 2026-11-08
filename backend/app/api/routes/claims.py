from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.course import Course
from app.models.claim import Claim
from app.models.user import User
from app.schemas.claim import ClaimCreate, ClaimResponse
from app.core.dependencies import get_current_user

router = APIRouter()


# Create a new claim for a course
@router.post(
    "/courses/{course_id}/claims/",
    response_model=ClaimResponse,
    status_code=status.HTTP_201_CREATED
)
def create_claim(
    course_id: int,
    claim_data: ClaimCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Check whether the course exists and belongs to the user
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.submitted_by == current_user.id
    ).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    # Create the claim
    new_claim = Claim(
        course_id=course_id,
        claim_text=claim_data.claim_text,
        claim_category=claim_data.claim_category
    )

    try:
        db.add(new_claim)
        db.commit()
        db.refresh(new_claim)

        return new_claim

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to create claim"
        )


# Get all claims belonging to a course
@router.get(
    "/courses/{course_id}/claims/",
    response_model=list[ClaimResponse]
)
def get_course_claims(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Verify course ownership
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.submitted_by == current_user.id
    ).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    claims = db.query(Claim).filter(
        Claim.course_id == course_id
    ).all()

    return claims