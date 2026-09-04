import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, TrendingUp, Clock, BookOpen,
  ChevronDown, ChevronUp, Award, AlertTriangle, Zap,
} from "lucide-react";
import { C } from "../lib/theme";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const ALL_SKILLS = [
  { id: "python",   name: "Python & DSA",              defaultPct: 90, tag: "PYTHON",   icon: "🐍" },
  { id: "sql",      name: "SQL & Database",             defaultPct: 85, tag: "SQL",      icon: "🗄️" },
  { id: "frontend", name: "React & Web Frontend",       defaultPct: 80, tag: "FRONTEND", icon: "⚛️" },
  { id: "ml",       name: "Machine Learning & AI",      defaultPct: 70, tag: "AI/ML",    icon: "🤖" },
  { id: "java",     name: "Java & OOP",                 defaultPct: 50, tag: "JAVA",     icon: "☕" },
  { id: "system",   name: "System Design",              defaultPct: 45, tag: "DSA",      icon: "🏗️" },
  { id: "cloud",    name: "Cloud & DevOps",             defaultPct: 30, tag: "CLOUD",    icon: "☁️" },
  { id: "comm",     name: "Communication & Aptitude",   defaultPct: 60, tag: "APTITUDE", icon: "💬" },
];

const ROLES = {
  "Software Engineer (SDE)": {
    color: C.blue2,
    weights: { python: 90, sql: 70, frontend: 50, ml: 35, java: 80, system: 80, cloud: 60, comm: 70 },
    tips: {
      python:   "DSA coding rounds in Python/Java are the #1 filter at Tier-1 companies.",
      sql:      "DB design and query optimisation show up in almost every backend round.",
      frontend: "Full-stack SDE roles expect basic React knowledge.",
      ml:       "Good to have for product companies like Google, Meta.",
      java:     "OOP design patterns (SOLID, Factory, Observer) are interview staples.",
      system:   "HLD/LLD rounds start at SDE-2 but appear in SDE-1 at top firms.",
      cloud:    "Production awareness — Docker, CI/CD — expected by mid-level.",
      comm:     "Aptitude + group discussion rounds are standard in mass recruitment.",
    },
  },
  "Data Scientist": {
    color: C.purple,
    weights: { python: 88, sql: 80, frontend: 25, ml: 95, java: 30, system: 55, cloud: 65, comm: 72 },
    tips: {
      python:   "Pandas, NumPy, Scikit-learn are daily tools — must be fluent.",
      sql:      "Complex queries, window functions, CTEs used in every data pipeline.",
      frontend: "Streamlit/Dash dashboards help, but full frontend is not expected.",
      ml:       "This IS the role — supervised, unsupervised, evaluation metrics, feature eng.",
      java:     "Rarely needed; Python dominates the data science ecosystem.",
      system:   "ML system design (feature stores, model serving) is an emerging interview topic.",
      cloud:    "Model deployment on AWS SageMaker/GCP Vertex AI is now expected.",
      comm:     "Translating insights to non-technical stakeholders is a core skill.",
    },
  },
  "Backend Developer": {
    color: C.green,
    weights: { python: 80, sql: 88, frontend: 35, ml: 28, java: 82, system: 88, cloud: 78, comm: 65 },
    tips: {
      python:   "FastAPI/Flask or Node.js backend development; scripting and automation.",
      sql:      "Schema design, indexing strategies, transactions, and query tuning.",
      frontend: "Basic API consumption knowledge; REST and GraphQL fluency.",
      ml:       "Nice to have but not core unless it's an AI-product backend.",
      java:     "Spring Boot, microservices, and REST APIs — especially at service companies.",
      system:   "High-traffic system design is the most heavily tested skill at senior levels.",
      cloud:    "Deploy, scale, and monitor services on AWS/GCP — Docker + K8s basics.",
      comm:     "Translating product requirements into technical specifications.",
    },
  },
  "Full Stack Developer": {
    color: C.amber,
    weights: { python: 75, sql: 75, frontend: 88, ml: 22, java: 58, system: 75, cloud: 72, comm: 65 },
    tips: {
      python:   "Backend REST APIs, data processing scripts, ORM queries.",
      sql:      "Relational + NoSQL (MongoDB); schema design for application data.",
      frontend: "Core of the frontend half — React, state management, performance.",
      ml:       "Rarely required unless the company builds AI-powered products.",
      java:     "Helpful if the backend stack is Java/Spring; otherwise optional.",
      system:   "End-to-end system architecture connecting frontend, backend, and DB.",
      cloud:    "CI/CD pipelines, Docker containers, basic cloud deployment.",
      comm:     "Cross-functional collaboration with designers and product managers.",
    },
  },
  "Data Analyst": {
    color: C.red,
    weights: { python: 72, sql: 95, frontend: 22, ml: 62, java: 22, system: 38, cloud: 52, comm: 82 },
    tips: {
      python:   "Pandas for data wrangling, Matplotlib/Seaborn for visualisation.",
      sql:      "The single most tested skill — complex joins, subqueries, aggregations.",
      frontend: "Tableau/Power BI dashboards count; web frontend not required.",
      ml:       "Regression, classification for predictive analytics; not deep ML.",
      java:     "Almost never needed for analyst roles.",
      system:   "Data pipeline design (ETL/ELT) is increasingly relevant.",
      cloud:    "BigQuery, Redshift, Snowflake — cloud data warehouses are standard.",
      comm:     "Storytelling with data is the primary value-add of an analyst.",
    },
  },
  "ML Engineer": {
    color: "#14c8c8",
    weights: { python: 92, sql: 65, frontend: 28, ml: 88, java: 35, system: 78, cloud: 85, comm: 62 },
    tips: {
      python:   "PyTorch/TensorFlow + Python is the ML engineering stack baseline.",
      sql:      "Feature extraction from databases; data warehouse querying.",
      frontend: "Model demo UIs (Gradio/Streamlit) occasionally needed.",
      ml:       "Must know training pipelines, evaluation, hyperparameter tuning.",
      java:     "Rarely relevant in the Python-dominated ML ecosystem.",
      system:   "MLOps and model serving architecture is the core of this role.",
      cloud:    "AWS SageMaker, GCP Vertex AI, or Azure ML are daily tools.",
      comm:     "Communicating model performance to product and business teams.",
    },
  },
};

// Hours needed to close a 10% gap (rough estimates per skill)
const HOURS_PER_10PCT = {
  python: 8, sql: 6, frontend: 10, ml: 12, java: 8, system: 14, cloud: 9, comm: 5,
};

// ─────────────────────────────────────────────────────────────────────────────
// RADAR CHART (pure SVG)
// ─────────────────────────────────────────────────────────────────────────────
function RadarChart({ skills, current, targets, color }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r  = 80;
  const n  = skills.length;

  const angle  = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point  = (i, pct) => {
    const a = angle(i);
    const d = (pct / 100) * r;
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
  };
  const polyPts = (pcts) => pcts.map((p, i) => point(i, p).join(",")).join(" ");
  const rings   = [20, 40, 60, 80, 100];

  return (
    <svg width={size} height={size} style={{ overflow: "visible" }}>
      {/* Grid rings */}
      {rings.map((ring) => (
        <polygon
          key={ring}
          points={skills.map((_, i) => point(i, ring).join(",")).join(" ")}
          fill="none"
          stroke={C.border}
          strokeWidth="1"
        />
      ))}
      {/* Axes */}
      {skills.map((_, i) => {
        const [x, y] = point(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={C.border} strokeWidth="1" />;
      })}
      {/* Target area */}
      <polygon
        points={polyPts(skills.map((s) => targets[s.id]))}
        fill={`${color}22`}
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />
      {/* Current area */}
      <polygon
        points={polyPts(skills.map((s) => current[s.id]))}
        fill={`${C.blue2}33`}
        stroke={C.blue2}
        strokeWidth="2"
      />
      {/* Dots */}
      {skills.map((s, i) => {
        const [x, y] = point(i, current[s.id]);
        return <circle key={i} cx={x} cy={y} r={4} fill={C.blue2} />;
      })}
      {/* Labels */}
      {skills.map((s, i) => {
        const [x, y] = point(i, 118);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fill={C.muted}
          >
            {s.icon}
          </text>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function SkillGap() {
  const navigate  = useNavigate();
  const [role, setRole]       = useState("Software Engineer (SDE)");
  const [levels, setLevels]   = useState(
    Object.fromEntries(ALL_SKILLS.map((s) => [s.id, s.defaultPct]))
  );
  const [expanded, setExpanded] = useState(null);
  const [showRadar, setShowRadar] = useState(true);

  const roleData = ROLES[role];

  // Compute gap stats
  const gaps = useMemo(() => {
    return ALL_SKILLS.map((skill) => {
      const current  = levels[skill.id];
      const target   = roleData.weights[skill.id];
      const gap      = Math.max(0, target - current);
      const hoursNeeded = Math.round((gap / 10) * (HOURS_PER_10PCT[skill.id] || 8));
      let priority;
      if (current >= target)    priority = "on-target";
      else if (gap >= 40)       priority = "critical";
      else if (gap >= 20)       priority = "high";
      else                      priority = "medium";
      return { ...skill, current, target, gap, hoursNeeded, priority };
    }).sort((a, b) => {
      const o = { critical: 0, high: 1, medium: 2, "on-target": 3 };
      return o[a.priority] - o[b.priority];
    });
  }, [levels, roleData]);

  // Placement readiness score (weighted average: how close you are to target across all skills)
  const readiness = useMemo(() => {
    const totalWeight = Object.values(roleData.weights).reduce((a, b) => a + b, 0);
    const score = ALL_SKILLS.reduce((acc, s) => {
      const cur = Math.min(levels[s.id], roleData.weights[s.id]);
      return acc + (cur / roleData.weights[s.id]) * roleData.weights[s.id];
    }, 0);
    return Math.round((score / totalWeight) * 100);
  }, [levels, roleData]);

  const totalHours = gaps.filter((g) => g.priority !== "on-target")
                         .reduce((acc, g) => acc + g.hoursNeeded, 0);
  const criticalCount = gaps.filter((g) => g.priority === "critical").length;
  const onTargetCount = gaps.filter((g) => g.priority === "on-target").length;

  const readinessColor = readiness >= 80 ? C.green : readiness >= 60 ? C.amber : C.red;

  const PRIORITY = {
    "critical":  { label: "Critical Gap",    color: "#f28b8b", bg: "#2b1313" },
    "high":      { label: "High Priority",   color: C.amber,   bg: "#2b2013" },
    "medium":    { label: "Medium Priority", color: C.blue2,   bg: "#131a2b" },
    "on-target": { label: "On Target",       color: C.green,   bg: "#132a22" },
  };

  return (
    <div className="p-6 max-w-4xl">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>
          Skill Gap Analyzer
        </h1>
        <p className="text-sm" style={{ color: C.muted }}>
          Adjust your skill levels below, pick a target role, and see exactly what to work on first.
        </p>
      </div>

      {/* ── Role selector ───────────────────────────────────────────────── */}
      <div className="rounded-2xl p-4 mb-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <p className="text-xs font-semibold mb-3" style={{ color: C.muted }}>🎯 Target Role</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(ROLES).map(([r, d]) => {
            const active = r === role;
            return (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="text-xs font-semibold px-3 py-2 rounded-lg transition-all"
                style={{
                  background: active ? d.color : "#1c2438",
                  color: active ? "#fff" : C.muted,
                  border: `1px solid ${active ? d.color : C.border}`,
                }}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Dashboard row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard
          label="Placement Readiness"
          value={`${readiness}%`}
          color={readinessColor}
          sub={readiness >= 80 ? "Interview ready" : readiness >= 60 ? "Getting there" : "Needs work"}
        />
        <StatCard label="Skills on Target"  value={`${onTargetCount}/${ALL_SKILLS.length}`} color={C.green}  sub="Already there" />
        <StatCard label="Critical Gaps"     value={criticalCount}    color="#f28b8b" sub="Fix these first" />
        <StatCard label="Study Hours Left"  value={`~${totalHours}h`} color={C.blue2} sub="To reach targets" />
      </div>

      {/* ── Two-column layout: sliders + radar ─────────────────────────── */}
      <div className="grid lg:grid-cols-[1fr_auto] gap-5 mb-5">

        {/* Skill sliders */}
        <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <p className="text-xs font-semibold mb-4" style={{ color: C.muted }}>
            📊 Your Current Skill Levels — drag sliders to update
          </p>
          <div className="space-y-4">
            {ALL_SKILLS.map((skill) => {
              const cur = levels[skill.id];
              const tgt = roleData.weights[skill.id];
              const gap = Math.max(0, tgt - cur);
              const barColor = cur >= tgt ? C.green : gap >= 40 ? "#f28b8b" : gap >= 20 ? C.amber : C.blue2;
              return (
                <div key={skill.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: C.text }}>
                      <span>{skill.icon}</span> {skill.name}
                    </span>
                    <div className="flex items-center gap-2 text-[11px]" style={{ color: C.muted }}>
                      <span>Target: <b style={{ color: C.text }}>{tgt}%</b></span>
                      <span
                        className="font-bold px-1.5 py-0.5 rounded text-[10px]"
                        style={{ color: barColor, background: `${barColor}22` }}
                      >
                        {cur}%
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    {/* Track */}
                    <div className="h-2 rounded-full relative" style={{ background: "#1c2438" }}>
                      {/* Fill */}
                      <div
                        className="absolute top-0 left-0 h-full rounded-full transition-all"
                        style={{ width: `${cur}%`, background: barColor }}
                      />
                      {/* Target marker */}
                      <div
                        className="absolute top-0 h-full w-0.5"
                        style={{ left: `${tgt}%`, background: "#ffffff55", transform: "translateX(-50%)" }}
                      />
                    </div>
                    {/* Range input overlaid */}
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={cur}
                      onChange={(e) => setLevels((prev) => ({ ...prev, [skill.id]: Number(e.target.value) }))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
                      style={{ margin: 0 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Radar chart */}
        <div
          className="rounded-2xl p-5 flex flex-col items-center justify-center"
          style={{ background: C.card, border: `1px solid ${C.border}`, minWidth: 260 }}
        >
          <p className="text-xs font-semibold mb-3 self-start" style={{ color: C.muted }}>
            🕸️ Skill Radar
          </p>
          <RadarChart
            skills={ALL_SKILLS}
            current={levels}
            targets={roleData.weights}
            color={roleData.color}
          />
          <div className="flex gap-4 mt-3 text-[10px]" style={{ color: C.muted }}>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 rounded inline-block" style={{ background: C.blue2 }} /> You
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 rounded inline-block border-dashed" style={{ border: `1px dashed ${roleData.color}` }} /> Target
            </span>
          </div>
        </div>
      </div>

      {/* ── Gap cards with accordion ─────────────────────────────────────── */}
      <div className="rounded-2xl p-5 mb-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <p className="text-xs font-semibold mb-4" style={{ color: C.muted }}>📋 Gap Breakdown — click any skill for details</p>
        <div className="space-y-2">
          {gaps.map((gap) => {
            const meta = PRIORITY[gap.priority];
            const open = expanded === gap.id;
            return (
              <div
                key={gap.id}
                className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${open ? meta.color + "55" : C.border}` }}
              >
                {/* Row */}
                <button
                  onClick={() => setExpanded(open ? null : gap.id)}
                  className="w-full flex items-center gap-3 p-3 text-left"
                  style={{ background: open ? meta.bg : "#1c2438" }}
                >
                  <span className="text-base">{gap.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold truncate" style={{ color: C.text }}>{gap.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: meta.bg, color: meta.color }}>
                        {meta.label}
                      </span>
                    </div>
                    {/* Mini bar */}
                    <div className="h-1.5 rounded-full w-48 relative" style={{ background: "#111827" }}>
                      <div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{ width: `${gap.current}%`, background: meta.color }}
                      />
                      <div
                        className="absolute top-0 h-full w-px"
                        style={{ left: `${gap.target}%`, background: "#ffffff66" }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0 mr-2">
                    <p className="text-[11px] font-bold" style={{ color: C.text }}>{gap.current}% → {gap.target}%</p>
                    {gap.gap > 0 && (
                      <p className="text-[10px]" style={{ color: meta.color }}>−{gap.gap}%</p>
                    )}
                  </div>
                  {open ? <ChevronUp size={14} color={C.muted} /> : <ChevronDown size={14} color={C.muted} />}
                </button>

                {/* Accordion body */}
                {open && (
                  <div className="px-4 pb-4 pt-2" style={{ background: meta.bg }}>
                    <p className="text-xs mb-3" style={{ color: C.muted, lineHeight: 1.6 }}>
                      {roleData.tips[gap.id]}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] mb-3" style={{ color: C.muted }}>
                      {gap.gap > 0 && (
                        <>
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> ~{gap.hoursNeeded}h to close this gap
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp size={11} /> {gap.gap}% improvement needed
                          </span>
                        </>
                      )}
                    </div>
                    {gap.priority !== "on-target" ? (
                      <button
                        onClick={() => navigate("/courses/learn", { state: { tag: gap.tag } })}
                        className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-2 rounded-lg"
                        style={{ background: C.blue2 }}
                      >
                        <BookOpen size={12} /> Start {gap.name} Course <ArrowRight size={11} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.green }}>
                        <CheckCircle2 size={13} /> You already meet the target for {role}.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Learning Roadmap ────────────────────────────────────────────── */}
      {gaps.filter((g) => g.priority !== "on-target").length > 0 && (
        <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={15} color={C.amber} />
            <p className="text-sm font-semibold" style={{ color: C.text }}>Your Recommended Learning Roadmap</p>
          </div>
          <div className="space-y-3">
            {gaps
              .filter((g) => g.priority !== "on-target")
              .slice(0, 5)
              .map((gap, i) => {
                const meta = PRIORITY[gap.priority];
                return (
                  <div key={gap.id} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}44` }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{ color: C.text }}>{gap.name}</p>
                      <p className="text-[10px]" style={{ color: C.muted }}>
                        Close {gap.gap}% gap · ~{gap.hoursNeeded}h
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/courses/learn", { state: { tag: gap.tag } })}
                      className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg"
                      style={{ background: "#1c2438", color: C.blue2 }}
                    >
                      Start →
                    </button>
                  </div>
                );
              })}
          </div>
          <div
            className="mt-4 flex items-start gap-2 text-[11px] p-3 rounded-xl"
            style={{ background: "#1c2438", color: C.muted }}
          >
            <Award size={13} className="mt-0.5 shrink-0" color={C.amber} />
            Complete all {gaps.filter((g) => g.priority !== "on-target").length} courses above ({totalHours}h total) to reach{" "}
            <b style={{ color: C.text }}>&nbsp;placement readiness for {role}</b>.
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, sub }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
      <p className="text-[10px] font-semibold mb-1" style={{ color: C.muted }}>{label}</p>
      <p className="text-xl font-display font-extrabold" style={{ color }}>{value}</p>
      <p className="text-[10px] mt-0.5" style={{ color: C.muted }}>{sub}</p>
    </div>
  );
}