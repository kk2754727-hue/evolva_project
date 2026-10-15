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

    def extract_resume_topics(self, resume_text):
        prompt = f"""You are an expert technical interviewer. Read this resume and extract the key
topics, technologies, projects, and skills that should be covered in a technical interview.

Resume:
---
{resume_text[:6000]}
---

Return ONLY valid JSON:
{{
  "topics": [
    "<concise topic — e.g. 'Python Flask REST API', 'React.js state management', 'MySQL query optimisation', 'Final year project: E-commerce platform'>"
  ]
}}

Rules:
- Extract 8-15 specific, concrete topics (not vague like "communication skills")
- Include: programming languages, frameworks, databases, tools, certifications, notable projects
- If a project is mentioned, include it as a topic with a brief description
- Topics should be interview-friendly — things an interviewer would naturally ask about
- Return ONLY the JSON object"""
        r = self.client.models.generate_content(
            model="gemini-2.5-flash", contents=prompt
        )
        return self._parse(r.text)

    def generate_interview_questions(self, mode="hr", target_role="Software Engineer",
                                     resume_topics=None, num_questions=5):
        topics_section = ""
        if resume_topics:
            topics_section = f"""
The candidate's resume has these key topics:
{chr(10).join(f"  - {t}" for t in resume_topics[:15])}

IMPORTANT: Weave at least {min(3, len(resume_topics))} questions directly around
these specific topics — ask about the projects, technologies, and skills listed above.
"""
        if mode == "hr":
            style = """You are a warm, professional HR interviewer.
Generate a natural HR interview question mix:
- 1 intro/background question
- 1-2 motivation questions (why this role/company)
- 1-2 strength/weakness questions
- 2-3 STAR behavioural questions ("Tell me about a time when…")
- 1 career goals question
Sound natural and conversational — not robotic."""
        elif mode == "technical":
            style = f"""You are a senior technical interviewer at a top tech company.
Generate rigorous technical questions appropriate for {target_role}:
- Data Structures & Algorithms (time/space complexity, problem solving)
- Core technical concepts (OOP, data structures, algorithms, complexity)
- OOP / Design Patterns
- Language/framework specific (based on resume topics if provided)
- Project deep-dive questions (ask candidates to explain decisions in their projects)
Each question should require a detailed, thoughtful answer — not just yes/no."""
        else:  # video — mix of both
            style = f"""You are conducting a combined HR + Technical interview for {target_role}.
Mix the question types naturally:
- 2 HR/behavioural questions (STAR format, motivation, strengths)
- 3+ technical questions (DSA, system design, project-specific)
- End with a career goals question
Make the transition between HR and technical feel natural."""

        prompt = f"""{style}

Target role: {target_role}
{topics_section}
Generate exactly {num_questions} interview questions.

Return ONLY valid JSON:
{{
  "questions": [
    {{
      "id": 1,
      "text": "<full question as an interviewer would ask it — complete sentence, warm professional tone>",
      "type": "intro|motivation|strength|weakness|behavioral|technical|coding|project|goal|closing",
      "tag": "<very short label e.g. 'Behavioural' | 'DSA' | 'Technical' | 'Project' | 'HR'>"
    }}
  ]
}}

Rules:
- Questions must be full, natural sentences — exactly how a real interviewer speaks
- Technical questions must require explanation, not just one-word answers
- If resume topics are provided, at least {min(3, num_questions)} questions must reference them specifically
- Do NOT repeat question types consecutively — vary the rhythm
- Return ONLY the JSON object, no markdown"""

        r = self.client.models.generate_content(
            model="gemini-2.5-flash", contents=prompt
        )
        return self._parse(r.text)