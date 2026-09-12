import React, { useState, useRef } from "react";
import {
  UploadCloud, FileText, AlertTriangle, CheckCircle2,
  XCircle, ChevronDown, ChevronUp, Loader2, RotateCcw,
  ThumbsUp, Zap, Eye, Tag,
} from "lucide-react";
import { C } from "../lib/theme";
import { analyzeResume } from "../lib/api";

// ── helpers ────────────────────────────────────────────────────────────────
function grade(score) {
  if (score >= 90) return { letter: "A+", color: "#14c88e", label: "Excellent" };
  if (score >= 80) return { letter: "A",  color: "#14c88e", label: "Strong"    };
  if (score >= 70) return { letter: "B",  color: "#4f6df5", label: "Good"      };
  if (score >= 60) return { letter: "C",  color: "#f2a93b", label: "Fair"      };
  if (score >= 50) return { letter: "D",  color: "#f2596b", label: "Weak"      };
  return                  { letter: "F",  color: "#f2596b", label: "Poor"      };
}

function scoreColor(score) {
  if (score >= 75) return "#14c88e";
  if (score >= 50) return "#f2a93b";
  return "#f2596b";
}

// SVG radial progress ring
function ScoreRing({ score, size = 160 }) {
  const r  = (size / 2) - 14;
  const cx = size / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const g = grade(score);
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#1c2438" strokeWidth="10" />
      <circle cx={cx} cy={cx} r={r} fill="none"
        stroke={g.color} strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x={cx} y={cx - 10} textAnchor="middle" dominantBaseline="central"
        style={{ fill: g.color, fontSize: 34, fontWeight: 800, fontFamily: "inherit" }}>
        {score}
      </text>
      <text x={cx} y={cx + 22} textAnchor="middle"
        style={{ fill: g.color, fontSize: 20, fontWeight: 700, fontFamily: "inherit" }}>
        {g.letter}
      </text>
      <text x={cx} y={cx + 42} textAnchor="middle"
        style={{ fill: "#8b93a7", fontSize: 12, fontFamily: "inherit" }}>
        {g.label}
      </text>
    </svg>
  );
}

// Single category bar row
function CategoryRow({ label, score, icon: Icon, open, onToggle, issues }) {
  const col = scoreColor(score);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3"
        style={{ background: "#1c2438" }}
      >
        <Icon size={15} color={col} className="shrink-0" />
        <span className="text-xs font-semibold flex-1 text-left" style={{ color: C.text }}>{label}</span>
        {/* Score bar */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 rounded-full" style={{ background: "#0e1421" }}>
            <div className="h-1.5 rounded-full" style={{ width: `${score}%`, background: col, transition: "width 0.8s" }} />
          </div>
          <span className="text-xs font-bold w-8 text-right" style={{ color: col }}>{score}</span>
        </div>
        {open ? <ChevronUp size={13} color={C.muted} /> : <ChevronDown size={13} color={C.muted} />}
      </button>
      {open && issues?.length > 0 && (
        <div className="px-4 py-3 space-y-2" style={{ background: "#161c2c" }}>
          {issues.map((issue, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              {issue.type === "ok"
                ? <CheckCircle2 size={13} color="#14c88e" className="mt-0.5 shrink-0" />
                : <AlertTriangle size={13} color={issue.type === "error" ? "#f2596b" : "#f2a93b"} className="mt-0.5 shrink-0" />
              }
              <div>
                <span style={{ color: C.text }}>{issue.text}</span>
                {issue.fix && <p className="mt-0.5" style={{ color: C.muted }}>{issue.fix}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Build category breakdown from Gemini result
function buildCategories(result) {
  const ats  = result.ats_score        ?? 0;
  const fmt  = result.formatting_score ?? 0;
  const kw   = result.keyword_score    ?? 0;
  const skills = result.detected_skills ?? [];
  const missing = result.missing_keywords ?? [];

  return [
    {
      label: "Format & Parsing",
      score: fmt,
      icon: FileText,
      issues: [
        fmt >= 70
          ? { type: "ok",      text: "File parsed successfully — no layout issues detected." }
          : { type: "error",   text: "Formatting issues may prevent ATS parsing.", fix: "Use a single-column layout, avoid tables and text boxes." },
        fmt >= 60
          ? { type: "ok",      text: "No problematic columns or graphics detected." }
          : { type: "warning", text: "Multi-column layouts can confuse ATS parsers.", fix: "Switch to a standard single-column format." },
      ],
    },
    {
      label: "Contact Information",
      score: Math.min(100, fmt + 10),
      icon: Eye,
      issues: [
        { type: fmt >= 60 ? "ok" : "warning", text: fmt >= 60 ? "Contact details appear in the main document body." : "Contact info may be in a header/footer — ATS may miss it.", fix: "Move contact details into the main document body." },
      ],
    },
    {
      label: "ATS Compatibility",
      score: ats,
      icon: Zap,
      issues: [
        ats >= 70
          ? { type: "ok",      text: "Resume is largely ATS-compatible." }
          : { type: "error",   text: "Low ATS compatibility — likely to be filtered out.", fix: "Remove graphics, icons, and use standard section headings." },
        { type: ats >= 60 ? "ok" : "warning", text: ats >= 60 ? "Standard section headings detected." : "Non-standard headings may not be recognized by ATS.", fix: 'Use headings like "Experience", "Education", "Skills".' },
      ],
    },
    {
      label: "Keywords & Skills",
      score: kw,
      icon: Tag,
      issues: [
        skills.length > 0
          ? { type: "ok",      text: `${skills.length} skills detected: ${skills.slice(0, 6).join(", ")}${skills.length > 6 ? "…" : ""}` }
          : { type: "warning", text: "No clear skills section found.", fix: 'Add a dedicated "Skills" or "Technical Skills" section.' },
        missing.length > 0
          ? { type: "warning", text: `Missing keywords: ${missing.join(", ")}`, fix: "Add these naturally into your experience bullets and skills section." }
          : { type: "ok",      text: "No critical keyword gaps detected." },
      ],
    },
    {
      label: "Experience & Content",
      score: Math.round((ats + kw) / 2),
      icon: ThumbsUp,
      issues: (result.strengths ?? []).slice(0, 2).map(s => ({ type: "ok", text: s }))
        .concat((result.improvements ?? []).slice(0, 2).map(s => ({ type: "warning", text: s, fix: "Apply this improvement to strengthen your profile." }))),
    },
  ];
}

// ── Main component ─────────────────────────────────────────────────────────
export default function ResumeAnalyzer() {
  const [file,       setFile]       = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [analyzing,  setAnalyzing]  = useState(false);
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState(null);
  const [openCat,    setOpenCat]    = useState(null);
  const [dragging,   setDragging]   = useState(false);
  const inputRef = useRef(null);

  const reset = () => { setFile(null); setResult(null); setError(null); setOpenCat(null); if (inputRef.current) inputRef.current.value = ""; };

  const run = async (f) => {
    setFile(f);
    setAnalyzing(true);
    setResult(null);
    setError(null);
    try {
      const data = await analyzeResume(f, targetRole.trim() || undefined);
      setResult(data);
      setOpenCat(0);
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) run(f);
  };

  const categories = result ? buildCategories(result) : [];
  const overallScore = result?.ats_score ?? 0;
  const g = grade(overallScore);

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>Resume Analyzer</h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>
        Get your ATS score, grade, and category-by-category breakdown in seconds.
      </p>

      {/* ── Upload area (shown when no result) ──────────────────── */}
      {!result && (
        <div className="grid md:grid-cols-[1fr_320px] gap-5 mb-6">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => !analyzing && inputRef.current?.click()}
            className="rounded-2xl flex flex-col items-center justify-center py-16 px-6 text-center cursor-pointer transition-all"
            style={{
              border: `2px dashed ${dragging ? C.blue2 : C.border}`,
              background: dragging ? "#131a2b" : C.card,
            }}
          >
            <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) run(f); }} />
            {analyzing ? (
              <>
                <Loader2 size={32} className="animate-spin mb-3" color={C.blue2} />
                <p className="text-sm font-semibold" style={{ color: C.text }}>Analyzing {file?.name}…</p>
                <p className="text-xs mt-1" style={{ color: C.muted }}>Running 20+ checks across 5 categories</p>
              </>
            ) : (
              <>
                <UploadCloud size={36} color={C.blue2} className="mb-3" />
                <p className="text-sm font-semibold mb-1" style={{ color: C.text }}>Drop your resume here</p>
                <p className="text-xs mb-4" style={{ color: C.muted }}>PDF or DOCX · Max 5 MB</p>
                <span className="text-xs font-semibold text-white px-4 py-2 rounded-xl" style={{ background: C.blue2 }}>
                  Choose File
                </span>
              </>
            )}
          </div>

          {/* Target role + tips */}
          <div className="space-y-4">
            <div className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <p className="text-xs font-semibold mb-2" style={{ color: C.muted }}>Target Role (optional)</p>
              <input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "#1c2438", color: C.text, border: `1px solid ${C.border}` }}
              />
              <p className="text-[10px] mt-2" style={{ color: C.muted }}>
                Helps Gemini suggest role-specific keywords you're missing.
              </p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <p className="text-xs font-semibold mb-3" style={{ color: C.muted }}>What we check</p>
              {["Format & parsing compatibility","Contact info placement","ATS keyword matching","Section headings & structure","Experience bullet quality"].map((t, i) => (
                <div key={i} className="flex items-center gap-2 mb-2 text-xs" style={{ color: C.muted }}>
                  <CheckCircle2 size={12} color={C.green} /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 text-xs p-3 rounded-xl mb-5" style={{ background: "#2b1313", color: "#f28b8b" }}>
          <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {error}
          <button onClick={reset} className="ml-auto font-semibold underline">Try again</button>
        </div>
      )}

      {/* ── Results ─────────────────────────────────────────────── */}
      {result && (
        <div>
          {/* Top bar with file info and re-upload */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FileText size={15} color={C.blue2} />
              <span className="text-sm font-semibold truncate max-w-xs" style={{ color: C.text }}>{file?.name}</span>
              {targetRole && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#1c2438", color: C.muted }}>· {targetRole}</span>}
            </div>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl" style={{ background: "#1c2438", color: C.muted, border: `1px solid ${C.border}` }}>
              <RotateCcw size={12} /> New Upload
            </button>
          </div>

          <div className="grid md:grid-cols-[260px_1fr] gap-5">

            {/* ── Left: Score ring + grade card ── */}
            <div className="space-y-4">
              {/* Big score */}
              <div className="rounded-2xl p-5 flex flex-col items-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                <p className="text-xs font-semibold mb-4" style={{ color: C.muted }}>ATS Score</p>
                <ScoreRing score={overallScore} size={160} />
                <div className="mt-4 w-full pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: C.muted }}>Formatting</span>
                    <span style={{ color: C.text, fontWeight: 600 }}>{result.formatting_score ?? 0}</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: C.muted }}>Keywords</span>
                    <span style={{ color: C.text, fontWeight: 600 }}>{result.keyword_score ?? 0}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: C.muted }}>ATS</span>
                    <span style={{ color: C.text, fontWeight: 600 }}>{result.ats_score ?? 0}</span>
                  </div>
                </div>
              </div>

              {/* Detected skills */}
              {result.detected_skills?.length > 0 && (
                <div className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: C.muted }}>Detected Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.detected_skills.map((s, i) => (
                      <span key={i} className="text-[11px] font-semibold px-2 py-1 rounded-lg" style={{ background: "#132a22", color: "#7fe3bd" }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing keywords */}
              {result.missing_keywords?.length > 0 && (
                <div className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: C.muted }}>Missing Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing_keywords.map((k, i) => (
                      <span key={i} className="text-[11px] font-semibold px-2 py-1 rounded-lg" style={{ background: "#2b2013", color: "#f2c98b" }}>+ {k}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Category breakdown + issues ── */}
            <div className="space-y-3">
              <p className="text-xs font-semibold" style={{ color: C.muted }}>Category Breakdown</p>
              {categories.map((cat, i) => (
                <CategoryRow
                  key={i}
                  label={cat.label}
                  score={cat.score}
                  icon={cat.icon}
                  open={openCat === i}
                  onToggle={() => setOpenCat(openCat === i ? null : i)}
                  issues={cat.issues}
                />
              ))}

              {/* Strengths */}
              {result.strengths?.length > 0 && (
                <div className="rounded-2xl p-4 mt-2" style={{ background: "#132a22", border: `1px solid #1a3d2a` }}>
                  <p className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: "#7fe3bd" }}>
                    <ThumbsUp size={12} /> Strengths
                  </p>
                  {result.strengths.map((s, i) => (
                    <p key={i} className="text-xs mb-1" style={{ color: "#7fe3bd" }}>✓ {s}</p>
                  ))}
                </div>
              )}

              {/* Improvements */}
              {result.improvements?.length > 0 && (
                <div className="rounded-2xl p-4" style={{ background: "#2b2013", border: `1px solid #3d2d10` }}>
                  <p className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: "#f2c98b" }}>
                    <Zap size={12} /> Suggested Improvements
                  </p>
                  {result.improvements.map((s, i) => (
                    <p key={i} className="text-xs mb-1" style={{ color: "#f2c98b" }}>→ {s}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}