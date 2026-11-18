import json
from typing import Any, Literal

from pydantic import BaseModel, Field, ValidationError

from app.services.gemini_service import gemini_service


class RiskAnalysisResult(BaseModel):

    risk_level: Literal[
        "low",
        "medium",
        "high",
        "undetermined"
    ]

    risk_factors: list[str] = Field(default_factory=list)

    positive_indicators: list[str] = Field(default_factory=list)

    summary: str

    recommendations: list[str] = Field(default_factory=list)


class RiskAnalysisAgent:

    def analyse_risk(
        self,
        claims: list[dict[str, Any]],
        evidence_results: list[dict[str, Any]]
    ) -> dict[str, Any]:

        if not isinstance(claims, list):
            raise ValueError("Claims must be provided as a list.")

        if not isinstance(evidence_results, list):
            raise ValueError("Evidence results must be provided as a list.")

        if not claims:
            raise ValueError("At least one claim is required.")

        prompt = f"""
You are the Risk Analysis Agent of VeriCourse AI.

Your responsibility is to analyse educational course claims
and their evidence verification results.

COURSE CLAIMS:
{json.dumps(claims, indent=2)}

EVIDENCE VERIFICATION RESULTS:
{json.dumps(evidence_results, indent=2)}

RISK ASSESSMENT RULES:

1. Analyse every claim and its available evidence.
2. Consider conflicting evidence a significant risk indicator.
3. Consider unsupported claims as potential warning signs.
4. Consider credible supporting evidence a positive indicator.
5. Missing evidence must not automatically mean fraud.
6. Do not invent information.
7. Do not make legal accusations against providers.
8. Explain the reasons behind the risk assessment.
9. If evidence is insufficient to make a meaningful assessment,
   use undetermined.
10. Recommendations must be practical and evidence-based.

RISK LEVELS:

LOW:
Available evidence generally supports the claims and no major
unresolved concerns are identified.

MEDIUM:
Some claims remain unsupported or require additional investigation.

HIGH:
Significant contradictions or multiple serious unsupported
claims require further investigation.

UNDETERMINED:
There is insufficient information to make a meaningful assessment.

Return ONLY a valid JSON object in this format:

{{
    "risk_level": "low | medium | high | undetermined",
    "risk_factors": [],
    "positive_indicators": [],
    "summary": "Explain the overall assessment",
    "recommendations": []
}}
"""

        response = gemini_service.generate_response(prompt)

        try:
            parsed = json.loads(response)

            result = RiskAnalysisResult(**parsed)

            return result.model_dump()

        except (json.JSONDecodeError, ValidationError) as error:

            raise RuntimeError(
                f"Risk analysis failed: {error}"
            ) from error


risk_analysis_agent = RiskAnalysisAgent()