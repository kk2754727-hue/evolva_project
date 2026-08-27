"""
Evolva backend API.

Combines:
- Interview answer scoring (LLM-based, via a local Ollama model - no
  cloud API, no API key)
- Resume analysis (PDF/DOCX text extraction + local LLM scoring)
- Skill gap analysis (local LLM compares current skills to a target role)
- Course recommendations, GFG-style course content generation, and
  graded assessments with rewards - all via the local LLM
- Camera-based analysis (eye contact, head pose, body language) - reuses
  the real mediapipe-based detectors from Mock_interview's
  computer_vision/ package, adapted to score individual frames sent from
  the browser instead of a local OpenCV webcam loop
- Speech fluency analysis (words-per-minute + filler word detection) -
  reuses the logic from Mock_interview's speech_analysis/ module, fed by
  a transcript the browser produces via the Web Speech API instead of
  the original offline Whisper pipeline

All AI features run through ai/llm_evaluator.py -> ai/ollama_client.py,
which talks to a locally-running Ollama server (http://localhost:11434
by default). Nothing in this file makes an external network call for AI
inference.
"""

import base64

import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

from ai.llm_evaluator import LLMEvaluator, OllamaNotAvailableError
from resume.extractor import extract_text, UnsupportedFileTypeError
from computer_vision.computerVisionEngine import ComputerVisionEngine
from speech.analysis import analyze_speech

app = Flask(__name__)
CORS(app)  # allow the Vite dev server (different port) to call this API

evaluator = LLMEvaluator()
cv_engine = ComputerVisionEngine()

MAX_UPLOAD_MB = 5
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_MB * 1024 * 1024


@app.get("/api/health")
def health():
    status = evaluator.client.is_ready()
    return jsonify({
        "status": "ok",
        "ollama_running": status["ollama_running"],
        "model_pulled": status["model_pulled"],
        "model": evaluator.client.model,
        "available_models": status["models"],
    })


@app.post("/api/interview/evaluate")
def evaluate_answer():
    data = request.get_json(silent=True) or {}
    question = (data.get("question") or "").strip()
    answer = (data.get("answer") or "").strip()
    duration_seconds = data.get("duration_seconds")

    if not question or not answer:
        return jsonify({"error": "Both 'question' and 'answer' are required."}), 400

    try:
        result = evaluator.evaluate(question, answer)
    except OllamaNotAvailableError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Evaluation failed: {e}"}), 500

    if "raw_response" in result:
        return jsonify({"error": "Model returned an unexpected format.", "raw": result["raw_response"]}), 502

    # Fluency is computed quantitatively (word count + timing + filler
    # words), not by the LLM, so it's added on separately when the client
    # (camera/speech mode) provides how long the answer took to speak.
    if duration_seconds:
        try:
            result["fluency"] = analyze_speech(answer, float(duration_seconds))
        except (TypeError, ValueError):
            pass

    return jsonify(result)


@app.post("/api/interview/analyze-frame")
def analyze_frame():
    """
    Accepts a single webcam frame captured in the browser and returns
    eye-contact / head-pose / body-language scores for that frame.
    Intended to be called every 1-2 seconds while the camera is on; the
    client averages the scores across a question itself.
    """
    data = request.get_json(silent=True) or {}
    image_data = data.get("image")

    if not image_data:
        return jsonify({"error": "No 'image' field provided."}), 400

    try:
        if "," in image_data:  # strip "data:image/jpeg;base64," prefix if present
            image_data = image_data.split(",", 1)[1]
        image_bytes = base64.b64decode(image_data)
        np_array = np.frombuffer(image_bytes, dtype=np.uint8)
        frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        if frame is None:
            raise ValueError("Could not decode image")
    except Exception as e:
        return jsonify({"error": f"Invalid image data: {e}"}), 400

    try:
        _, scores = cv_engine.process(frame)
    except Exception as e:
        return jsonify({"error": f"Frame analysis failed: {e}"}), 500

    return jsonify(scores)


@app.post("/api/resume/analyze")
def analyze_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded. Expected multipart field 'resume'."}), 400

    file = request.files["resume"]
    if file.filename == "":
        return jsonify({"error": "Empty filename."}), 400

    target_role = request.form.get("target_role")

    try:
        text = extract_text(file.stream, file.filename)
    except UnsupportedFileTypeError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Could not read file: {e}"}), 400

    if len(text) < 30:
        return jsonify({"error": "Couldn't extract meaningful text from this file. If it's a scanned/image-based PDF, try a text-based export instead."}), 422

    try:
        result = evaluator.analyze_resume(text, target_role)
    except OllamaNotAvailableError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {e}"}), 500

    if "raw_response" in result:
        return jsonify({"error": "Model returned an unexpected format.", "raw": result["raw_response"]}), 502

    return jsonify(result)


@app.post("/api/skills/analyze-gap")
def analyze_skill_gap():
    data = request.get_json(silent=True) or {}
    current_skills = data.get("current_skills") or []
    target_role = data.get("target_role")

    if not current_skills:
        return jsonify({"error": "'current_skills' (list of {name, pct}) is required."}), 400

    try:
        result = evaluator.analyze_skill_gap(current_skills, target_role)
    except OllamaNotAvailableError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Skill gap analysis failed: {e}"}), 500

    if "raw_response" in result:
        return jsonify({"error": "Model returned an unexpected format.", "raw": result["raw_response"]}), 502

    return jsonify(result)


@app.post("/api/courses/recommend")
def recommend_courses():
    data = request.get_json(silent=True) or {}
    skills = data.get("skills") or []
    interests = data.get("interests") or []
    target_role = data.get("target_role")
    completed_courses = data.get("completed_courses") or []
    num_courses = data.get("num_courses", 6)

    if not skills and not interests and not target_role:
        return jsonify({"error": "Provide at least one of 'skills', 'interests', or 'target_role'."}), 400

    try:
        result = evaluator.recommend_courses(
            skills=skills,
            interests=interests,
            target_role=target_role,
            completed_courses=completed_courses,
            num_courses=num_courses,
        )
    except OllamaNotAvailableError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Recommendation failed: {e}"}), 500

    if "raw_response" in result:
        return jsonify({"error": "Model returned an unexpected format.", "raw": result["raw_response"]}), 502

    return jsonify(result)


@app.post("/api/courses/generate-content")
def generate_course_content():
    data = request.get_json(silent=True) or {}
    course_title = (data.get("course_title") or "").strip()
    level = data.get("level") or "Intermediate"
    tag = data.get("tag")

    if not course_title:
        return jsonify({"error": "'course_title' is required."}), 400

    try:
        result = evaluator.generate_course_content(course_title, level, tag)
    except OllamaNotAvailableError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Content generation failed: {e}"}), 500

    if "raw_response" in result:
        return jsonify({"error": "Model returned an unexpected format.", "raw": result["raw_response"]}), 502

    return jsonify(result)


@app.post("/api/courses/generate-assessment")
def generate_assessment():
    data = request.get_json(silent=True) or {}
    course_title = (data.get("course_title") or "").strip()
    level = data.get("level") or "Intermediate"
    num_questions = data.get("num_questions", 5)

    if not course_title:
        return jsonify({"error": "'course_title' is required."}), 400

    try:
        num_questions = max(3, min(10, int(num_questions)))
    except (TypeError, ValueError):
        num_questions = 5

    try:
        result = evaluator.generate_assessment(course_title, level, num_questions)
    except OllamaNotAvailableError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Assessment generation failed: {e}"}), 500

    if "raw_response" in result:
        return jsonify({"error": "Model returned an unexpected format.", "raw": result["raw_response"]}), 502

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=5000)