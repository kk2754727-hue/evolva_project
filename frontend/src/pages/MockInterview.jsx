import React, { useState } from "react";
import { PlayCircle, Mic, Send, Award, Loader2, AlertTriangle, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { C } from "../lib/theme";
import { INTERVIEW_TRACKS } from "../data/mock";
import { evaluateAnswer } from "../lib/api";

export default function MockInterview() {
  const [track, setTrack] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [scores, setScores] = useState([]);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const start = (t) => {
    setTrack(t);
    setQIdx(0);
    setAnswer("");
    setFeedback(null);
    setScores([]);
    setFinished(false);
    setError(null);
  };

  const submit = async () => {
    if (!answer.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await evaluateAnswer(track.qs[qIdx], answer);
      const score = result.overall_score ?? 0;
      const tip =
        (result.suggestions && result.suggestions[0]) ||
        (result.strengths && result.strengths[0]) ||
        "No specific feedback returned.";
      setFeedback({ score, tip, details: result });
      setScores((s) => [...s, score]);
    } catch (err) {
      setError(err.message || "Something went wrong while scoring your answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => {
    if (qIdx + 1 >= track.qs.length) setFinished(true);
    else {
      setQIdx(qIdx + 1);
      setAnswer("");
      setFeedback(null);
      setError(null);
    }
  };

  if (!track) {
    return (
      <div className="p-8">
        <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>Mock Interview</h1>
        <p className="text-sm mb-6" style={{ color: C.muted }}>Pick a track for a simulated AI interview session with instant feedback.</p>
        <Link
          to="/mock-interview/camera"
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl mb-6"
          style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
        >
          <Video size={14} color={C.blue2} /> Try Camera Mode — eye contact, body language & fluency scoring
        </Link>
        <div className="grid md:grid-cols-2 gap-5">
          {INTERVIEW_TRACKS.map((t) => (
            <div key={t.id} className="rounded-2xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${t.color}22` }}>
                <t.icon size={20} color={t.color} />
              </div>
              <h3 className="font-display font-bold text-base mb-1" style={{ color: C.text }}>{t.title}</h3>
              <p className="text-xs mb-5" style={{ color: C.muted }}>{t.desc}</p>
              <button onClick={() => start(t)} className="text-xs font-semibold text-white px-4 py-2.5 rounded-xl flex items-center gap-2" style={{ background: t.color }}>
                <PlayCircle size={14} /> Start Interview
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return (
      <div className="p-8 max-w-xl">
        <div className="rounded-2xl p-8 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <Award size={36} color={C.amber} className="mx-auto mb-4" />
          <h2 className="font-display font-extrabold text-xl mb-1" style={{ color: C.text }}>{track.title} — Session Complete</h2>
          <p className="text-sm mb-6" style={{ color: C.muted }}>Here's how you did across {scores.length} questions.</p>
          <p className="font-display font-extrabold text-5xl mb-1" style={{ color: C.green }}>{avg}%</p>
          <p className="text-xs mb-6" style={{ color: C.muted }}>Average performance score</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => start(track)} className="text-xs font-semibold px-4 py-2.5 rounded-xl" style={{ background: "#1c2438", color: C.text }}>Retry Track</button>
            <button onClick={() => setTrack(null)} className="text-xs font-semibold text-white px-4 py-2.5 rounded-xl" style={{ background: C.blue2 }}>Back to Tracks</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display font-extrabold text-xl" style={{ color: C.text }}>{track.title}</h1>
        <span className="text-xs font-semibold" style={{ color: C.muted }}>Question {qIdx + 1} of {track.qs.length}</span>
      </div>
      <div className="rounded-2xl p-6 mb-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2 mb-4">
          <Mic size={15} color={track.color} />
          <span className="text-xs font-semibold" style={{ color: C.muted }}>AI Interviewer</span>
        </div>
        <p className="text-base font-medium mb-5" style={{ color: C.text }}>{track.qs[qIdx]}</p>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={4}
          placeholder="Type your answer here..."
          className="w-full rounded-xl p-3 text-sm"
          style={{ background: "#1c2438", color: C.text, border: `1px solid ${C.border}` }}
        />
        {error && (
          <div className="mt-3 flex items-start gap-2 text-xs p-3 rounded-lg" style={{ background: "#2b1313", color: "#f28b8b" }}>
            <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        {!feedback ? (
          <button
            onClick={submit}
            disabled={submitting || !answer.trim()}
            className="mt-4 flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl disabled:opacity-50"
            style={{ background: track.color }}
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {submitting ? "Scoring your answer..." : "Submit Answer"}
          </button>
        ) : (
          <div className="mt-4 rounded-xl p-4" style={{ background: "#1c2438" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: C.muted }}>Performance Score</span>
              <span className="text-lg font-display font-extrabold" style={{ color: C.green }}>{feedback.score}%</span>
            </div>
            <p className="text-xs mb-3" style={{ color: C.muted }}>{feedback.tip}</p>
            {feedback.details?.weaknesses?.length > 0 && (
              <div className="text-[11px] mb-3" style={{ color: C.muted }}>
                <span className="font-semibold" style={{ color: C.text }}>Areas to improve: </span>
                {feedback.details.weaknesses.join(" · ")}
              </div>
            )}
            <button onClick={next} className="text-xs font-semibold text-white px-4 py-2.5 rounded-xl" style={{ background: track.color }}>
              {qIdx + 1 >= track.qs.length ? "View Summary" : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
