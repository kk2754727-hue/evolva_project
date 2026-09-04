"""
Gemini evaluator — used ONLY for:
  1. Mock interview answer scoring  (/api/interview/evaluate)
  2. Resume analysis                (/api/resume/analyze)

Everything else (skill gap, course recommendations, course content,
assessments) is handled statically — no AI needed.
"""

import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()


class GeminiNotConfiguredError(RuntimeError):
    """Raised when GEMINI_API_KEY is missing — callers return a clean 503."""


class GeminiEvaluator:
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
    def _parse(text):
        text = text.strip().replace("```json", "").replace("```", "").strip()
        start, end = text.find("{"), text.rfind("}")
        if start != -1 and end != -1:
            text = text[start:end + 1]
        try:
            return json.loads(text)
        except Exception:
            return {"raw_response": text}

    # ── Interview scoring ────────────────────────────────────────────────────
    def evaluate(self, question, answer):
        prompt = f"""You are an expert HR interviewer. Evaluate this interview answer strictly and fairly.

Question: {question}
Candidate Answer: {answer}

Return ONLY valid JSON with no extra text:
{{
  "technical_score": 0,
  "communication_score": 0,
  "grammar_score": 0,
  "confidence_score": 0,
  "overall_score": 0,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."]
}}

Rules:
- All scores are integers 0-100.
- strengths, weaknesses, suggestions: 2-3 short specific items each.
- overall_score is a weighted average of the four scores.
- Return ONLY the JSON object."""

        r = self.client.models.generate_content(
            model="gemini-2.5-flash", contents=prompt
        )
        return self._parse(r.text)

    # ── Resume analysis ──────────────────────────────────────────────────────
    def analyze_resume(self, resume_text, target_role=None):
        role = (
            f"Target role: {target_role}"
            if target_role
            else "Target role: general tech / placement roles"
        )
        prompt = f"""You are an expert ATS resume reviewer for students applying to tech roles.
{role}

Resume text:
---
{resume_text[:12000]}
---

Return ONLY valid JSON with no extra text:
{{
  "ats_score": 0,
  "formatting_score": 0,
  "keyword_score": 0,
  "detected_skills": ["..."],
  "missing_keywords": ["..."],
  "strengths": ["..."],
  "improvements": ["..."]
}}

Rules:
- All scores are integers 0-100.
- strengths and improvements: 2-4 short, specific, actionable items each.
- missing_keywords: up to 5 important keywords absent from the resume.
- Return ONLY the JSON object."""

        r = self.client.models.generate_content(
            model="gemini-2.5-flash", contents=prompt
        )
        return self._parse(r.text)