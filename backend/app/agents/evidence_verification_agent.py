import json
from typing import Any, Literal

from pydantic import BaseModel, ValidationError

from app.services.gemini_service import gemini_service
from app.services.evidence_retrieval_service import (
    evidence_retrieval_service
)


class EvidenceVerificationResult(BaseModel):

    verification_status: Literal[
        "verified",
        "conflicting",
        "unverified",
        "insufficient_evidence"
    ]

    source_credibility: Literal[
        "high",
        "medium",
        "low",
        "unknown"
    ]

    evidence_relevance: Literal["high", "medium", "low"]

    explanation: str
    limitations: str


class EvidenceVerificationAgent:

    def verify_evidence(
        self,
        claim_text: str,
        source_name: str,
        source_url: str,
        evidence_description: str = ""
    ) -> dict[str, Any]:

        if not claim_text or not claim_text.strip():
            raise ValueError("Claim text cannot be empty.")

        if not source_name or not source_name.strip():
            raise ValueError("Source name cannot be empty.")

        if not source_url or not source_url.strip():
            return self._insufficient_result(
                "No source URL was provided. Independent retrieval "
                "could not be performed."
            )

        # STEP 1: Retrieve actual webpage content.
        try:
            retrieved = evidence_retrieval_service.retrieve_source(
                source_url
            )

        except (ValueError, RuntimeError) as error:
            return self._insufficient_result(
                f"Source retrieval failed: {error}"
            )

        actual_content = retrieved["content"]

        # STEP 2: Prepare evidence for Gemini.
        prompt = f"""
You are the Evidence Verification Agent of VeriCourse AI.

Your task is to evaluate whether the retrieved webpage content
supports the educational claim.

CLAIM:
{claim_text}

SOURCE NAME:
{source_name}

SOURCE URL:
{retrieved['source_url']}

PAGE TITLE:
{retrieved['page_title']}

USER DESCRIPTION:
{evidence_description or "No description provided"}

ACTUAL RETRIEVED WEBPAGE CONTENT:
{actual_content[:12000]}

IMPORTANT RULES:

1. Analyse the actual retrieved webpage content.
2. Never invent facts, sources, or evidence.
3. A webpage mentioning a claim does not automatically prove it.
4. Evaluate whether the source is authoritative for this particular
   claim, not merely whether the website looks professional.
5. A source name or URL alone does not establish credibility.
6. If the evidence directly and adequately supports the claim,
   you may classify it as verified.
7. If the source contradicts the claim, classify it as conflicting.
8. If the content is irrelevant or does not adequately support
   the claim, classify it as insufficient_evidence or unverified.
9. Do not treat missing evidence as proof of fraud.
10. Explain uncertainty and limitations clearly.
11. Do not claim that a university, accreditation body, or
    certification is officially recognised unless the retrieved
    content establishes that fact.
12. A single retrieved webpage is not necessarily sufficient
    independent confirmation.

Return ONLY a valid JSON object:

{{
    "verification_status": "verified | conflicting | unverified | insufficient_evidence",
    "source_credibility": "high | medium | low | unknown",
    "evidence_relevance": "high | medium | low",
    "explanation": "Explain your assessment",
    "limitations": "Explain limitations"
}}
"""

        # STEP 3: Ask Gemini to analyse retrieved evidence.
        response = gemini_service.generate_response(prompt)

        print("\n========== AGENT 2 GEMINI RAW RESPONSE ==========")
        print(repr(response))
        print("========== END AGENT 2 RESPONSE ==========\n")
        # Remove Markdown code fences if Gemini adds them
        response = response.strip()

        if response.startswith("```"):
            response = response.split("\n", 1)[1]
            response = response.rsplit("```", 1)[0].strip()

        try:
            parsed = json.loads(response)

            result = EvidenceVerificationResult(**parsed)

            output = result.model_dump()

            # STEP 4: Attach retrieval provenance.
            output["retrieval_metadata"] = {
                "source_url": retrieved["source_url"],
                "page_title": retrieved["page_title"],
                "content_hash": retrieved["content_hash"],
                "fetched_at": retrieved["fetched_at"],
                "retrieval_status": retrieved["retrieval_status"]
            }

            return output

        except (json.JSONDecodeError, ValidationError) as error:
            raise RuntimeError(
                f"Evidence verification failed: {error}"
            ) from error

    def _insufficient_result(self, reason: str) -> dict[str, Any]:

        return {
            "verification_status": "insufficient_evidence",
            "source_credibility": "unknown",
            "evidence_relevance": "low",
            "explanation": reason,
            "limitations": (
                "The source could not be independently retrieved. "
                "The claim has not been verified."
            ),
            "retrieval_metadata": None
        }


evidence_verification_agent = EvidenceVerificationAgent()