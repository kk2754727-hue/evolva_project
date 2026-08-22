import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()


class GeminiNotConfiguredError(RuntimeError):
    """Raised when GEMINI_API_KEY is missing so callers can return a clean 503 instead of crashing."""


class GeminiEvaluator:
    """
    Wraps Gemini for both interview-answer evaluation and resume analysis.
    Client is created lazily so a missing API key only fails the specific
    request that needed it, not the whole server on startup.
    """

    def __init__(self):
        self._client = None

    @property
    def client(self):
        if self._client is None:
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                raise GeminiNotConfiguredError(
                    "GEMINI_API_KEY is not set. Add it to backend/.env"
                )
            self._client = genai.Client(api_key=api_key)
        return self._client

    @staticmethod
    def _strip_and_parse(text):
        text = text.strip().replace("```json", "").replace("```", "").strip()
        try:
            return json.loads(text)
        except Exception:
            return {"raw_response": text}

    def evaluate(self, question, answer):
        prompt = f"""
You are an expert HR interviewer.

Evaluate the following interview answer.

Question:
{question}

Candidate Answer:
{answer}

Return ONLY valid JSON in this format:

{{
    "technical_score": 0,
    "communication_score": 0,
    "grammar_score": 0,
    "confidence_score": 0,
    "overall_score": 0,
    "strengths": [],
    "weaknesses": [],
    "suggestions": []
}}
"""
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return self._strip_and_parse(response.text)

    def analyze_resume(self, resume_text, target_role=None):
        role_line = f"Target role: {target_role}" if target_role else "Target role: not specified (assume general tech/placement roles)"

        prompt = f"""
You are an expert ATS (Applicant Tracking System) and resume reviewer for
students and early-career job seekers applying to tech roles.

{role_line}

Resume text (extracted from an uploaded file, formatting may be imperfect):
---
{resume_text[:12000]}
---

Analyze this resume and return ONLY valid JSON in exactly this format:

{{
    "ats_score": 0,
    "formatting_score": 0,
    "keyword_score": 0,
    "detected_skills": [],
    "missing_keywords": [],
    "strengths": [],
    "improvements": []
}}

Rules:
- All scores are integers 0-100.
- "strengths" and "improvements" should each contain 2-4 short, specific,
  one-sentence items (improvements should be actionable, e.g. "Add measurable
  impact like % improvement or time saved to your project bullets").
- "missing_keywords" should list up to 5 relevant technical keywords for the
  target role that are absent from the resume.
- Return ONLY the JSON object, no markdown fences, no commentary.
"""
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return self._strip_and_parse(response.text)
