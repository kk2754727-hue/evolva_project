import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { C } from "../lib/theme";
import { Pill } from "../components/ui";
import { SKILLS } from "../data/mock";
import { analyzeSkillGap } from "../lib/api";

const PRIORITY_COLOR = {
  "High priority": C.red,
  "Medium priority": C.amber,
  "Low priority": C.blue2,
  "On target": C.green,
};

export default function SkillGap() {
  const navigate = useNavigate();
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gaps, setGaps] = useState(null);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeSkillGap({
        current_skills: SKILLS.map((s) => ({ name: s.name, pct: s.pct })),
        target_role: targetRole.trim() || undefined,
      });
      setGaps(result.gaps || []);
    } catch (err) {
      setError(err.message || "Something went wrong analyzing your skill gaps.");
    } finally {
      setLoading(false);
    }
  };

  const openCourse = (gap) => {
    navigate("/recommendations/course", {
      state: {
        course: {
          title: gap.recommended_course,
          tag: "Skill Gap",
          level: "Intermediate",
          description: gap.reason,
        },
      },
    });
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>Skill Gap Analysis</h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>
        Compares your current skill levels against what a target role actually needs, using your local LLM.
      </p>

      <div className="rounded-2xl p-5 mb-6 flex items-center gap-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <input
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="Target role (e.g. Backend Developer) — optional"
          className="flex-1 rounded-xl p-2.5 text-sm"
          style={{ background: "#1c2438", color: C.text, border: `1px solid ${C.border}` }}
        />
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-xl disabled:opacity-50 whitespace-nowrap"
          style={{ background: C.blue2 }}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {loading ? "Analyzing..." : "Analyze Gaps"}
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 text-xs p-3 rounded-lg" style={{ background: "#2b1313", color: "#f28b8b" }}>
          <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      {!gaps && !loading && !error && (
        <p className="text-sm" style={{ color: C.muted }}>
          Click "Analyze Gaps" to benchmark your current skills ({SKILLS.map((s) => s.name).join(", ")}) against a target role.
        </p>
      )}

      {gaps && (
        <div className="space-y-4">
          {gaps.map((g, i) => {
            const color = PRIORITY_COLOR[g.priority] || C.blue2;
            return (
              <div key={i} className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold" style={{ color: C.text }}>{g.name}</span>
                  <Pill color={color}>{g.priority}</Pill>
                </div>
                <div className="relative w-full h-2.5 rounded-full mb-2" style={{ background: "#1e2536" }}>
                  <div className="h-2.5 rounded-full" style={{ width: `${g.current}%`, background: color }} />
                  <div className="absolute top-0 h-2.5 w-0.5" style={{ left: `${g.target}%`, background: "#fff" }} />
                </div>
                <div className="flex items-center justify-between text-[11px] mb-2" style={{ color: C.muted }}>
                  <span>
                    Current: <b style={{ color: C.text }}>{g.current}%</b> &middot; Target: <b style={{ color: C.text }}>{g.target}%</b>
                  </span>
                </div>
                {g.reason && <p className="text-[11px] mb-2" style={{ color: C.muted }}>{g.reason}</p>}
                {g.recommended_course && g.priority !== "On target" && (
                  <button
                    onClick={() => openCourse(g)}
                    className="flex items-center gap-1.5 text-xs font-semibold"
                    style={{ color: C.blue2 }}
                  >
                    Start "{g.recommended_course}" <ArrowRight size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}