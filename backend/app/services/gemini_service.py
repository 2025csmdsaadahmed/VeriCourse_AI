import os

from dotenv import load_dotenv
from google import genai


# Load environment variables
load_dotenv()


class GeminiService:

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = os.getenv(
            "GEMINI_MODEL",
            "gemini-2.5-flash"
        )

        if not self.api_key:
            raise ValueError(
                "GEMINI_API_KEY is missing from backend/.env"
            )

        self.client = genai.Client(
            api_key=self.api_key
        )

    def generate_response(self, prompt: str) -> str:
        """
        Send a prompt to Gemini and return its text response.
        """

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt
            )

            if not response.text:
                raise RuntimeError(
                    "Gemini returned an empty response."
                )

            return response.text.strip()

        except Exception as error:
            raise RuntimeError(
                f"Gemini API request failed: {error}"
            ) from error


# Shared service instance
gemini_service = GeminiService()