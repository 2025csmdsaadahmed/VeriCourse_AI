import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.course import Course
from app.models.user import User

from app.schemas.course import (
    CourseCreate,
    CourseUpdate,
    CourseResponse,
    CourseDiscoveryItem
)
from app.schemas.comparison import CourseComparisonResponse, CourseComparisonItem
from app.schemas.student_experience import ExperienceAggregation
from app.models.report import Report
from app.models.claim import Claim
from app.models.student_experience import StudentExperience

from app.schemas.verification import VerificationRequest

from app.core.dependencies import get_current_user
from app.services.verification_orchestrator import verification_orchestrator


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
        category=course_data.category or "General",
        duration=course_data.duration,
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


# 2b. Public Course Discovery & Search (Available for all students)
@router.get(
    "/discover",
    response_model=list[CourseDiscoveryItem]
)
def discover_courses(
    query: str | None = None,
    category: str | None = None,
    provider: str | None = None,
    sort_by: str | None = "newest",  # newest, credibility, rating
    db: Session = Depends(get_db)
):
    q = db.query(Course)

    if query and query.strip():
        search_filter = f"%{query.strip()}%"
        q = q.filter(
            (Course.title.ilike(search_filter)) |
            (Course.provider.ilike(search_filter)) |
            (Course.description.ilike(search_filter))
        )

    if category and category.strip() and category.lower() != "all":
        q = q.filter(Course.category.ilike(f"%{category.strip()}%"))

    if provider and provider.strip():
        q = q.filter(Course.provider.ilike(f"%{provider.strip()}%"))

    courses = q.all()

    items = []
    for c in courses:
        latest_report = db.query(Report).filter(
            Report.course_id == c.id,
            Report.overall_status == "completed"
        ).order_by(Report.generated_at.desc()).first()

        claims = db.query(Claim).filter(Claim.course_id == c.id).all()
        total_claims = len(claims)
        verified_claims = sum(1 for claim in claims if claim.verification_status == "verified")

        experiences = db.query(StudentExperience).filter(
            StudentExperience.course_id == c.id,
            StudentExperience.moderation_status == "approved"
        ).all()
        total_reviews = len(experiences)
        avg_rating = round(sum(e.rating for e in experiences) / total_reviews, 1) if total_reviews > 0 else None

        items.append(
            CourseDiscoveryItem(
                id=c.id,
                title=c.title,
                provider=c.provider,
                course_url=c.course_url,
                description=c.description,
                fee=c.fee,
                category=c.category,
                duration=c.duration,
                created_at=c.created_at,
                credibility_score=latest_report.credibility_score if latest_report else None,
                evidence_coverage=latest_report.evidence_coverage if latest_report else None,
                risk_level=latest_report.risk_level if latest_report else "undetermined",
                total_claims=total_claims,
                verified_claims=verified_claims,
                student_rating=avg_rating,
                total_reviews=total_reviews
            )
        )

    if sort_by == "credibility":
        items.sort(key=lambda x: (x.credibility_score is not None, x.credibility_score or 0), reverse=True)
    elif sort_by == "rating":
        items.sort(key=lambda x: (x.student_rating is not None, x.student_rating or 0), reverse=True)
    else:
        items.sort(key=lambda x: x.created_at, reverse=True)

    return items


# 2c. Multi-course Comparison Endpoint
@router.get(
    "/compare",
    response_model=CourseComparisonResponse
)
def compare_courses(
    ids: str,  # comma-separated course IDs e.g. "1,2,3"
    db: Session = Depends(get_db)
):
    try:
        course_ids = [int(i.strip()) for i in ids.split(",") if i.strip()][:3]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid course IDs provided")

    if not course_ids:
        raise HTTPException(status_code=400, detail="At least one course ID is required")

    comparison_items = []
    for cid in course_ids:
        c = db.query(Course).filter(Course.id == cid).first()
        if not c:
            continue

        latest_report = db.query(Report).filter(
            Report.course_id == c.id,
            Report.overall_status == "completed"
        ).order_by(Report.generated_at.desc()).first()

        claims = db.query(Claim).filter(Claim.course_id == c.id).all()
        total_claims = len(claims)
        verified_count = sum(1 for cl in claims if cl.verification_status == "verified")
        conflicting_count = sum(1 for cl in claims if cl.verification_status == "conflicting")
        unverified_count = sum(1 for cl in claims if cl.verification_status == "unverified")

        experiences = db.query(StudentExperience).filter(
            StudentExperience.course_id == c.id,
            StudentExperience.moderation_status == "approved"
        ).all()

        tot_rev = len(experiences)
        student_metrics = None
        if tot_rev > 0:
            student_metrics = ExperienceAggregation(
                total_reviews=tot_rev,
                average_rating=round(sum(e.rating for e in experiences) / tot_rev, 1),
                internships_promised=sum(1 for e in experiences if e.internship_promised),
                internships_received=sum(1 for e in experiences if e.internship_received),
                placements_promised=sum(1 for e in experiences if e.placement_promised),
                placements_received=sum(1 for e in experiences if e.placement_received),
                certificates_received=sum(1 for e in experiences if e.certificate_received),
                positive_count=sum(1 for e in experiences if e.rating >= 4),
                mixed_count=sum(1 for e in experiences if e.rating == 3),
                negative_count=sum(1 for e in experiences if e.rating <= 2)
            )

        comparison_items.append(
            CourseComparisonItem(
                course=CourseResponse.model_validate(c),
                credibility_score=latest_report.credibility_score if latest_report else None,
                evidence_coverage=latest_report.evidence_coverage if latest_report else None,
                risk_level=latest_report.risk_level if latest_report else "undetermined",
                total_claims=total_claims,
                verified_claims=verified_count,
                conflicting_claims=conflicting_count,
                unverified_claims=unverified_count,
                student_metrics=student_metrics
            )
        )

    return CourseComparisonResponse(courses=comparison_items)


# 3. Get a specific course (Publicly inspectable for course report audits)
@router.get(
    "/{course_id}",
    response_model=CourseResponse
)
def get_course(
    course_id: int,
    db: Session = Depends(get_db)
):

    course = db.query(Course).filter(
        Course.id == course_id
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


# 5. Run AI verification for a submitted course
@router.post(
    "/{course_id}/verify",
    status_code=status.HTTP_200_OK
)
def verify_course(
    course_id: int,
    request: VerificationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # STEP 1: Check course ownership
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.submitted_by == current_user.id
    ).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    # STEP 2: Prepare course information
    course_description = f"""
    Course Title: {course.title}
    Provider: {course.provider}
    Course Description: {course.description or ""}
    Course URL: {course.course_url or ""}
    """

    # STEP 3: Convert submitted evidence into dictionaries
    evidence_by_claim = {
        claim_index: [
            evidence.model_dump()
            for evidence in evidence_items
        ]
        for claim_index, evidence_items in request.evidence_by_claim.items()
    }

    # STEP 4: Run all three AI agents
    try:

        result = verification_orchestrator.run_verification(
            course_id=course.id,
            course_description=course_description,
            db=db,
            evidence_by_claim=evidence_by_claim
        )

        return result

    except RuntimeError:
        logging.exception(
            "Verification failed for course ID: %s",
            course_id
        )

        raise HTTPException(
            status_code=500,
            detail="Course verification failed. Check backend terminal logs."
        )