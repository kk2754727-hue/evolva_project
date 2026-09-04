"""
Evolva Backend API — with full SQLite student data storage

Every AI result is automatically saved to the student's database record.
New endpoints expose profile, resume history, course progress,
interview history, and skill scores for the frontend.
"""

import base64
import json
import os

import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from ai.gemini_evaluator import GeminiEvaluator, GeminiNotConfiguredError
from resume.extractor import extract_text, UnsupportedFileTypeError
from computer_vision.computerVisionEngine import ComputerVisionEngine
from speech.analysis import analyze_speech
from auth.auth_handler import register_user, login_user
from auth.otp_auth import create_and_send_otp, verify_otp
from auth.user_db import (
    get_user_by_email, update_user_profile,
    save_resume_result, get_resume_history, get_latest_resume,
    upsert_course_progress, get_course_progress, get_completed_courses,
    save_interview_result, get_interview_history,
    upsert_skill_score, get_skill_scores,
    get_student_summary,
)

app = Flask(__name__)
CORS(app)

evaluator = GeminiEvaluator()
cv_engine = ComputerVisionEngine()

app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024


# ── helpers ───────────────────────────────────────────────────────────────────
def get_uid():
    """Extract user_id from request header X-User-Id (set by frontend on login)."""
    try:
        return int(request.headers.get("X-User-Id", 0)) or None
    except (TypeError, ValueError):
        return None


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return jsonify({
        "status": "ok",
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY")),
    })


# ── Register ──────────────────────────────────────────────────────────────────
@app.post("/api/auth/register")
def register():
    data = request.get_json(silent=True) or {}
    ok, message = register_user(
        full_name   = data.get("full_name",   "").strip(),
        email       = data.get("email",       "").strip(),
        password    = data.get("password",    "").strip(),
        college     = data.get("college",     "").strip(),
        year        = data.get("year",        "").strip(),
        branch      = data.get("branch",      "").strip(),
        target_role = data.get("target_role", "").strip(),
        phone       = data.get("phone",       "").strip(),
    )
    if ok:
        return jsonify({"success": True, "message": message})
    return jsonify({"success": False, "error": message}), 400


# ── Login ─────────────────────────────────────────────────────────────────────
@app.post("/api/auth/login")
def login():
    data     = request.get_json(silent=True) or {}
    ok, message, user = login_user(
        data.get("email", "").strip(),
        data.get("password", "").strip(),
    )
    if ok:
        return jsonify({"success": True, "message": message, "user": user})
    return jsonify({"success": False, "error": message}), 401


# ── OTP ───────────────────────────────────────────────────────────────────────
@app.post("/api/auth/send-otp")
def send_otp():
    data  = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    if not email:
        return jsonify({"error": "Email is required."}), 400
    try:
        create_and_send_otp(email)
        return jsonify({"message": f"OTP sent to {email}."})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Failed to send OTP: {e}"}), 500


@app.post("/api/auth/verify-otp")
def verify_otp_route():
    data  = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    otp   = (data.get("otp")   or "").strip()
    if not email or not otp:
        return jsonify({"error": "Email and OTP are required."}), 400
    ok, message = verify_otp(email, otp)
    if ok:
        return jsonify({"success": True, "message": message, "email": email})
    return jsonify({"success": False, "error": message}), 401


# ── Student profile ───────────────────────────────────────────────────────────
@app.get("/api/student/profile")
def get_profile():
    uid = get_uid()
    if not uid:
        return jsonify({"error": "X-User-Id header required."}), 401
    summary = get_student_summary(uid)
    if not summary:
        return jsonify({"error": "User not found."}), 404
    return jsonify(summary)


@app.put("/api/student/profile")
def update_profile():
    uid = get_uid()
    if not uid:
        return jsonify({"error": "X-User-Id header required."}), 401
    data = request.get_json(silent=True) or {}
    allowed = {"full_name","college","year","branch","target_role","phone","bio","linkedin","github"}
    fields  = {k: v for k, v in data.items() if k in allowed}
    update_user_profile(uid, **fields)
    user = get_user_by_id(uid)
    safe = {k: v for k, v in user.items() if k != "password_hash"}
    return jsonify({"success": True, "user": safe})


# ── Resume history ─────────────────────────────────────────────────────────────
@app.get("/api/student/resume-history")
def resume_history():
    uid = get_uid()
    if not uid:
        return jsonify({"error": "X-User-Id header required."}), 401
    return jsonify(get_resume_history(uid))


# ── Course progress ────────────────────────────────────────────────────────────
@app.get("/api/student/course-progress")
def course_progress():
    uid = get_uid()
    if not uid:
        return jsonify({"error": "X-User-Id header required."}), 401
    return jsonify(get_course_progress(uid))


@app.post("/api/student/course-progress")
def save_course_progress():
    uid = get_uid()
    if not uid:
        return jsonify({"error": "X-User-Id header required."}), 401
    data = request.get_json(silent=True) or {}
    upsert_course_progress(
        user_id          = uid,
        course_tag       = data.get("course_tag", ""),
        course_title     = data.get("course_title", ""),
        status           = data.get("status", "started"),
        progress_pct     = data.get("progress_pct", 0),
        assessment_score = data.get("assessment_score", 0),
        badge_earned     = data.get("badge_earned", ""),
        xp_earned        = data.get("xp_earned", 0),
    )
    return jsonify({"success": True})


# ── Interview history ──────────────────────────────────────────────────────────
@app.get("/api/student/interview-history")
def interview_history():
    uid = get_uid()
    if not uid:
        return jsonify({"error": "X-User-Id header required."}), 401
    return jsonify(get_interview_history(uid))


# ── Skill scores ───────────────────────────────────────────────────────────────
@app.get("/api/student/skills")
def student_skills():
    uid = get_uid()
    if not uid:
        return jsonify({"error": "X-User-Id header required."}), 401
    return jsonify(get_skill_scores(uid))


@app.post("/api/student/skills")
def save_skill_scores():
    uid = get_uid()
    if not uid:
        return jsonify({"error": "X-User-Id header required."}), 401
    data   = request.get_json(silent=True) or {}
    skills = data.get("skills", [])   # [{name, score}, ...]
    for s in skills:
        if s.get("name") and s.get("score") is not None:
            upsert_skill_score(uid, s["name"], int(s["score"]))
    return jsonify({"success": True})


# ── Mock Interview ─────────────────────────────────────────────────────────────
@app.post("/api/interview/evaluate")
def evaluate_answer():
    data     = request.get_json(silent=True) or {}
    question = (data.get("question") or "").strip()
    answer   = (data.get("answer")   or "").strip()
    duration = data.get("duration_seconds")
    if not question or not answer:
        return jsonify({"error": "Both 'question' and 'answer' are required."}), 400
    try:
        result = evaluator.evaluate(question, answer)
    except GeminiNotConfiguredError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Evaluation failed: {e}"}), 500
    if "raw_response" in result:
        return jsonify({"error": "Model returned unexpected format.", "raw": result["raw_response"]}), 502
    if duration:
        try:
            result["fluency"] = analyze_speech(answer, float(duration))
        except (TypeError, ValueError):
            pass
    return jsonify(result)


@app.post("/api/interview/save-session")
def save_interview_session():
    """Save a completed interview session to the student's history."""
    uid = get_uid()
    if not uid:
        return jsonify({"error": "X-User-Id header required."}), 401
    data = request.get_json(silent=True) or {}
    save_interview_result(
        user_id = uid,
        track   = data.get("track", "General"),
        mode    = data.get("mode", "text"),
        scores  = data.get("scores", {}),
    )
    return jsonify({"success": True})


# ── Camera Frame Analysis ──────────────────────────────────────────────────────
@app.post("/api/interview/analyze-frame")
def analyze_frame():
    data       = request.get_json(silent=True) or {}
    image_data = data.get("image")
    if not image_data:
        return jsonify({"error": "No 'image' field provided."}), 400
    try:
        if "," in image_data:
            image_data = image_data.split(",", 1)[1]
        np_array = np.frombuffer(base64.b64decode(image_data), dtype=np.uint8)
        frame    = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        if frame is None:
            raise ValueError("Could not decode image")
    except Exception as e:
        return jsonify({"error": f"Invalid image data: {e}"}), 400
    try:
        _, scores = cv_engine.process(frame)
    except Exception as e:
        return jsonify({"error": f"Frame analysis failed: {e}"}), 500
    return jsonify(scores)


# ── Resume Analyzer ────────────────────────────────────────────────────────────
@app.post("/api/resume/analyze")
def analyze_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded."}), 400
    file = request.files["resume"]
    if not file.filename:
        return jsonify({"error": "Empty filename."}), 400
    target_role = request.form.get("target_role")
    try:
        text = extract_text(file.stream, file.filename)
    except UnsupportedFileTypeError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Could not read file: {e}"}), 400
    if len(text) < 30:
        return jsonify({"error": "Couldn't extract text. Try a text-based PDF export."}), 422
    try:
        result = evaluator.analyze_resume(text, target_role)
    except GeminiNotConfiguredError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {e}"}), 500
    if "raw_response" in result:
        return jsonify({"error": "Model returned unexpected format.", "raw": result["raw_response"]}), 502

    # Auto-save to student's resume history if logged in
    uid = get_uid()
    if uid:
        try:
            save_resume_result(uid, file.filename, target_role, result)
        except Exception:
            pass  # don't fail the response if save fails

    return jsonify(result)


# ── Course Recommendations ─────────────────────────────────────────────────────
@app.post("/api/courses/recommend")
def recommend_courses():
    data = request.get_json(silent=True) or {}
    if not data.get("skills") and not data.get("interests") and not data.get("target_role"):
        return jsonify({"error": "Provide skills, interests, or target_role."}), 400
    try:
        result = evaluator.recommend_courses(
            skills            = data.get("skills") or [],
            interests         = data.get("interests") or [],
            target_role       = data.get("target_role"),
            completed_courses = data.get("completed_courses") or [],
            num_courses       = data.get("num_courses", 6),
        )
    except GeminiNotConfiguredError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Recommendation failed: {e}"}), 500
    if "raw_response" in result:
        return jsonify({"error": "Model returned unexpected format.", "raw": result["raw_response"]}), 502
    return jsonify(result)


# ── Course Content ─────────────────────────────────────────────────────────────
@app.post("/api/courses/generate-content")
def generate_course_content():
    data         = request.get_json(silent=True) or {}
    course_title = (data.get("course_title") or "").strip()
    if not course_title:
        return jsonify({"error": "'course_title' is required."}), 400

    # Auto-mark course as started in DB
    uid = get_uid()
    if uid and data.get("course_tag"):
        try:
            upsert_course_progress(uid, data["course_tag"], course_title, status="started", progress_pct=10)
        except Exception:
            pass

    try:
        result = evaluator.generate_course_content(
            course_title, data.get("level", "Intermediate"), data.get("tag")
        )
    except GeminiNotConfiguredError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Content generation failed: {e}"}), 500
    if "raw_response" in result:
        return jsonify({"error": "Model returned unexpected format.", "raw": result["raw_response"]}), 502
    return jsonify(result)


# ── Course Assessment ──────────────────────────────────────────────────────────
@app.post("/api/courses/generate-assessment")
def generate_assessment():
    data         = request.get_json(silent=True) or {}
    course_title = (data.get("course_title") or "").strip()
    if not course_title:
        return jsonify({"error": "'course_title' is required."}), 400
    try:
        num_q = max(3, min(10, int(data.get("num_questions", 5))))
    except (TypeError, ValueError):
        num_q = 5
    try:
        result = evaluator.generate_assessment(
            course_title, data.get("level", "Intermediate"), num_q
        )
    except GeminiNotConfiguredError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Assessment generation failed: {e}"}), 500
    if "raw_response" in result:
        return jsonify({"error": "Model returned unexpected format.", "raw": result["raw_response"]}), 502
    return jsonify(result)


@app.post("/api/courses/complete-assessment")
def complete_assessment():
    """Called when a student passes an assessment — saves badge + XP."""
    uid = get_uid()
    if not uid:
        return jsonify({"error": "X-User-Id header required."}), 401
    data = request.get_json(silent=True) or {}
    upsert_course_progress(
        user_id          = uid,
        course_tag       = data.get("course_tag", ""),
        course_title     = data.get("course_title", ""),
        status           = "completed",
        progress_pct     = 100,
        assessment_score = data.get("score", 0),
        badge_earned     = data.get("badge_name", ""),
        xp_earned        = data.get("xp_points", 0),
    )
    return jsonify({"success": True})


# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, port=5000)