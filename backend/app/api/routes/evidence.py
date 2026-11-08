from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.claim import Claim
from app.models.course import Course
from app.models.evidence import Evidence
from app.models.user import User
from app.schemas.evidence import EvidenceCreate, EvidenceResponse
from app.core.dependencies import get_current_user

router = APIRouter()


# Add evidence to a claim
@router.post(
    "/claims/{claim_id}/evidence/",
    response_model=EvidenceResponse,
    status_code=status.HTTP_201_CREATED
)
def create_evidence(
    claim_id: int,
    evidence_data: EvidenceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Find the claim and verify course ownership
    claim = db.query(Claim).join(Course).filter(
        Claim.id == claim_id,
        Course.submitted_by == current_user.id
    ).first()

    if not claim:
        raise HTTPException(
            status_code=404,
            detail="Claim not found"
        )

    # Create evidence
    new_evidence = Evidence(
        claim_id=claim_id,
        source_name=evidence_data.source_name,
        source_url=evidence_data.source_url,
        evidence_description=evidence_data.evidence_description,
        evidence_status=evidence_data.evidence_status
    )

    try:
        db.add(new_evidence)
        db.commit()
        db.refresh(new_evidence)

        return new_evidence

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to create evidence"
        )


# Get all evidence belonging to a claim
@router.get(
    "/claims/{claim_id}/evidence/",
    response_model=list[EvidenceResponse]
)
def get_claim_evidence(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Verify claim ownership through its course
    claim = db.query(Claim).join(Course).filter(
        Claim.id == claim_id,
        Course.submitted_by == current_user.id
    ).first()

    if not claim:
        raise HTTPException(
            status_code=404,
            detail="Claim not found"
        )

    evidence_items = db.query(Evidence).filter(
        Evidence.claim_id == claim_id
    ).all()

    return evidence_items