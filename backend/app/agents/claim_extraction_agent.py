import json
from typing import Any

from pydantic import BaseModel, Field, ValidationError

from app.services.gemini_service import gemini_service


class ExtractedClaim(BaseModel):
    claim_text: str = Field(min_length=5)
    claim_category: str


class ClaimExtractionAgent:

    ALLOWED_CATEGORIES = {
        "accreditation",
        "certification",
        "instructor_qualifications",
        "placement",
        "salary",
        "course_recognition",
        "course_outcomes",
        "other"
    }

    def extract_claims(self, course_description: str) -> list[dict[str, Any]]:
        if not course_description or not course_description.strip():
            raise ValueError("Course description cannot be empty.")

        prompt = f"""
You are the Claim Extraction Agent of VeriCourse AI.

Your task is to identify factual claims explicitly made by an
educational course provider.

Extract claims concerning:
- Accreditation and institutional recognition
- Certification
- Instructor qualifications
- Placement guarantees and placement rates
- Salary and package claims
- Course recognition
- Learning outcomes and other factual promises

Rules:
1. Extract only claims supported by the supplied text.
2. Never invent missing information.
3. Do not treat opinions or general promotional language as facts.
4. Keep each claim independent and specific.
5. Do not decide whether a claim is true or false.
6. Do not assign credibility scores.
7. Use only the permitted categories listed below.
8. If no factual claims exist, return an empty list.

Permitted categories:
{sorted(self.ALLOWED_CATEGORIES)}

Return ONLY valid JSON in this exact structure:

{{
    "claims": [
        {{
            "claim_text": "The extracted factual claim",
            "claim_category": "accreditation"
        }}
    ]
}}

Course description:
{course_description}
"""

        response = gemini_service.generate_response(prompt)
        print("\n========== GEMINI RAW RESPONSE ==========")
        print(repr(response))
        print("========== END GEMINI RESPONSE ==========\n")
        try:
            parsed = json.loads(response)

            if not isinstance(parsed, dict):
                raise ValueError("Gemini response must be a JSON object.")

            claims = parsed.get("claims")

            if not isinstance(claims, list):
                raise ValueError("Gemini response must contain a claims list.")

            validated_claims = []

            for item in claims:
                if not isinstance(item, dict):
                    continue

                category = item.get("claim_category", "").strip().lower()

                if category not in self.ALLOWED_CATEGORIES:
                    category = "other"

                validated = ExtractedClaim(
                    claim_text=item.get("claim_text", "").strip(),
                    claim_category=category
                )

                validated_claims.append(
                    validated.model_dump()
                )

            return validated_claims

        except (json.JSONDecodeError, ValidationError, ValueError) as error:
            raise RuntimeError(
                f"Claim extraction failed: {error}"
            ) from error


# Shared agent instance
claim_extraction_agent = ClaimExtractionAgent()