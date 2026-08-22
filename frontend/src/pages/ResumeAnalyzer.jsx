import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, ThumbsUp, AlertTriangle, Zap } from "lucide-react";
import { C } from "../lib/theme";
import { RadialProgress } from "../components/ui";
import { analyzeResume } from "../lib/api";

const GUIDELINES = [
  { title: "ATS-Friendly Formatting", body: "Use standard fonts and clear headings (Experience, Projects, Education) without tables or images." },
  { title: "Include Highlighted Projects", body: "Detail 2-3 key technical projects with GitHub links and measurable impact." },
  { title: "Match Technical Skills", body: "List core competencies (e.g. Python, SQL, React, DSA) matching target corporate job roles." },
  { title: "Use Strong Action Verbs", body: "Begin bullet points with verbs like Engineered, Developed, Optimized, and Implemented." },
  { title: "Keep to a Single Page", body: "Maintain a concise, high-density 1-page layout for optimal recruiter scanning." },
];

export default function ResumeAnalyzer() {
  const [fileName, setFileName] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const runAnalysis = async (file) => {
    setFileName(file.name);
    setAnalyzing(true);
    setDone(false);
    setError(null);
    try {
      const data = await analyzeResume(file);
      setResult(data);
      setDone(true);
    } catch (err) {
      setError(err.message || "Something went wrong while analyzing your resume.");
    } finally {
      setAnalyzing(false);
    }
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) runAnalysis(f);
  };

  return (
    <div className="p-8">
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>Resume Analyzer</h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Upload your resume and receive AI-powered feedback to improve your placement opportunities.</p>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
        <div className="rounded-2xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <h3 className="font-display font-bold text-base mb-1" style={{ color: C.text }}>Upload Your Resume</h3>
          <p className="text-xs mb-5" style={{ color: C.muted }}>Upload your latest CV in PDF or DOCX format for instant ATS scoring & alignment analysis.</p>

          <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={onFileChange} />

          {!fileName && (
            <div
              className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-16"
              style={{ borderColor: C.border }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) runAnalysis(f);
              }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ background: "#1c2438" }}>
                <UploadCloud size={24} color={C.blue2} />
              </div>
              <p className="font-semibold text-sm mb-1" style={{ color: C.text }}>Drag & Drop your resume here</p>
              <p className="text-xs mb-5" style={{ color: C.muted }}>Supports PDF and DOCX formats (Max size: 5MB)</p>
              <button onClick={() => inputRef.current?.click()} className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl" style={{ background: C.blue2 }}>
                Choose Resume File
              </button>
            </div>
          )}

          {fileName && analyzing && (
            <div className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-16" style={{ borderColor: C.border }}>
              <div className="w-10 h-10 rounded-full border-4 mb-4 animate-spin" style={{ borderColor: "#1c2438", borderTopColor: C.blue2 }} />
              <p className="font-semibold text-sm" style={{ color: C.text }}>Analyzing {fileName}...</p>
              <p className="text-xs" style={{ color: C.muted }}>Running ATS parsing, keyword match & structure scoring</p>
            </div>
          )}

          {fileName && error && !analyzing && (
            <div>
              <div className="flex items-start gap-2 text-xs p-3 rounded-lg mb-4" style={{ background: "#2b1313", color: "#f28b8b" }}>
                <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {error}
              </div>
              <button
                onClick={() => { setFileName(null); setError(null); if (inputRef.current) inputRef.current.value = ""; }}
                className="text-xs font-semibold px-4 py-2.5 rounded-xl text-white"
                style={{ background: C.blue2 }}
              >
                Try Again
              </button>
            </div>
          )}

          {fileName && done && result && (
            <div>
              <div className="flex items-center justify-between rounded-xl p-4 mb-5" style={{ background: "#1c2438" }}>
                <div className="flex items-center gap-3">
                  <FileText size={18} color={C.blue2} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: C.text }}>{fileName}</p>
                    <p className="text-[11px]" style={{ color: C.muted }}>Analyzed just now</p>
                  </div>
                </div>
                <button
                  onClick={() => { setFileName(null); setDone(false); setResult(null); if (inputRef.current) inputRef.current.value = ""; }}
                  className="text-xs font-semibold"
                  style={{ color: C.blue2 }}
                >
                  Re-upload
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="rounded-xl p-4 text-center" style={{ background: "#1c2438" }}>
                  <RadialProgress value={result.ats_score ?? 0} color={C.green} size={64} />
                  <p className="text-lg font-display font-extrabold mt-2" style={{ color: C.text }}>{result.ats_score ?? "—"}</p>
                  <p className="text-[10px]" style={{ color: C.muted }}>ATS Score</p>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: "#1c2438" }}>
                  <RadialProgress value={result.formatting_score ?? 0} color={C.blue2} size={64} />
                  <p className="text-lg font-display font-extrabold mt-2" style={{ color: C.text }}>{result.formatting_score ?? "—"}</p>
                  <p className="text-[10px]" style={{ color: C.muted }}>Formatting</p>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: "#1c2438" }}>
                  <RadialProgress value={result.keyword_score ?? 0} color={C.amber} size={64} />
                  <p className="text-lg font-display font-extrabold mt-2" style={{ color: C.text }}>{result.keyword_score ?? "—"}</p>
                  <p className="text-[10px]" style={{ color: C.muted }}>Keyword Match</p>
                </div>
              </div>
              <div className="space-y-2">
                {(result.strengths || []).map((s, i) => (
                  <div key={`s-${i}`} className="flex items-start gap-2 text-xs p-3 rounded-lg" style={{ background: "#132a22", color: "#7fe3bd" }}>
                    <ThumbsUp size={14} className="mt-0.5 shrink-0" /> {s}
                  </div>
                ))}
                {(result.improvements || []).map((s, i) => (
                  <div key={`i-${i}`} className="flex items-start gap-2 text-xs p-3 rounded-lg" style={{ background: "#2b2013", color: "#f2c98b" }}>
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {s}
                  </div>
                ))}
                {(result.missing_keywords || []).length > 0 && (
                  <div className="flex items-start gap-2 text-xs p-3 rounded-lg" style={{ background: "#2b2013", color: "#f2c98b" }}>
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    Missing keywords: {result.missing_keywords.join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} color={C.amber} />
            <h3 className="font-display font-bold text-base" style={{ color: C.text }}>ATS Optimization Guidelines</h3>
          </div>
          <p className="text-xs mb-5" style={{ color: C.muted }}>Follow these tips to boost your automated resume parsing score.</p>
          <div className="space-y-4">
            {GUIDELINES.map((g, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={16} color={C.green} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold mb-0.5" style={{ color: C.text }}>{g.title}</p>
                  <p className="text-[11px]" style={{ color: C.muted, lineHeight: 1.5 }}>{g.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
