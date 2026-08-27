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

    def recommend_courses(self, skills=None, interests=None, target_role=None,
                           completed_courses=None, num_courses=6):
        skills = skills or []
        interests = interests or []
        completed_courses = completed_courses or []

        prompt = f"""
You are a career-guidance AI for a student/placement-prep platform.

Student profile:
- Current skills: {", ".join(skills) if skills else "not specified"}
- Interests: {", ".join(interests) if interests else "not specified"}
- Target role: {target_role or "not specified - infer a sensible one from skills/interests"}
- Already completed courses: {", ".join(completed_courses) if completed_courses else "none"}

Recommend exactly {num_courses} courses that would most help this student
close their skill gaps and reach their target role. Don't repeat anything
in "already completed courses". Order them by priority (most important
first).

Return ONLY valid JSON in exactly this format:

{{
  "courses": [
    {{
      "title": "",
      "tag": "",
      "level": "Beginner | Intermediate | Advanced",
      "description": "",
      "estimated_hours": 0,
      "matched_skills": [],
      "why_recommended": ""
    }}
  ]
}}

Rules:
- "tag" is a short category like "Python", "DSA", "Cloud", "AI/ML", "SQL", "Frontend", "Backend", "Aptitude".
- "description" is 1-2 sentences.
- "why_recommended" is 1 sentence tying it directly to this student's stated skills/interests/role.
- "matched_skills" lists 2-4 skills from the student's profile (or gaps) this course addresses.
- Return ONLY the JSON object, no markdown fences, no commentary.
"""
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return self._strip_and_parse(response.text)

    def generate_course_content(self, course_title, level="Intermediate", tag=None):
        context_line = f"Category: {tag}" if tag else ""

        prompt = f"""
You are an expert curriculum designer creating course content for a
placement-prep learning platform.

Course title: {course_title}
Level: {level}
{context_line}

Generate a complete course outline with real, substantive lesson content
(not just titles - actual explanations a student could learn from).

Return ONLY valid JSON in exactly this format:

{{
  "course_title": "{course_title}",
  "level": "{level}",
  "estimated_hours": 0,
  "modules": [
    {{
      "module_title": "",
      "lessons": [
        {{
          "lesson_title": "",
          "content": "",
          "key_points": []
        }}
      ]
    }}
  ]
}}

Rules:
- 3-5 modules, each with 2-4 lessons.
- "content" is a substantive explanation of the lesson topic, written in
  clear plain language, roughly 100-200 words - enough for the student to
  actually learn the concept, not just a topic label.
- "key_points" is 3-5 short bullet takeaways for that lesson.
- Order modules from foundational to advanced.
- Return ONLY the JSON object, no markdown fences, no commentary.
"""
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return self._strip_and_parse(response.text)

    def generate_assessment(self, course_title, level="Intermediate", num_questions=5):
        prompt = f"""
You are creating a graded assessment for a student who just finished a
course.

Course title: {course_title}
Level: {level}
Number of questions: {num_questions}

Return ONLY valid JSON in exactly this format:

{{
  "course_title": "{course_title}",
  "passing_score": 70,
  "questions": [
    {{
      "id": "q1",
      "prompt": "",
      "options": [
        {{ "id": "a", "text": "" }},
        {{ "id": "b", "text": "" }},
        {{ "id": "c", "text": "" }},
        {{ "id": "d", "text": "" }}
      ],
      "correct_option_id": "a",
      "explanation": ""
    }}
  ],
  "reward": {{
    "badge_name": "",
    "xp_points": 0,
    "certificate_line": ""
  }}
}}

Rules:
- Exactly {num_questions} multiple-choice questions, each with exactly 4
  options and exactly one correct answer.
- Questions should test real understanding of {course_title} at {level}
  level, not trivia.
- "explanation" briefly says why the correct answer is right (1 sentence).
- "badge_name" is a short, motivating badge title for passing this course's
  assessment (e.g. "Python Fundamentals Certified").
- "xp_points" is an integer between 50 and 200 based on the course's level
  (higher for Advanced).
- "certificate_line" is one sentence a student could show on a resume/profile
  after passing (e.g. "Completed and passed assessment for {course_title}").
- Return ONLY the JSON object, no markdown fences, no commentary.
"""
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return self._strip_and_parse(response.text)