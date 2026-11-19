from typing import Any
from datetime import datetime

from sqlalchemy.orm import Session

from app.agents.claim_extraction_agent import claim_extraction_agent
from app.agents.evidence_verification_agent import evidence_verification_agent
from app.agents.risk_analysis_agent import risk_analysis_agent

from app.models.claim import Claim
from app.models.evidence import Evidence
from app.models.report import Report
from app.models.student_experience import StudentExperience
from app.services.scoring_service import scoring_service


class VerificationOrchestrator:

    def _get_claim_status(self, evidence_results: list) -> str:

        if not evidence_results:
            return "insufficient_evidence"

        statuses = [
            item["verification_status"]
            for item in evidence_results
        ]

        if "conflicting" in statuses:
            return "conflicting"

        if "unverified" in statuses:
            return "unverified"

        if all(status == "verified" for status in statuses):
            return "verified"

        return "insufficient_evidence"

    def run_verification(
        self,
        course_id: int,
        course_description: str,
        db: Session,
        evidence_by_claim: dict[int, list[dict[str, Any]]] | None = None
    ) -> dict[str, Any]:

        if not course_description or not course_description.strip():
            raise ValueError("Course description cannot be empty.")

        evidence_by_claim = evidence_by_claim or {}

        try:

            # STEP 1: Extract claims using Agent 1.

            claims = claim_extraction_agent.extract_claims(
                course_description
            )
            saved_claims = []
            all_evidence_results = []
            # Handle cases where no claims are extracted.
            if not claims:

                report = Report(
                    course_id=course_id,
                    overall_status="completed",
                    risk_level="undetermined",
                    summary="No educational claims were identified in the course description.",
                    recommendations=(
                        "Provide a more detailed course description containing "
                        "specific educational claims for verification."
                    )
                )

                db.add(report)
                db.commit()
                db.refresh(report)

                return {
                    "report_id": report.id,
                    "course_id": course_id,
                    "claims": [],
                    "evidence_results": [],
                    "risk_analysis": {
                        "risk_level": "undetermined",
                        "risk_factors": [],
                        "positive_indicators": [],
                        "summary": "No educational claims were identified.",
                        "recommendations": [
                            "Provide a more detailed course description."
                        ]
                    }
                }

            # STEP 2: Save extracted claims.

            for claim_index, claim_data in enumerate(claims):

                db_claim = Claim(
                    course_id=course_id,
                    claim_text=claim_data["claim_text"],
                    claim_category=claim_data["claim_category"],
                    verification_status="not_checked"
                )

                db.add(db_claim)
                db.flush()

                saved_claims.append(db_claim)

                claim_evidence = evidence_by_claim.get(
                    claim_index,
                    []
                )

                claim_results = []

                # STEP 3: Verify evidence using Agent 2.
                # If student supplied manual sources, verify them:
                if claim_evidence:
                    for evidence_data in claim_evidence:
                        result = evidence_verification_agent.verify_evidence(
                            claim_text=claim_data["claim_text"],
                            source_name=evidence_data.get("source_name", ""),
                            source_url=evidence_data.get("source_url", ""),
                            evidence_description=evidence_data.get(
                                "evidence_description", ""
                            )
                        )
                        metadata = result.get("retrieval_metadata") or {}
                        fetched_at = metadata.get("fetched_at")
                        if fetched_at:
                            fetched_at = datetime.fromisoformat(
                                fetched_at.replace("Z", "+00:00")
                            )

                        db_evidence = Evidence(
                            claim_id=db_claim.id,
                            source_name=evidence_data.get("source_name", "Unknown source"),
                            source_url=evidence_data.get("source_url"),
                            evidence_description=evidence_data.get("evidence_description"),
                            evidence_status=result["verification_status"],
                            source_credibility=result["source_credibility"],
                            evidence_relevance=result["evidence_relevance"],
                            verification_explanation=result["explanation"],
                            verification_limitations=result["limitations"],
                            page_title=metadata.get("page_title"),
                            content_hash=metadata.get("content_hash"),
                            fetched_at=fetched_at
                        )
                        db.add(db_evidence)
                        db.flush()

                        result["claim_index"] = claim_index
                        result["claim_id"] = db_claim.id
                        result["evidence_id"] = db_evidence.id
                        result["claim_text"] = claim_data["claim_text"]
                        claim_results.append(result)
                        all_evidence_results.append(result)
                else:
                    # Automated Agent 2 Corroboration: Auto-discover public evidence for the claim
                    auto_ev = evidence_verification_agent.auto_discover_evidence(
                        claim_text=claim_data["claim_text"],
                        claim_category=claim_data.get("claim_category", "general"),
                        provider=""
                    )
                    db_evidence = Evidence(
                        claim_id=db_claim.id,
                        source_name=auto_ev.get("source_name", "Industry Benchmark Registry"),
                        source_url=auto_ev.get("source_url"),
                        evidence_description=auto_ev.get("evidence_description"),
                        evidence_status=auto_ev["verification_status"],
                        source_credibility=auto_ev["source_credibility"],
                        evidence_relevance=auto_ev["evidence_relevance"],
                        verification_explanation=auto_ev["explanation"],
                        verification_limitations=auto_ev["limitations"],
                        page_title=auto_ev.get("source_name"),
                        content_hash="automated-agent2-corroboration",
                        fetched_at=datetime.utcnow()
                    )
                    db.add(db_evidence)
                    db.flush()

                    auto_ev["claim_index"] = claim_index
                    auto_ev["claim_id"] = db_claim.id
                    auto_ev["evidence_id"] = db_evidence.id
                    auto_ev["claim_text"] = claim_data["claim_text"]
                    claim_results.append(auto_ev)
                    all_evidence_results.append(auto_ev)

                # STEP 4: Update claim verification status.

                db_claim.verification_status = self._get_claim_status(
                    claim_results
                )

            # STEP 5: Analyse overall risk using Agent 3.

            risk_analysis = risk_analysis_agent.analyse_risk(
                claims=claims,
                evidence_results=all_evidence_results
            )

            # Query approved student experiences if any exist for this course
            student_exps = db.query(StudentExperience).filter(
                StudentExperience.course_id == course_id,
                StudentExperience.moderation_status == "approved"
            ).all()

            exp_dicts = [
                {"rating": exp.rating, "sentiment": exp.review_text}
                for exp in student_exps
            ]

            # Calculate deterministic credibility score & coverage
            metrics = scoring_service.calculate_metrics(
                claims=[
                    {
                        "claim_text": c.claim_text,
                        "claim_category": c.claim_category,
                        "verification_status": c.verification_status
                    }
                    for c in saved_claims
                ],
                evidence_results=all_evidence_results,
                student_experiences=exp_dicts
            )

            # STEP 6: Save final report.

            report = Report(
                course_id=course_id,
                overall_status="completed",
                risk_level=risk_analysis["risk_level"],
                credibility_score=metrics["credibility_score"],
                evidence_coverage=metrics["evidence_coverage"],
                summary=risk_analysis["summary"],
                recommendations="\n".join(
                    risk_analysis["recommendations"]
                )
            )

            db.add(report)

            db.commit()

            db.refresh(report)

            # STEP 7: Return complete verification result.

            return {
                "report_id": report.id,
                "course_id": course_id,

                "claims": [
                    {
                        "id": claim.id,
                        "claim_text": claim.claim_text,
                        "claim_category": claim.claim_category,
                        "verification_status": claim.verification_status
                    }
                    for claim in saved_claims
                ],

                "evidence_results": all_evidence_results,

                "risk_analysis": risk_analysis,
                "scoring_metrics": metrics
            }

        except Exception as error:

            db.rollback()

            raise RuntimeError(
                f"Verification process failed: {error}"
            ) from error


verification_orchestrator = VerificationOrchestrator()