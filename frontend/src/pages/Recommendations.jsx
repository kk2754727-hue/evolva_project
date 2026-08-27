import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Loader2, AlertTriangle, Clock, ArrowRight, Target } from "lucide-react";
import { C } from "../lib/theme";
import { SKILLS } from "../data/mock";
import { recommendCourses } from "../lib/api";

const ALL_SKILL_NAMES = SKILLS.map((s) => s.name);

export default function Recommendations() {
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState(ALL_SKILL_NAMES.slice(0, 3));
  const [interests, setInterests] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState(null);

  const toggleSkill = (name) => {
    setSelectedSkills((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const getRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await recommendCourses({
        skills: selectedSkills,
        interests: interests
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        target_role: targetRole.trim() || undefined,
      });
      setCourses(result.courses || []);
    } catch (err) {
      setError(err.message || "Something went wrong generating recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const openCourse = (course) => {
    navigate("/recommendations/course", { state: { course } });
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>AI Course Recommendations</h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>
        Tell Evolva what you know and where you're headed — it'll generate a personalized course list, full lesson content, and a graded assessment for each one.
      </p>

      <div className="rounded-2xl p-6 mb-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <p className="text-xs font-semibold mb-2" style={{ color: C.muted }}>Your current skills</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {ALL_SKILL_NAMES.map((name) => (
            <button
              key={name}
              onClick={() => toggleSkill(name)}
              className="text-xs font-semibold px-3 py-2 rounded-lg"
              style={{
                background: selectedSkills.includes(name) ? C.blue2 : "#1c2438",
                color: selectedSkills.includes(name) ? "#fff" : C.muted,
                border: `1px solid ${selectedSkills.includes(name) ? C.blue2 : C.border}`,
              }}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: C.muted }}>Interests (comma-separated, optional)</p>
            <input
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. backend systems, data pipelines"
              className="w-full rounded-xl p-2.5 text-sm"
              style={{ background: "#1c2438", color: C.text, border: `1px solid ${C.border}` }}
            />
          </div>
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: C.muted }}>Target role (optional)</p>
            <input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Backend Developer"
              className="w-full rounded-xl p-2.5 text-sm"
              style={{ background: "#1c2438", color: C.text, border: `1px solid ${C.border}` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 text-xs p-3 rounded-lg" style={{ background: "#2b1313", color: "#f28b8b" }}>
            <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        <button
          onClick={getRecommendations}
          disabled={loading || (selectedSkills.length === 0 && !interests.trim() && !targetRole.trim())}
          className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl disabled:opacity-50"
          style={{ background: C.blue2 }}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {loading ? "Thinking..." : "Get AI Recommendations"}
        </button>
      </div>

      {courses && courses.length === 0 && (
        <p className="text-sm" style={{ color: C.muted }}>No recommendations came back — try adjusting your skills or target role.</p>
      )}

      {courses && courses.length > 0 && (
        <div className="grid md:grid-cols-2 gap-5">
          {courses.map((c, i) => (
            <div key={i} className="rounded-2xl p-5 flex flex-col" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-1 rounded-md" style={{ background: "#1c2438", color: C.blue2 }}>{c.tag}</span>
                <span className="text-[10px] font-bold" style={{ color: C.muted }}>{c.level}</span>
              </div>
              <h3 className="font-display font-bold text-sm mb-1.5" style={{ color: C.text }}>{c.title}</h3>
              <p className="text-xs mb-3" style={{ color: C.muted, lineHeight: 1.5 }}>{c.description}</p>
              <div className="flex items-start gap-2 text-[11px] mb-3 p-2.5 rounded-lg" style={{ background: "#1c2438", color: C.muted }}>
                <Target size={12} className="mt-0.5 shrink-0" color={C.green} />
                {c.why_recommended}
              </div>
              {c.matched_skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {c.matched_skills.map((s, si) => (
                    <span key={si} className="text-[10px] px-2 py-1 rounded-md" style={{ background: "#1c2438", color: C.muted }}>{s}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="flex items-center gap-1 text-[11px]" style={{ color: C.muted }}>
                  <Clock size={11} /> {c.estimated_hours}h
                </span>
                <button
                  onClick={() => openCourse(c)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-2 rounded-xl"
                  style={{ background: C.blue2 }}
                >
                  Open Course <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
