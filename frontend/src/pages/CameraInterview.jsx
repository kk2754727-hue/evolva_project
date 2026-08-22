import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Video, VideoOff, Mic, Send, Award, Loader2, AlertTriangle,
  Eye, Activity, MessageSquare, Gauge,
} from "lucide-react";
import { C } from "../lib/theme";
import { INTERVIEW_TRACKS } from "../data/mock";
import { evaluateAnswer, analyzeFrame } from "../lib/api";

const FRAME_INTERVAL_MS = 2000;
const QUESTION_TIME_LIMIT = 90; // seconds, matches the original desktop app's per-question timer

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

function average(nums) {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export default function CameraInterview() {
  const [track, setTrack] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [finished, setFinished] = useState(false);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const [recording, setRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [transcript, setTranscript] = useState("");
  const [liveCvScore, setLiveCvScore] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [questionResults, setQuestionResults] = useState([]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const frameTimerRef = useRef(null);
  const countdownRef = useRef(null);
  const startTimeRef = useRef(null);
  const frameScoresRef = useRef([]);
  const finalTranscriptRef = useRef("");

  // ---- Camera lifecycle ----
  useEffect(() => {
    if (!track) return;
    let cancelled = false;

    navigator.mediaDevices
      ?.getUserMedia({ video: { width: 640, height: 480 }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraReady(true);
      })
      .catch((err) => {
        setCameraError(
          err.name === "NotAllowedError"
            ? "Camera access was denied. Allow camera permission in your browser to use camera mode."
            : `Couldn't access your camera: ${err.message}`
        );
      });

    return () => {
      cancelled = true;
      stopEverything();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track]);

  const stopEverything = useCallback(() => {
    if (frameTimerRef.current) clearInterval(frameTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    frameTimerRef.current = null;
    countdownRef.current = null;
    try {
      recognitionRef.current?.stop();
    } catch {
      /* already stopped */
    }
  }, []);

  const captureFrame = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.6);

    try {
      const scores = await analyzeFrame(dataUrl);
      if (typeof scores.cv_score === "number") {
        frameScoresRef.current.push(scores);
        setLiveCvScore(scores);
      }
    } catch {
      // A single dropped frame shouldn't interrupt the session
    }
  }, []);

  const startRecording = () => {
    setError(null);
    setFeedback(null);
    setTranscript("");
    finalTranscriptRef.current = "";
    frameScoresRef.current = [];
    setLiveCvScore(null);
    setTimeLeft(QUESTION_TIME_LIMIT);
    startTimeRef.current = Date.now();
    setRecording(true);

    // Speech-to-text (optional - browser support varies)
    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let interim = "";
        let final = finalTranscriptRef.current;
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) final += text + " ";
          else interim += text;
        }
        finalTranscriptRef.current = final;
        setTranscript(final + interim);
      };
      recognition.onerror = () => {
        /* mic hiccups shouldn't kill the session - user can still type/edit below */
      };
      recognition.start();
      recognitionRef.current = recognition;
    }

    // Periodic frame capture for eye contact / posture scoring
    frameTimerRef.current = setInterval(captureFrame, FRAME_INTERVAL_MS);

    // Countdown timer, auto-submits at 0 like the original desktop app
    countdownRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (recording && timeLeft === 0) {
      submitAnswer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, recording]);

  const submitAnswer = async () => {
    if (submitting) return;
    stopEverything();
    setRecording(false);

    const durationSeconds = Math.max(1, (Date.now() - startTimeRef.current) / 1000);
    const answerText = (finalTranscriptRef.current || transcript).trim();

    if (!answerText) {
      setError("No answer was captured. Speak clearly, or type your answer below before submitting.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const cvScores = frameScoresRef.current;
      const cvSummary = {
        eye_score: average(cvScores.map((s) => s.eye_score || 0)),
        head_score: average(cvScores.map((s) => s.head_score || 0)),
        body_score: average(cvScores.map((s) => s.body_score || 0)),
        cv_score: average(cvScores.map((s) => s.cv_score || 0)),
        samples: cvScores.length,
      };

      const result = await evaluateAnswer(track.qs[qIdx], answerText, durationSeconds);

      const combined = { ...result, cv: cvSummary };
      setFeedback(combined);
      setQuestionResults((r) => [...r, combined]);
    } catch (err) {
      setError(err.message || "Something went wrong while scoring your answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const start = (t) => {
    setTrack(t);
    setQIdx(0);
    setFinished(false);
    setFeedback(null);
    setQuestionResults([]);
    setError(null);
    setCameraReady(false);
    setCameraError(null);
  };

  const next = () => {
    if (qIdx + 1 >= track.qs.length) {
      stopEverything();
      setFinished(true);
    } else {
      setQIdx(qIdx + 1);
      setFeedback(null);
      setTranscript("");
      setLiveCvScore(null);
      setError(null);
    }
  };

  const backToTracks = () => {
    stopEverything();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setTrack(null);
  };

  // ---- Track selection screen ----
  if (!track) {
    return (
      <div className="p-8">
        <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>
          Camera Mock Interview
        </h1>
        <p className="text-sm mb-6" style={{ color: C.muted }}>
          Full AI interview session — your webcam checks eye contact & body language,
          your voice is transcribed live, and Gemini scores your answer's content, grammar, and fluency.
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          {INTERVIEW_TRACKS.map((t) => (
            <div key={t.id} className="rounded-2xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${t.color}22` }}>
                <t.icon size={20} color={t.color} />
              </div>
              <h3 className="font-display font-bold text-base mb-1" style={{ color: C.text }}>{t.title}</h3>
              <p className="text-xs mb-5" style={{ color: C.muted }}>{t.desc}</p>
              <button onClick={() => start(t)} className="text-xs font-semibold text-white px-4 py-2.5 rounded-xl flex items-center gap-2" style={{ background: t.color }}>
                <Video size={14} /> Start Camera Session
              </button>
            </div>
          ))}
        </div>
        {!SpeechRecognitionAPI && (
          <div className="mt-6 flex items-start gap-2 text-xs p-3 rounded-lg max-w-2xl" style={{ background: "#2b2013", color: "#f2c98b" }}>
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            Your browser doesn't support live speech-to-text (this works best in Chrome or Edge). Camera scoring will still work — you'll just need to type your answer manually.
          </div>
        )}
      </div>
    );
  }

  // ---- Final summary screen ----
  if (finished) {
    const contentAvg = average(questionResults.map((r) => r.overall_score || 0));
    const cvAvg = average(questionResults.map((r) => r.cv?.cv_score || 0));
    const fluencyAvg = average(questionResults.map((r) => r.fluency?.fluency_score || 0));
    const overall = average([contentAvg, cvAvg, fluencyAvg].filter((n) => n > 0));

    return (
      <div className="p-8 max-w-xl">
        <div className="rounded-2xl p-8 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <Award size={36} color={C.amber} className="mx-auto mb-4" />
          <h2 className="font-display font-extrabold text-xl mb-1" style={{ color: C.text }}>
            {track.title} — Camera Session Complete
          </h2>
          <p className="text-sm mb-6" style={{ color: C.muted }}>
            Here's how you did across {questionResults.length} questions.
          </p>
          <p className="font-display font-extrabold text-5xl mb-1" style={{ color: C.green }}>{overall}%</p>
          <p className="text-xs mb-6" style={{ color: C.muted }}>Overall composite score</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-xl p-3" style={{ background: "#1c2438" }}>
              <p className="text-lg font-display font-extrabold" style={{ color: C.text }}>{contentAvg}</p>
              <p className="text-[10px]" style={{ color: C.muted }}>Content & Grammar</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: "#1c2438" }}>
              <p className="text-lg font-display font-extrabold" style={{ color: C.text }}>{cvAvg}</p>
              <p className="text-[10px]" style={{ color: C.muted }}>Eye Contact & Body</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: "#1c2438" }}>
              <p className="text-lg font-display font-extrabold" style={{ color: C.text }}>{fluencyAvg}</p>
              <p className="text-[10px]" style={{ color: C.muted }}>Fluency</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={() => start(track)} className="text-xs font-semibold px-4 py-2.5 rounded-xl" style={{ background: "#1c2438", color: C.text }}>
              Retry Track
            </button>
            <button onClick={backToTracks} className="text-xs font-semibold text-white px-4 py-2.5 rounded-xl" style={{ background: C.blue2 }}>
              Back to Tracks
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Active question screen ----
  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display font-extrabold text-xl" style={{ color: C.text }}>{track.title}</h1>
        <span className="text-xs font-semibold" style={{ color: C.muted }}>
          Question {qIdx + 1} of {track.qs.length}
        </span>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-5">
        {/* Camera panel */}
        <div className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="relative rounded-xl overflow-hidden" style={{ background: "#000", aspectRatio: "4/3" }}>
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
            <canvas ref={canvasRef} className="hidden" />
            {!cameraReady && !cameraError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin" color={C.muted} />
              </div>
            )}
            {recording && (
              <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-semibold text-white" style={{ background: "#c0392b" }}>
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> REC · {timeLeft}s
              </div>
            )}
            {liveCvScore && recording && (
              <div className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white" style={{ background: "rgba(0,0,0,0.6)" }}>
                Eye {liveCvScore.eye_score} · Head {liveCvScore.head_score} · Body {liveCvScore.body_score}
              </div>
            )}
          </div>

          {cameraError && (
            <div className="mt-3 flex items-start gap-2 text-xs p-3 rounded-lg" style={{ background: "#2b1313", color: "#f28b8b" }}>
              <VideoOff size={14} className="mt-0.5 shrink-0" /> {cameraError}
            </div>
          )}

          {liveCvScore?.eye_status && recording && (
            <div className="flex gap-3 mt-3 text-[11px]" style={{ color: C.muted }}>
              <span className="flex items-center gap-1"><Eye size={12} /> {liveCvScore.eye_status}</span>
              <span className="flex items-center gap-1"><Activity size={12} /> {liveCvScore.head_status}</span>
            </div>
          )}
        </div>

        {/* Question + transcript + feedback panel */}
        <div className="rounded-2xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2 mb-4">
            <Mic size={15} color={track.color} />
            <span className="text-xs font-semibold" style={{ color: C.muted }}>AI Interviewer</span>
          </div>
          <p className="text-base font-medium mb-5" style={{ color: C.text }}>{track.qs[qIdx]}</p>

          {!feedback && (
            <>
              <textarea
                value={transcript}
                onChange={(e) => { setTranscript(e.target.value); finalTranscriptRef.current = e.target.value; }}
                rows={5}
                placeholder={
                  recording
                    ? SpeechRecognitionAPI
                      ? "Listening... speak your answer (you can also edit this text)"
                      : "Type your answer while the camera records..."
                    : "Click \"Start Answering\" to begin recording."
                }
                className="w-full rounded-xl p-3 text-sm"
                style={{ background: "#1c2438", color: C.text, border: `1px solid ${C.border}` }}
              />

              {error && (
                <div className="mt-3 flex items-start gap-2 text-xs p-3 rounded-lg" style={{ background: "#2b1313", color: "#f28b8b" }}>
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {error}
                </div>
              )}

              <div className="mt-4 flex gap-3">
                {!recording ? (
                  <button
                    onClick={startRecording}
                    disabled={!cameraReady || submitting}
                    className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl disabled:opacity-50"
                    style={{ background: track.color }}
                  >
                    <Video size={14} /> Start Answering
                  </button>
                ) : (
                  <button
                    onClick={submitAnswer}
                    disabled={submitting}
                    className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl disabled:opacity-50"
                    style={{ background: track.color }}
                  >
                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    {submitting ? "Scoring your answer..." : "Stop & Submit"}
                  </button>
                )}
              </div>
            </>
          )}

          {feedback && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <ScoreTile icon={MessageSquare} label="Content" value={feedback.overall_score} color={C.green} />
                <ScoreTile icon={Eye} label="Eye Contact" value={feedback.cv?.eye_score} color={C.blue2} />
                <ScoreTile icon={Activity} label="Body Language" value={feedback.cv?.body_score} color={C.purple} />
                <ScoreTile icon={Gauge} label="Fluency" value={feedback.fluency?.fluency_score} color={C.amber} />
              </div>

              {feedback.fluency && (
                <div className="text-[11px] rounded-lg p-3" style={{ background: "#1c2438", color: C.muted }}>
                  {feedback.fluency.words_per_minute} words/min ({feedback.fluency.speed_rating})
                  {feedback.fluency.total_filler_words > 0 && (
                    <> · {feedback.fluency.total_filler_words} filler word{feedback.fluency.total_filler_words > 1 ? "s" : ""}</>
                  )}
                  {feedback.cv?.samples === 0 && (
                    <div className="mt-1 flex items-center gap-1" style={{ color: "#f2c98b" }}>
                      <AlertTriangle size={11} /> No face detected in camera frames — make sure you're facing the camera.
                    </div>
                  )}
                </div>
              )}

              {feedback.suggestions?.length > 0 && (
                <div className="text-xs rounded-lg p-3" style={{ background: "#1c2438", color: C.muted }}>
                  <span className="font-semibold" style={{ color: C.text }}>Suggestion: </span>
                  {feedback.suggestions[0]}
                </div>
              )}
              {feedback.weaknesses?.length > 0 && (
                <div className="text-[11px]" style={{ color: C.muted }}>
                  <span className="font-semibold" style={{ color: C.text }}>Areas to improve: </span>
                  {feedback.weaknesses.join(" · ")}
                </div>
              )}

              <button onClick={next} className="text-xs font-semibold text-white px-4 py-2.5 rounded-xl" style={{ background: track.color }}>
                {qIdx + 1 >= track.qs.length ? "View Summary" : "Next Question"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreTile({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-xl p-3" style={{ background: "#1c2438" }}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={12} color={color} />
        <span className="text-[10px] font-semibold" style={{ color: "#8b93a7" }}>{label}</span>
      </div>
      <p className="text-lg font-display font-extrabold" style={{ color: "#e7ebf3" }}>
        {value ?? "—"}
      </p>
    </div>
  );
}
