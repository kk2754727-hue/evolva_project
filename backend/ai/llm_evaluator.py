"""
All the AI logic, now running on a local Ollama model instead of a cloud
API. Same responsibilities as the old GeminiEvaluator (interview scoring,
resume analysis, course recommendations/content/assessments), plus a new
skill-gap analyzer, all going through OllamaClient instead of a paid API.
"""

from ai.ollama_client import OllamaClient, OllamaNotAvailableError  # noqa: F401 (re-exported for app.py)


class LLMEvaluator:
    def __init__(self):
        self.client = OllamaClient()

    # ------------------------------------------------------------------
    # Mock interview answer scoring
    # ------------------------------------------------------------------
    def evaluate(self, question, answer):
        prompt = f"""You are an expert HR interviewer. Evaluate this interview answer.

Question: {question}

Candidate Answer: {answer}

Return ONLY this JSON structure, nothing else:
{{
  "technical_score": <integer 0-100>,
  "communication_score": <integer 0-100>,
  "grammar_score": <integer 0-100>,
  "confidence_score": <integer 0-100>,
  "overall_score": <integer 0-100>,
  "strengths": ["short point", "short point"],
  "weaknesses": ["short point", "short point"],
  "suggestions": ["short actionable suggestion"]
}}"""
        return self.client.generate_json(prompt, temperature=0.3, num_predict=700)

    # ------------------------------------------------------------------
    # Resume analysis
    # ------------------------------------------------------------------
    def analyze_resume(self, resume_text, target_role=None):
        role_line = f"Target role: {target_role}" if target_role else "Target role: general tech/placement roles"

        prompt = f"""You are an ATS resume reviewer for students applying to tech roles.

{role_line}

Resume text:
---
{resume_text[:8000]}
---

Return ONLY this JSON structure, nothing else:
{{
  "ats_score": <integer 0-100>,
  "formatting_score": <integer 0-100>,
  "keyword_score": <integer 0-100>,
  "detected_skills": ["skill1", "skill2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "strengths": ["short point", "short point"],
  "improvements": ["short actionable point", "short actionable point"]
}}"""
        return self.client.generate_json(prompt, temperature=0.3, num_predict=700)

    # ------------------------------------------------------------------
    # Skill gap analysis
    # ------------------------------------------------------------------
    def analyze_skill_gap(self, current_skills, target_role=None):
        """
        current_skills: list of {"name": str, "pct": int} - the student's
        self-rated (or platform-tracked) proficiency in each skill.
        """
        skills_lines = "\n".join(f"- {s['name']}: {s.get('pct', 0)}%" for s in current_skills)
        role_line = f"Target role: {target_role}" if target_role else "Target role: general software/tech placement roles"

        prompt = f"""You are a career skill-gap analyst for a student preparing for tech job placements.

{role_line}

Student's current skill levels:
{skills_lines}

For this target role, identify the skills that matter most (including ones
the student didn't list, if they're clearly required and missing - give
those a current level of 0), the target proficiency level needed, and how
urgently each should be improved.

Return ONLY this JSON structure, nothing else:
{{
  "gaps": [
    {{
      "name": "<skill name>",
      "current": <integer 0-100, from the student's data or 0 if missing>,
      "target": <integer 0-100, level needed for the target role>,
      "priority": "High priority" | "Medium priority" | "Low priority" | "On target",
      "recommended_course": "<a specific course title that would close this gap, or empty string if on target>",
      "reason": "<one short sentence on why this matters for the target role>"
    }}
  ]
}}

Include 5-8 skills total, ordered by priority (High first). Mark a skill
"On target" only if current >= target."""
        return self.client.generate_json(prompt, temperature=0.3, num_predict=900)

    # ------------------------------------------------------------------
    # Course recommendations
    # ------------------------------------------------------------------
    def recommend_courses(self, skills=None, interests=None, target_role=None,
                           completed_courses=None, num_courses=6):
        skills = skills or []
        interests = interests or []
        completed_courses = completed_courses or []

        prompt = f"""You are a career-guidance assistant for a student/placement-prep platform.

Student profile:
- Current skills: {", ".join(skills) if skills else "not specified"}
- Interests: {", ".join(interests) if interests else "not specified"}
- Target role: {target_role or "infer a sensible one from skills/interests"}
- Already completed: {", ".join(completed_courses) if completed_courses else "none"}

Recommend exactly {num_courses} courses to help this student close their
skill gaps and reach their target role, ordered by priority (most
important first). Don't repeat anything already completed.

Return ONLY this JSON structure, nothing else:
{{
  "courses": [
    {{
      "title": "<course title>",
      "tag": "<short category like Python, DSA, SQL, AI/ML, Cloud, Frontend, Backend, Aptitude>",
      "level": "Beginner" | "Intermediate" | "Advanced",
      "description": "<1-2 sentence description>",
      "estimated_hours": <integer>,
      "matched_skills": ["skill1", "skill2"],
      "why_recommended": "<1 sentence tied directly to this student's profile>"
    }}
  ]
}}"""
        return self.client.generate_json(prompt, temperature=0.5, num_predict=1400)

    # ------------------------------------------------------------------
    # Course content - structured like a GeeksforGeeks tutorial page:
    # explanation -> syntax -> example -> output -> key points -> practice
    # ------------------------------------------------------------------
    def generate_course_content(self, course_title, level="Intermediate", tag=None):
        context_line = f"Category: {tag}" if tag else ""

        prompt = f"""You are a curriculum writer creating tutorial-style course content,
in the style of a GeeksforGeeks article: a short explanation, a syntax
block, a runnable code example, its expected output, then key takeaways
and a practice prompt.

Course title: {course_title}
Level: {level}
{context_line}

Return ONLY this JSON structure, nothing else:
{{
  "course_title": "{course_title}",
  "level": "{level}",
  "estimated_hours": <integer>,
  "modules": [
    {{
      "module_title": "<module name>",
      "lessons": [
        {{
          "lesson_title": "<lesson name>",
          "explanation": "<100-150 word plain-language explanation of the concept>",
          "syntax": "<code syntax block if applicable, else empty string>",
          "example_code": "<a short runnable code example demonstrating the concept>",
          "example_output": "<the expected output of that code, else empty string>",
          "key_points": ["short takeaway", "short takeaway", "short takeaway"],
          "practice_prompt": "<one practice question/exercise for the student to try>"
        }}
      ]
    }}
  ]
}}

Include 3-4 modules, each with 2-3 lessons. Order modules from
foundational to advanced. Use real, working code in "syntax" and
"example_code" (use the most relevant language for {course_title}, e.g.
Python/Java/SQL/JS as appropriate) - not pseudocode."""
        return self.client.generate_json(prompt, temperature=0.4, num_predict=3000)

    # ------------------------------------------------------------------
    # Assessment + rewards
    # ------------------------------------------------------------------
    def generate_assessment(self, course_title, level="Intermediate", num_questions=5):
        prompt = f"""You are creating a graded multiple-choice assessment for a student who
just finished a course.

Course title: {course_title}
Level: {level}
Number of questions: {num_questions}

Return ONLY this JSON structure, nothing else:
{{
  "course_title": "{course_title}",
  "passing_score": 70,
  "questions": [
    {{
      "id": "q1",
      "prompt": "<question text>",
      "options": [
        {{"id": "a", "text": "<option>"}},
        {{"id": "b", "text": "<option>"}},
        {{"id": "c", "text": "<option>"}},
        {{"id": "d", "text": "<option>"}}
      ],
      "correct_option_id": "a",
      "explanation": "<1 sentence on why this is correct>"
    }}
  ],
  "reward": {{
    "badge_name": "<short motivating badge title for passing>",
    "xp_points": <integer 50-200, higher for Advanced level>,
    "certificate_line": "<one sentence a student could put on a resume after passing>"
  }}
}}

Generate exactly {num_questions} questions, each with exactly 4 options
and exactly one correct answer, testing real understanding of
{course_title} at {level} level - not trivia."""
        return self.client.generate_json(prompt, temperature=0.5, num_predict=1800)