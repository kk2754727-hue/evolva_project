"""
Evolva backend API.

Combines:
- Interview answer scoring (reuses the real GeminiEvaluator from the
  Mock_interview project's ai/gemini_evaluator.py)
- Resume analysis (PDF/DOCX text extraction + Gemini scoring)
- Camera-based analysis (eye contact, head pose, body language) - reuses
  the real mediapipe-based detectors from Mock_interview's
  computer_vision/ package, adapted to score individual frames sent from
  the browser instead of a local OpenCV webcam loop
- Speech fluency analysis (words-per-minute + filler word detection) -
  reuses the logic from Mock_interview's speech_analysis/ module, fed by
  a transcript the browser produces via the Web Speech API instead of
  the original offline Whisper pipeline
"""

import os
import base64

import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

from ai.gemini_evaluator import GeminiEvaluator, GeminiNotConfiguredError
from resume.extractor import extract_text, UnsupportedFileTypeError
from computer_vision.computerVisionEngine import ComputerVisionEngine
from speech.analysis import analyze_speech

app = Flask(__name__)
CORS(app)  # allow the Vite dev server (different port) to call this API

evaluator = GeminiEvaluator()
cv_engine = ComputerVisionEngine()

MAX_UPLOAD_MB = 5
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_MB * 1024 * 1024


@app.get("/api/health")
def health():
    return jsonify({
        "status": "ok",
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY")),
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
    except GeminiNotConfiguredError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Evaluation failed: {e}"}), 500

    if "raw_response" in result:
        return jsonify({"error": "Model returned an unexpected format.", "raw": result["raw_response"]}), 502

    # Fluency is computed quantitatively (word count + timing + filler
    # words), not by Gemini, so it's added on separately when the client
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
    except GeminiNotConfiguredError as e:
        return jsonify({"error": str(e)}), 503
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {e}"}), 500

    if "raw_response" in result:
        return jsonify({"error": "Model returned an unexpected format.", "raw": result["raw_response"]}), 502

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=5000)

