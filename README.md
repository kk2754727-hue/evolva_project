# Evolva — Combined Project

This combines your three pieces into one working app:

- `frontend/` — your existing React/Vite UI, plus a new camera-based
  interview page
- `backend/` — a Flask API that wires the real logic from `Mock_interview`
  into the frontend

## What's actually wired up

| Feature | Status |
|---|---|
| Mock interview Q&A scoring (text mode) | **Real** — uses your `GeminiEvaluator` at `POST /api/interview/evaluate` |
| Resume analysis | **Real, newly built** — PDF/DOCX text extraction + Gemini scoring at `POST /api/resume/analyze` |
| Camera mode: eye contact, head pose, body language | **Real** — reuses the actual mediapipe detectors from `Mock_interview/computer_vision/`, adapted to score individual browser-captured frames instead of a local `cv2.VideoCapture` loop. `POST /api/interview/analyze-frame` |
| Speech fluency (words/min, filler words) | **Real** — ported from `speech_analysis/filler_detection.py` + `speaking_speed.py`, but fed by a live browser transcript (Web Speech API) + timing instead of an offline Whisper pass over a recorded file |
| Grammar | Covered by Gemini's `grammar_score` in the evaluate response — no separate grammar checker needed |

### Camera Mode — how it actually works

Go to Mock Interview → "Try Camera Mode" (or `/mock-interview/camera`).

1. Browser asks for camera permission and shows a live preview.
2. Click "Start Answering" — this starts:
   - **Speech-to-text** via the browser's built-in `SpeechRecognition` (Chrome/Edge only; other browsers fall back to a manual textarea — camera scoring still works either way)
   - **Frame capture**, every 2 seconds, sent to `/api/interview/analyze-frame` for real eye-contact/head-pose/body-language scores
   - A 90-second countdown (auto-submits at 0, same as the original desktop script's `QUESTION_TIME`)
3. Click "Stop & Submit" (or let the timer run out) — the transcript + how long you spoke goes to Gemini for content/grammar/fluency scoring, and the camera scores collected during that window are averaged.
4. You get one combined report per question: Content, Eye Contact, Body Language, Fluency — plus a session summary at the end.

**Important dependency note:** `mediapipe`'s legacy `solutions` API (used by
the original `eye_contact.py`, `head_pose.py`, etc.) is only available for
Python ≤3.12 with `mediapipe==0.10.14` specifically — newer mediapipe
releases dropped it in favor of a different API. The pinned version in
`requirements.txt` is deliberate; don't `pip install -U mediapipe`.

## Running it

### Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt
cp .env.example .env
# edit .env and put your real GEMINI_API_KEY in it
python3 app.py
```

Runs on `http://localhost:5000`. Check `GET /api/health` — it reports
whether your Gemini key is picked up.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on the usual Vite dev port. It calls the backend at
`http://localhost:5000` by default — override with a `.env` file
containing `VITE_API_URL=http://your-backend-host:5000` if needed.

Camera mode needs the page served over `http://localhost` or `https://`
(browsers block camera/mic access on plain HTTP from a non-localhost
address) — the Vite dev server on localhost is fine.

## API reference

**POST `/api/interview/evaluate`**
```json
{ "question": "What is Python?", "answer": "...", "duration_seconds": 42 }
```
`duration_seconds` is optional (only sent by camera mode) — when present, the response includes a `fluency` object.

→ `{ technical_score, communication_score, grammar_score, confidence_score, overall_score, strengths[], weaknesses[], suggestions[], fluency? }`

**POST `/api/interview/analyze-frame`**
```json
{ "image": "data:image/jpeg;base64,..." }
```
→ `{ eye_score, eye_status, head_score, head_status, body_score, cv_score }`

**POST `/api/resume/analyze`** (multipart/form-data)
- `resume`: the PDF or DOCX file
- `target_role` (optional): e.g. `"Python Developer"`

→ `{ ats_score, formatting_score, keyword_score, detected_skills[], missing_keywords[], strengths[], improvements[] }`

All endpoints return `{ "error": "..." }` with a 4xx/5xx status on failure
(missing key, bad file type, unreadable frame, etc.) — the frontend already
handles these inline.

