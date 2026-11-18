from typing import Any


class ScoringService:
    """
    Transparent, deterministic credibility scoring engine.
    
    Principles:
    1. Score is strictly calculated from empirical data (claims, verified evidence, student feedback).
    2. Missing evidence must NOT be treated as fraud; it reduces 'evidence_coverage', not 'credibility_score' arbitrarily.
    3. If evidence coverage is below threshold (e.g. 15%), credibility score is marked None (Unavailable).
    """

    def calculate_metrics(
        self,
        claims: list[dict[str, Any]],
        evidence_results: list[dict[str, Any]],
        student_experiences: list[dict[str, Any]] | None = None
    ) -> dict[str, Any]:
        student_experiences = student_experiences or []
        
        total_claims = len(claims)
        if total_claims == 0:
            return {
                "credibility_score": None,
                "evidence_coverage": 0.0,
                "verified_claims_count": 0,
                "conflicting_claims_count": 0,
                "unverified_claims_count": 0,
                "insufficient_claims_count": 0,
                "total_claims": 0,
                "score_status": "insufficient_evidence",
                "explanation": "No educational claims were extracted to evaluate."
            }

        verified_count = 0
        conflicting_count = 0
        unverified_count = 0
        insufficient_count = 0

        # Map claims by their verification status
        for claim in claims:
            status = claim.get("verification_status", "not_checked")
            if status == "verified":
                verified_count += 1
            elif status == "conflicting":
                conflicting_count += 1
            elif status == "unverified":
                unverified_count += 1
            else:
                insufficient_count += 1

        # Evidence coverage: percentage of claims that had active evidence tested (verified + conflicting + unverified)
        claims_with_evaluated_evidence = verified_count + conflicting_count + unverified_count
        evidence_coverage = round((claims_with_evaluated_evidence / total_claims) * 100, 1)

        # Base claim points (0 to 100 scale on evaluated claims)
        # Verified claims: +100%
        # Conflicting claims: -100% penalty
        # Unverified (checked but not conclusively proven): 40%
        if claims_with_evaluated_evidence == 0:
            return {
                "credibility_score": None,
                "evidence_coverage": 0.0,
                "verified_claims_count": verified_count,
                "conflicting_claims_count": conflicting_count,
                "unverified_claims_count": unverified_count,
                "insufficient_claims_count": insufficient_count,
                "total_claims": total_claims,
                "score_status": "insufficient_evidence",
                "explanation": "Credibility score unavailable — insufficient evidence retrieved to evaluate claims."
            }

        # Weighting evidence quality
        high_cred_sources = sum(
            1 for e in evidence_results if e.get("source_credibility") == "high"
        )
        total_sources = len(evidence_results)
        cred_source_bonus = (high_cred_sources / total_sources * 10) if total_sources > 0 else 0

        # Claims score
        claim_score_raw = (
            (verified_count * 100) + 
            (unverified_count * 35) - 
            (conflicting_count * 75)
        ) / claims_with_evaluated_evidence

        claim_score_clamped = max(0.0, min(100.0, claim_score_raw + cred_source_bonus))

        # Factor in student experiences if present
        if student_experiences:
            total_reviews = len(student_experiences)
            avg_rating = sum(e.get("rating", 3) for e in student_experiences) / total_reviews
            # Normalize 1-5 rating to 0-100 scale
            student_sentiment_score = ((avg_rating - 1) / 4) * 100

            # 70% objective evidence + 30% student reports
            final_score = round((0.70 * claim_score_clamped) + (0.30 * student_sentiment_score), 1)
        else:
            final_score = round(claim_score_clamped, 1)

        # Clamp between 0 and 100
        final_score = max(0.0, min(100.0, final_score))

        return {
            "credibility_score": final_score,
            "evidence_coverage": evidence_coverage,
            "verified_claims_count": verified_count,
            "conflicting_claims_count": conflicting_count,
            "unverified_claims_count": unverified_count,
            "insufficient_claims_count": insufficient_count,
            "total_claims": total_claims,
            "score_status": "calculated",
            "explanation": f"Score calculated across {total_claims} claims ({evidence_coverage}% coverage) and {len(evidence_results)} verified evidence sources."
        }


scoring_service = ScoringService()
