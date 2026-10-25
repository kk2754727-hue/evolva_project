import React, {
  useState, useRef, useEffect, useCallback, useMemo,
} from "react";
import {
  Mic, MicOff, Send, Award, Loader2, AlertTriangle,
  RotateCcw, ChevronRight, CheckCircle2, Sparkles,
  ThumbsUp, User, Bot, Video, VideoOff, Eye, Activity,
  FileText, UploadCloud, Code2, Users, Gauge, X, Tag,
} from "lucide-react";
import { C } from "../lib/theme";
import { evaluateAnswer, analyzeFrame, saveInterviewSession } from "../lib/api";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const SpeechAPI = typeof window !== "undefined"
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null;
const FRAME_MS = 2000;

// ── Helpers ───────────────────────────────────────────────────────────────
function avg(arr) {
  return arr.length ? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length) : 0;
}
function scoreColor(s) {
  return s >= 75 ? C.green : s >= 50 ? C.amber : "#f2596b";
}
function useUser() {
  return useMemo(() => {
    try {
      const raw = sessionStorage.getItem("evolva_user");
      if (!raw) return null;
      const p = JSON.parse(raw);
      return typeof p === "object" && p ? p : null;
    } catch { return null; }
  }, []);
}

// ── MODE CONFIG ───────────────────────────────────────────────────────────
const MODES = {
  hr: {
    label: "HR Interview",
    icon:  Users,
    color: C.blue2,
    desc:  "Behavioural, motivational and situational questions — just like a real HR round.",
    tips:  ["Use the STAR method for behavioural questions", "Be specific with examples", "Keep answers under 90 seconds"],
  },
  technical: {
    label: "Technical Interview",
    icon:  Code2,
    color: C.purple,
    desc:  "DSA, OOP, coding concepts and project-deep-dive questions tailored from your resume.",
    tips:  ["Think aloud — explain your reasoning step by step", "Mention time/space complexity for DSA answers", "Upload your resume to get project-specific questions"],
  },
  video: {
    label: "Video Interview",
    icon:  Video,
    color: C.green,
    desc:  "Full HR + Technical mix with live camera scoring for eye contact, body language and posture.",
    tips:  ["Sit in a well-lit room facing the camera", "Look at the camera lens, not the screen", "Speak clearly — your mic is transcribed live"],
  },
};

// ── Typing animation ──────────────────────────────────────────────────────
function TypingText({ text, onDone }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown(""); let i = 0;
    const id = setInterval(() => {
      setShown(text.slice(0, ++i));
      if (i >= text.length) { clearInterval(id); onDone?.(); }
    }, 18);
    return () => clearInterval(id);
  }, [text]);
  return <span>{shown}{shown.length < text.length && <span className="animate-pulse">|</span>}</span>;
}

// ── Score pill ────────────────────────────────────────────────────────────
function ScorePill({ label, value }) {
  const col = scoreColor(value ?? 0);
  return (
    <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: "#0e1421" }}>
      <p className="text-[10px] mb-0.5" style={{ color: C.muted }}>{label}</p>
      <p className="text-base font-display font-extrabold" style={{ color: value != null ? col : C.muted }}>
        {value ?? "—"}
      </p>
    </div>
  );
}

// ── Question type badge ───────────────────────────────────────────────────
function QBadge({ tag, type }) {
  const label = tag || type || "";
  const isTech = ["technical","system_design","project","dsa","DSA","Technical","System Design","Project"].includes(label);
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
      style={{ background: isTech ? "#1a1a2a" : "#1a2a1a", color: isTech ? C.purple : C.green }}>
      {isTech ? <Code2 size={8}/> : <Users size={8}/>} {label}
    </span>
  );
}

// ── Chat bubbles ──────────────────────────────────────────────────────────
function HRBubble({ item, modeColor, onDone }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: `linear-gradient(135deg,${modeColor},#14c88e)` }}>
        <Bot size={14} color="#fff" />
      </div>
      <div className="flex-1 max-w-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-semibold" style={{ color: modeColor }}>AI Interviewer</span>
          {(item.tag || item.qtype) && <QBadge tag={item.tag} type={item.qtype} />}
        </div>
        <div className="rounded-2xl rounded-tl-none px-4 py-3"
          style={{ background: "#1c2438", border: `1px solid ${C.border}` }}>
          <p className="text-sm leading-relaxed" style={{ color: C.text }}>
            {item.isNew ? <TypingText text={item.text} onDone={onDone} /> : item.text}
          </p>
        </div>
      </div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div className="flex items-start gap-3 flex-row-reverse">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: "#1c2438", border: `1px solid ${C.border}` }}>
        <User size={14} color={C.muted} />
      </div>
      <div className="rounded-2xl rounded-tr-none px-4 py-3 max-w-xl"
        style={{ background: "#131a2b", border: `1px solid ${C.border}` }}>
        <p className="text-[10px] font-semibold mb-1" style={{ color: C.blue2 }}>You</p>
        <p className="text-sm leading-relaxed" style={{ color: C.text }}>{text}</p>
      </div>
    </div>
  );
}

function FeedbackBubble({ data, cvSummary, onNext, isLast }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ml-11">
      <div className="rounded-2xl p-4" style={{ background: "#0e1421", border: `1px solid ${C.border}` }}>
        <div className="flex gap-2 mb-3 flex-wrap">
          <ScorePill label="Overall"       value={data.overall_score}       />
          <ScorePill label="Content"       value={data.technical_score}     />
          <ScorePill label="Communication" value={data.communication_score} />
          <ScorePill label="Grammar"       value={data.grammar_score}       />
          {cvSummary && <>
            <ScorePill label="Eye Contact" value={cvSummary.eye_score} />
            <ScorePill label="Body Lang."  value={cvSummary.body_score} />
          </>}
        </div>
        {data.suggestions?.[0] && (
          <div className="flex items-start gap-2 text-xs p-2.5 rounded-lg mb-2"
            style={{ background: "#132a22", color: "#7fe3bd" }}>
            <ThumbsUp size={11} className="mt-0.5 shrink-0" /> {data.suggestions[0]}
          </div>
        )}
        {(data.weaknesses?.length > 0 || data.strengths?.length > 0) && (
          <button onClick={() => setOpen(o=>!o)} className="text-[11px] font-semibold mb-2"
            style={{ color: C.blue2 }}>
            {open ? "▲ Less" : "▼ More detail"}
          </button>
        )}
        {open && (
          <div className="space-y-1 mb-2">
            {data.strengths?.map((s,i) => (
              <p key={i} className="text-[11px] flex items-start gap-1" style={{ color: "#7fe3bd" }}>
                <CheckCircle2 size={10} className="mt-0.5 shrink-0" /> {s}
              </p>
            ))}
            {data.weaknesses?.map((w,i) => (
              <p key={i} className="text-[11px] flex items-start gap-1" style={{ color: "#f2c98b" }}>
                <AlertTriangle size={10} className="mt-0.5 shrink-0" /> {w}
              </p>
            ))}
          </div>
        )}
        <button onClick={onNext}
          className="flex items-center gap-2 text-xs font-semibold text-white px-4 py-2 rounded-xl w-full justify-center"
          style={{ background: C.blue2 }}>
          {isLast ? <><Award size={12}/> Finish Interview</> : <><ChevronRight size={12}/> Next Question</>}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════
export default function MockInterview() {
  const user = useUser();

  // ── Setup state ──────────────────────────────────────────────────────
  const [mode,         setMode]         = useState("hr");
  const [targetRole,   setTargetRole]   = useState(user?.target_role || "");
  const [numQuestions, setNumQuestions] = useState(5);
  const [resumeFile,   setResumeFile]   = useState(null);
  const [topics,       setTopics]       = useState([]);    // extracted from resume
  const [extracting,   setExtracting]   = useState(false);
  const [extractErr,   setExtractErr]   = useState("");

  // ── Session state ─────────────────────────────────────────────────────
  const [phase,      setPhase]      = useState("setup");
  const [questions,  setQuestions]  = useState([]);
  const [qIdx,       setQIdx]       = useState(0);
  const [answer,     setAnswer]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [genError,   setGenError]   = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [thread,     setThread]     = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [cvResults,  setCvResults]  = useState([]);  // per-question CV summaries

  // ── Camera / speech ───────────────────────────────────────────────────
  const [cameraOn,    setCameraOn]    = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [listening,   setListening]   = useState(false);
  const [liveCv,      setLiveCv]      = useState(null);   // current frame scores

  const videoRef      = useRef(null);
  const canvasRef     = useRef(null);
  const streamRef     = useRef(null);
  const frameTimerRef = useRef(null);
  const recogRef      = useRef(null);
  const finalRef      = useRef("");
  const chatRef       = useRef(null);
  const frameScores   = useRef([]);  // scores for current question
  const resumeRef     = useRef(null);

  const modeConfig = MODES[mode];

  // ── Auto-scroll chat ──────────────────────────────────────────────────
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [thread]);

  // ── Camera lifecycle ──────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== "video" || phase !== "interview") return;
    let cancelled = false;
    navigator.mediaDevices?.getUserMedia({ video: { width: 640, height: 480 }, audio: false })
      .then(stream => {
        if (cancelled) { stream.getTracks().forEach(t=>t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraReady(true); setCameraOn(true);
      })
      .catch(err => setCameraError(
        err.name === "NotAllowedError"
          ? "Camera access denied. Allow camera permission to use Video mode."
          : `Camera error: ${err.message}`
      ));
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(t=>t.stop());
      streamRef.current = null;
      clearInterval(frameTimerRef.current);
    };
  }, [mode, phase]);

  // ── Frame capture ─────────────────────────────────────────────────────
  const captureFrame = useCallback(async () => {
    const v = videoRef.current, c = canvasRef.current;
    if (!v || !c || v.readyState < 2) return;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
    const b64 = c.toDataURL("image/jpeg", 0.6);
    try {
      const scores = await analyzeFrame(b64);
      if (typeof scores.cv_score === "number") {
        frameScores.current.push(scores);
        setLiveCv(scores);
      }
    } catch { /* single frame failure is ok */ }
  }, []);

  // ── Resume upload + topic extraction ─────────────────────────────────
  const handleResumeUpload = async (file) => {
    if (!file) return;
    setResumeFile(file);
    setTopics([]);
    setExtractErr("");
    setExtracting(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res  = await fetch(`${API_BASE}/api/interview/extract-topics`, {
        method: "POST", body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Extraction failed.");
      setTopics(data.topics || []);
    } catch (err) {
      setExtractErr(err.message || "Could not extract topics.");
    } finally {
      setExtracting(false);
    }
  };

  // ── Generate questions ────────────────────────────────────────────────
  const startInterview = async () => {
    setGenError(""); setPhase("loading");
    try {
      const res = await fetch(`${API_BASE}/api/interview/generate-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          target_role:   targetRole.trim() || "Software Engineer",
          resume_topics: topics,
          num_questions: numQuestions,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.questions?.length) throw new Error(data.error || "No questions returned.");
      beginSession(data.questions);
    } catch {
      // fallback questions
      const fallback = [
        { id:1, text:"Tell me about yourself.", type:"intro", tag:"HR" },
        { id:2, text:"Why are you applying for this role?", type:"motivation", tag:"HR" },
        { id:3, text:"What is your greatest technical strength?", type:"strength", tag:"HR" },
        { id:4, text:"Describe a challenging project you built.", type:"behavioral", tag:"Behavioural" },
        { id:5, text:"Where do you see yourself in 5 years?", type:"goal", tag:"HR" },
      ].slice(0, numQuestions);
      beginSession(fallback);
    }
  };

  const beginSession = (qs) => {
    setQuestions(qs); setQIdx(0);
    setAllResults([]); setCvResults([]);
    setAnswer(""); finalRef.current = "";
    setThread([{ type:"hr", text:qs[0].text, tag:qs[0].tag, qtype:qs[0].type, isNew:true }]);
    setTypingDone(false);
    setPhase("interview");
    frameScores.current = [];
    if (mode === "video") {
      frameTimerRef.current = setInterval(captureFrame, FRAME_MS);
    }
    if (SpeechAPI && mode !== "setup") startListening();
  };

  // ── Submit answer ─────────────────────────────────────────────────────
  const submitAnswer = async () => {
    const ans = answer.trim();
    if (!ans || submitting || !typingDone) return;
    stopListening();
    setSubmitting(true);

    // CV summary for this question
    const cvSummary = frameScores.current.length ? {
      eye_score:  avg(frameScores.current.map(s=>s.eye_score||0)),
      head_score: avg(frameScores.current.map(s=>s.head_score||0)),
      body_score: avg(frameScores.current.map(s=>s.body_score||0)),
      cv_score:   avg(frameScores.current.map(s=>s.cv_score||0)),
    } : null;
    frameScores.current = [];

    setThread(t => [...t, { type:"user", text:ans }]);
    setAnswer(""); finalRef.current = "";

    try {
      const result = await evaluateAnswer(questions[qIdx].text, ans);
      setAllResults(r => [...r, result]);
      setCvResults(r => [...r, cvSummary]);
      setThread(t => [...t, { type:"feedback", data:result, cv:cvSummary }]);
    } catch (err) {
      setThread(t => [...t, { type:"feedback", data:{ overall_score:null, suggestions:[`Error: ${err.message}`] }, cv:null }]);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Next question ─────────────────────────────────────────────────────
  const nextQuestion = () => {
    if (qIdx + 1 >= questions.length) { endSession(); return; }
    const next = qIdx + 1;
    setQIdx(next);
    setTypingDone(false);
    const q = questions[next];
    setThread(t => [...t, { type:"hr", text:q.text, tag:q.tag, qtype:q.type, isNew:true }]);
    if (SpeechAPI) startListening();
  };

  const endSession = () => {
    clearInterval(frameTimerRef.current);
    stopListening();
    streamRef.current?.getTracks().forEach(t=>t.stop());
    streamRef.current = null;
    setPhase("done");

    // Save this session to the student's interview history (database)
    if (allResults.length > 0) {
      const cvs = cvResults.filter(Boolean);
      saveInterviewSession({
        track: targetRole || "General",
        mode,
        scores: {
          overall_score:       avg(allResults.map(r => r.overall_score       || 0)),
          technical_score:     avg(allResults.map(r => r.technical_score     || 0)),
          communication_score: avg(allResults.map(r => r.communication_score || 0)),
          grammar_score:       avg(allResults.map(r => r.grammar_score       || 0)),
          confidence_score:    avg(allResults.map(r => r.confidence_score    || 0)),
          eye_score:  cvs.length ? avg(cvs.map(c => c.eye_score  || 0)) : 0,
          body_score: cvs.length ? avg(cvs.map(c => c.body_score || 0)) : 0,
          questions_count:     allResults.length,
        },
      }).catch(() => { /* history is a bonus - never block the summary screen */ });
    }
  };

  // ── Speech ────────────────────────────────────────────────────────────
  const startListening = () => {
    if (!SpeechAPI) return;
    try {
      const r = new SpeechAPI();
      r.continuous = true; r.interimResults = true; r.lang = "en-US";
      r.onresult = (e) => {
        let final = finalRef.current, interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) final += t + " ";
          else interim += t;
        }
        finalRef.current = final;
        setAnswer(final + interim);
      };
      r.onerror = () => setListening(false);
      r.start();
      recogRef.current = r;
      setListening(true);
    } catch {}
  };

  const stopListening = () => {
    try { recogRef.current?.stop(); } catch {}
    setListening(false);
  };

  const toggleMic = () => listening ? stopListening() : startListening();

  // ── Summary stats ─────────────────────────────────────────────────────
  const overallAvg = avg(allResults.map(r=>r.overall_score||0));
  const contentAvg = avg(allResults.map(r=>r.technical_score||0));
  const commAvg    = avg(allResults.map(r=>r.communication_score||0));
  const grammarAvg = avg(allResults.map(r=>r.grammar_score||0));
  const eyeAvg     = avg(cvResults.filter(Boolean).map(c=>c.eye_score||0));
  const bodyAvg    = avg(cvResults.filter(Boolean).map(c=>c.body_score||0));

  // ══════════════════════════════════════════════════════════════════════
  // SETUP SCREEN
  // ══════════════════════════════════════════════════════════════════════
  if (phase === "setup") return (
    <div className="p-6 max-w-3xl">
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>
        Mock Interview
      </h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>
        Gemini generates personalised questions from your resume. Choose a mode, upload your resume, and start practising.
      </p>

      {/* Mode tabs */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Object.entries(MODES).map(([key, m]) => (
          <button key={key} onClick={() => setMode(key)}
            className="rounded-2xl p-4 text-left transition-all"
            style={{
              background: mode === key ? `${m.color}18` : C.card,
              border: `1.5px solid ${mode === key ? m.color : C.border}`,
            }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${m.color}22` }}>
              <m.icon size={18} color={m.color} />
            </div>
            <p className="text-xs font-bold mb-1" style={{ color: C.text }}>{m.label}</p>
            <p className="text-[11px]" style={{ color: C.muted, lineHeight: 1.4 }}>{m.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Left: config */}
        <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.muted }}>
            Interview Setup
          </p>

          <div className="mb-4">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: C.muted }}>Target Role</label>
            <input value={targetRole} onChange={e=>setTargetRole(e.target.value)}
              placeholder="e.g. Software Engineer, Data Scientist"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background: "#1c2438", color: C.text, border: `1px solid ${C.border}` }} />
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: C.muted }}>Questions</label>
            <div className="flex gap-2">
              {[3,5,7,10].map(n => (
                <button key={n} onClick={() => setNumQuestions(n)}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold"
                  style={{
                    background: numQuestions===n ? modeConfig.color : "#1c2438",
                    color:      numQuestions===n ? "#fff" : C.muted,
                    border:    `1px solid ${numQuestions===n ? modeConfig.color : C.border}`,
                  }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {genError && (
            <div className="flex items-start gap-2 text-xs p-3 rounded-xl mb-3"
              style={{ background: "#2b1313", color: "#f28b8b" }}>
              <AlertTriangle size={13} className="mt-0.5 shrink-0" /> {genError}
            </div>
          )}

          <button onClick={startInterview}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white py-3.5 rounded-xl"
            style={{ background: `linear-gradient(90deg,${modeConfig.color},#6d5bf5)` }}>
            <Sparkles size={16} /> Start {modeConfig.label}
          </button>
        </div>

        {/* Right: resume upload */}
        <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.muted }}>
            Resume (Recommended)
          </p>

          {!resumeFile ? (
            <div
              onClick={() => resumeRef.current?.click()}
              className="rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center cursor-pointer hover:opacity-80 text-center"
              style={{ borderColor: C.border }}>
              <UploadCloud size={24} color={C.blue2} className="mb-2" />
              <p className="text-xs font-semibold mb-0.5" style={{ color: C.text }}>Upload resume</p>
              <p className="text-[11px]" style={{ color: C.muted }}>PDF or DOCX</p>
              <input ref={resumeRef} type="file" accept=".pdf,.docx" className="hidden"
                onChange={e => handleResumeUpload(e.target.files?.[0])} />
            </div>
          ) : (
            <div className="rounded-xl p-3 mb-3 flex items-center gap-2"
              style={{ background: "#1c2438", border: `1px solid ${C.border}` }}>
              <FileText size={15} color={C.blue2} className="shrink-0" />
              <span className="text-xs flex-1 truncate" style={{ color: C.text }}>{resumeFile.name}</span>
              <button onClick={() => { setResumeFile(null); setTopics([]); }}
                className="p-1 rounded-lg" style={{ color: C.muted }}>
                <X size={13} />
              </button>
            </div>
          )}

          {extracting && (
            <div className="flex items-center gap-2 text-xs mt-3" style={{ color: C.muted }}>
              <Loader2 size={12} className="animate-spin" /> Extracting topics from resume…
            </div>
          )}
          {extractErr && (
            <div className="text-xs mt-2" style={{ color: "#f28b8b" }}>{extractErr}</div>
          )}
          {topics.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-semibold mb-2 flex items-center gap-1" style={{ color: C.green }}>
                <Tag size={10}/> {topics.length} topics extracted — questions will reference these
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {topics.map((t,i) => (
                  <span key={i} className="text-[10px] px-2 py-1 rounded-lg"
                    style={{ background: "#132a22", color: "#7fe3bd" }}>{t}</span>
                ))}
              </div>
            </div>
          )}
          {!resumeFile && !extracting && (
            <p className="text-[11px] mt-3" style={{ color: C.muted }}>
              Upload your resume so Gemini can ask about your actual projects and tech stack.
            </p>
          )}

          {/* Tips */}
          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
            <p className="text-[10px] font-semibold mb-2" style={{ color: C.muted }}>Tips</p>
            {modeConfig.tips.map((t,i) => (
              <p key={i} className="text-[11px] mb-1" style={{ color: C.muted }}>
                <span style={{ color: modeConfig.color }}>→ </span>{t}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════
  // LOADING
  // ══════════════════════════════════════════════════════════════════════
  if (phase === "loading") return (
    <div className="p-6 flex flex-col items-center justify-center min-h-64">
      <Loader2 size={28} className="animate-spin mb-3" color={modeConfig.color} />
      <p className="text-sm font-semibold" style={{ color: C.text }}>Generating your interview…</p>
      <p className="text-xs mt-1 text-center max-w-xs" style={{ color: C.muted }}>
        Gemini is creating {numQuestions} {modeConfig.label.toLowerCase()} questions
        {topics.length > 0 ? ` personalised from your resume` : ""}
        {targetRole ? ` for ${targetRole}` : ""}
      </p>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════
  // RESULTS
  // ══════════════════════════════════════════════════════════════════════
  if (phase === "done") {
    const hasCV = cvResults.some(Boolean);
    const composite = hasCV
      ? avg([overallAvg, eyeAvg, bodyAvg].filter(n=>n>0))
      : overallAvg;

    return (
      <div className="p-6 max-w-xl">
        <div className="rounded-2xl p-7 mb-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="text-center mb-5">
            <Award size={32} color={C.amber} className="mx-auto mb-2" />
            <h2 className="font-display font-extrabold text-xl mb-0.5" style={{ color: C.text }}>
              Interview Complete!
            </h2>
            <p className="text-xs" style={{ color: C.muted }}>
              {modeConfig.label} · {allResults.length} questions{targetRole ? ` · ${targetRole}` : ""}
            </p>
          </div>

          {/* Big score */}
          <div className="text-center mb-5">
            <p className="text-5xl font-display font-extrabold" style={{ color: scoreColor(composite) }}>
              {composite}%
            </p>
            <p className="text-xs mt-1" style={{ color: C.muted }}>
              {hasCV ? "Composite (Content + Camera)" : "Overall Score"}
            </p>
          </div>

          {/* Score pills */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <ScorePill label="Content"       value={contentAvg} />
            <ScorePill label="Communication" value={commAvg}    />
            <ScorePill label="Grammar"       value={grammarAvg} />
            {hasCV && <>
              <ScorePill label="Eye Contact" value={eyeAvg} />
              <ScorePill label="Body Lang."  value={bodyAvg} />
            </>}
          </div>

          {/* Per-question list */}
          <div className="space-y-2 mb-5">
            {allResults.map((r,i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "#1c2438" }}>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: "#0e1421", color: C.muted }}>Q{i+1}</span>
                <p className="text-xs flex-1 truncate" style={{ color: C.muted }}>
                  {questions[i]?.text}
                </p>
                <span className="text-xs font-bold shrink-0"
                  style={{ color: scoreColor(r.overall_score||0) }}>
                  {r.overall_score??'—'}%
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setPhase("setup")}
              className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl"
              style={{ background: "#1c2438", color: C.text, border: `1px solid ${C.border}` }}>
              <RotateCcw size={13}/> Try Again
            </button>
            <button onClick={() => { setPhase("setup"); setResumeFile(null); setTopics([]); setTargetRole(user?.target_role||""); }}
              className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-white py-3 rounded-xl"
              style={{ background: modeConfig.color }}>
              <Sparkles size={13}/> New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // ACTIVE INTERVIEW — chat style
  // ══════════════════════════════════════════════════════════════════════
  const hasFeedback = thread[thread.length-1]?.type === "feedback";
  const progress    = ((qIdx + (hasFeedback?1:0)) / questions.length) * 100;
  const isVideo     = mode === "video";

  return (
    <div className={`flex gap-4 h-[calc(100vh-80px)] max-w-5xl ${isVideo ? "flex-row" : "flex-col max-w-3xl"}`}>

      {/* ── Camera panel (video mode only) ──────────────────────── */}
      {isVideo && (
        <div className="w-64 shrink-0 flex flex-col gap-3">
          <div className="rounded-2xl overflow-hidden" style={{ background: "#000", aspectRatio:"4/3", position:"relative" }}>
            <video ref={videoRef} autoPlay muted playsInline
              className="w-full h-full object-cover" style={{ transform:"scaleX(-1)" }} />
            <canvas ref={canvasRef} className="hidden" />
            {!cameraReady && !cameraError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={20} className="animate-spin" color={C.muted} />
              </div>
            )}
            {cameraOn && cameraReady && (
              <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold text-white"
                style={{ background: "rgba(192,57,43,0.85)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
              </div>
            )}
            {liveCv && (
              <div className="absolute bottom-2 inset-x-2 px-2 py-1.5 rounded-lg text-[10px]"
                style={{ background:"rgba(0,0,0,0.65)", color:"#fff" }}>
                Eye {liveCv.eye_score} · Head {liveCv.head_score} · Body {liveCv.body_score}
              </div>
            )}
          </div>
          {cameraError && (
            <div className="text-[11px] p-2 rounded-xl" style={{ background:"#2b1313", color:"#f28b8b" }}>
              {cameraError}
            </div>
          )}
          {/* Live CV metrics */}
          {liveCv && (
            <div className="rounded-xl p-3 space-y-2" style={{ background: C.card, border:`1px solid ${C.border}` }}>
              {[
                { label:"Eye Contact", val:liveCv.eye_score,  icon:Eye      },
                { label:"Head Pose",   val:liveCv.head_score, icon:Gauge    },
                { label:"Body Lang",   val:liveCv.body_score, icon:Activity },
              ].map((m,i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: C.muted }}>
                      <m.icon size={10}/> {m.label}
                    </span>
                    <span className="text-[10px] font-bold" style={{ color: scoreColor(m.val) }}>{m.val}</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background:"#1c2438" }}>
                    <div className="h-1 rounded-full" style={{ width:`${m.val}%`, background:scoreColor(m.val), transition:"width 0.4s" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Main chat column ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-0">

        {/* Header bar */}
        <div className="px-5 py-3 flex items-center justify-between shrink-0 rounded-t-2xl"
          style={{ background: C.card, border:`1px solid ${C.border}` }}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background:`${modeConfig.color}22` }}>
              <modeConfig.icon size={14} color={modeConfig.color} />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: C.text }}>
                {modeConfig.label}{targetRole ? ` · ${targetRole}` : ""}
              </p>
              <p className="text-[10px]" style={{ color: C.muted }}>
                Q {qIdx+1} / {questions.length}
                {topics.length>0 && " · Resume-personalised"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-28 h-1.5 rounded-full" style={{ background:"#1c2438" }}>
              <div className="h-1.5 rounded-full" style={{ width:`${progress}%`, background:modeConfig.color, transition:"width 0.4s" }} />
            </div>
            <button onClick={() => { clearInterval(frameTimerRef.current); stopListening(); setPhase("setup"); }}
              className="text-[11px] px-2.5 py-1.5 rounded-lg font-semibold"
              style={{ background:"#1c2438", color:C.muted }}>
              Exit
            </button>
          </div>
        </div>

        {/* Chat thread */}
        <div ref={chatRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
          style={{ background: C.panel }}>
          {thread.map((item, i) => {
            if (item.type === "hr") return (
              <HRBubble key={i} item={item} modeColor={modeConfig.color}
                onDone={() => { if(item.isNew){ setTypingDone(true); item.isNew=false; }}} />
            );
            if (item.type === "user")     return <UserBubble key={i} text={item.text} />;
            if (item.type === "feedback") return (
              <FeedbackBubble key={i} data={item.data} cvSummary={item.cv}
                isLast={qIdx+1 >= questions.length}
                onNext={nextQuestion} />
            );
            return null;
          })}
          {submitting && (
            <div className="flex items-center gap-2 ml-11 text-xs" style={{ color: C.muted }}>
              <Loader2 size={12} className="animate-spin" /> Gemini is evaluating your answer…
            </div>
          )}
        </div>

        {/* Input bar */}
        {!hasFeedback && (
          <div className="px-5 py-4 shrink-0 rounded-b-2xl"
            style={{ background: C.card, border:`1px solid ${C.border}` }}>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              disabled={submitting || !typingDone}
              rows={3}
              placeholder={
                !typingDone
                  ? "Wait for the question to finish typing…"
                  : listening
                    ? "🎤 Listening — speak your answer…"
                    : "Type your answer here, or click the mic to speak…"
              }
              onKeyDown={e => { if(e.key==="Enter" && (e.metaKey||e.ctrlKey)) submitAnswer(); }}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none mb-3"
              style={{
                background: "#1c2438",
                color: C.text,
                border: `1px solid ${listening ? C.green : C.border}`,
                opacity: !typingDone ? 0.5 : 1,
              }}
            />
            <div className="flex items-center gap-3">
              {SpeechAPI && (
                <button onClick={toggleMic} disabled={submitting || !typingDone}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl disabled:opacity-50"
                  style={{
                    background: listening ? "#132a22" : "#1c2438",
                    color:      listening ? C.green   : C.muted,
                    border:    `1px solid ${listening ? C.green : C.border}`,
                  }}>
                  {listening ? <><MicOff size={13}/> Stop</> : <><Mic size={13}/> Speak</>}
                </button>
              )}
              <p className="text-[11px] flex-1" style={{ color: C.muted }}>
                Ctrl+Enter to submit
              </p>
              <button onClick={submitAnswer}
                disabled={submitting || !answer.trim() || !typingDone}
                className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl disabled:opacity-50"
                style={{ background: modeConfig.color }}>
                {submitting
                  ? <><Loader2 size={13} className="animate-spin"/> Scoring…</>
                  : <><Send size={13}/> Submit</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}