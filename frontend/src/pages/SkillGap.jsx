import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, TrendingUp, AlertTriangle, CheckCircle2, Target } from "lucide-react";
import { C } from "../lib/theme";
import { SKILLS } from "../data/mock";

// ─── Target proficiency per skill per role ─────────────────────────────────
// [current_needed, description]
const ROLE_TARGETS = {
  "Data Scientist": {
    "Python & DSA":           [85, "Heavy scripting, Pandas, NumPy, OOP."],
    "SQL & Database":         [80, "Complex queries, window functions, CTEs."],
    "Machine Learning & AI":  [90, "Core of the role — must know supervised, unsupervised, eval metrics."],
    "React & Web Frontend":   [30, "Nice to have for dashboards; not the focus."],
    "Cloud & DevOps":         [60, "Model deployment on AWS/GCP is expected."],
    "Java & OOP":             [40, "Less relevant; Python dominates this field."],
    "System Design":          [55, "ML system design is a growing interview topic."],
    "Communication & Aptitude":[70, "Presenting insights to non-technical stakeholders."],
  },
  "Backend Developer": {
    "Python & DSA":           [80, "Python or Node backend development skills."],
    "SQL & Database":         [85, "Schema design, indexing, transactions."],
    "Machine Learning & AI":  [30, "Nice to have but not core for backend."],
    "React & Web Frontend":   [35, "Basic understanding of API consumption."],
    "Cloud & DevOps":         [75, "Deploy and scale services on cloud."],
    "Java & OOP":             [80, "Spring Boot / microservices stack."],
    "System Design":          [85, "High-traffic system design is heavily tested."],
    "Communication & Aptitude":[65, "Translating requirements into technical design."],
  },
  "Full Stack Developer": {
    "Python & DSA":           [75, "Backend APIs, scripting."],
    "SQL & Database":         [75, "Relational + NoSQL (MongoDB)."],
    "Machine Learning & AI":  [25, "Rarely required unless AI-product company."],
    "React & Web Frontend":   [85, "Core of the frontend half of this role."],
    "Cloud & DevOps":         [70, "CI/CD, Docker, basic cloud deployment."],
    "Java & OOP":             [60, "Helpful if stack is Java-based."],
    "System Design":          [75, "End-to-end system architecture."],
    "Communication & Aptitude":[65, "Cross-functional collaboration."],
  },
  "Software Engineer (SDE)": {
    "Python & DSA":           [85, "Coding rounds test DSA through Python/Java/C++."],
    "SQL & Database":         [70, "DB design and query optimisation."],
    "Machine Learning & AI":  [35, "Good to have for product companies."],
    "React & Web Frontend":   [50, "Basic frontend for full-stack SDE roles."],
    "Cloud & DevOps":         [60, "Production awareness expected at mid-level."],
    "Java & OOP":             [80, "OOP design patterns are interview staples."],
    "System Design":          [80, "HLD/LLD rounds at Tier-1 companies."],
    "Communication & Aptitude":[70, "Aptitude rounds are standard in placements."],
  },
  "Data Analyst": {
    "Python & DSA":           [70, "Pandas, data wrangling, automation scripts."],
    "SQL & Database":         [90, "The single most important skill for this role."],
    "Machine Learning & AI":  [60, "Basic ML for predictive analytics."],
    "React & Web Frontend":   [25, "Not required."],
    "Cloud & DevOps":         [50, "Cloud data warehouses (BigQuery, Redshift)."],
    "Java & OOP":             [25, "Rarely needed."],
    "System Design":          [40, "Data pipeline design is useful."],
    "Communication & Aptitude":[80, "Translating data to business decisions."],
  },
};

const DEFAULT_ROLE = "Software Engineer (SDE)";

// Map SKILLS entries (from mock.js) to ROLE_TARGETS keys
const SKILL_ALIAS = {
  "Python & DSA":            "Python & DSA",
  "SQL & Database":          "SQL & Database",
  "React & Web Frontend":    "React & Web Frontend",
  "Machine Learning & AI":   "Machine Learning & AI",
  "Cloud & DevOps":          "Cloud & DevOps",
  "Java & OOP":              "Java & OOP",
  "System Design":           "System Design",
  "Communication & Aptitude":"Communication & Aptitude",
};

// Additional skills not in mock.js SKILLS but relevant to show as gaps
const EXTRA_SKILLS = [
  { name: "Machine Learning & AI",    pct: 0 },
  { name: "Cloud & DevOps",           pct: 0 },
  { name: "Java & OOP",               pct: 0 },
  { name: "System Design",            pct: 0 },
  { name: "Communication & Aptitude", pct: 0 },
];

// TAG for "Open course" navigation
const SKILL_TO_TAG = {
  "Python & DSA":            "PYTHON",
  "SQL & Database":          "SQL",
  "React & Web Frontend":    "FRONTEND",
  "Machine Learning & AI":   "AI/ML",
  "Cloud & DevOps":          "CLOUD",
  "Java & OOP":              "JAVA",
  "System Design":           "DSA",
  "Communication & Aptitude":"APTITUDE",
};

const PRIORITY_META = {
  "Critical":   { color: "#f28b8b", bg: "#2b1313", label: "Critical Gap" },
  "High":       { color: C.amber,   bg: "#2b2013", label: "High Priority" },
  "Medium":     { color: C.blue2,   bg: "#131a2b", label: "Medium Priority" },
  "On target":  { color: C.green,   bg: "#132a22", label: "On Target" },
};

function getPriority(current, target) {
  const gap = target - current;
  if (current >= target)    return "On target";
  if (gap >= 40)            return "Critical";
  if (gap >= 20)            return "High";
  return "Medium";
}

export default function SkillGap() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(DEFAULT_ROLE);

  // Merge SKILLS from mock.js + extra skills not in the list
  const allSkills = useMemo(() => {
    const base = SKILLS.map((s) => ({ name: s.name, pct: s.pct }));
    const baseNames = new Set(base.map((s) => s.name));
    const extras = EXTRA_SKILLS.filter((e) => !baseNames.has(e.name));
    return [...base, ...extras];
  }, []);

  const roleTargets = ROLE_TARGETS[selectedRole] || ROLE_TARGETS[DEFAULT_ROLE];

  const gaps = useMemo(() => {
    return allSkills
      .map((skill) => {
        const aliasedName = SKILL_ALIAS[skill.name] || skill.name;
        const [target, reason] = roleTargets[aliasedName] || [50, "Baseline competency expected."];
        const priority = getPriority(skill.pct, target);
        return {
          name: skill.name,
          current: skill.pct,
          target,
          priority,
          reason,
          tag: SKILL_TO_TAG[aliasedName] || null,
        };
      })
      .sort((a, b) => {
        const order = { Critical: 0, High: 1, Medium: 2, "On target": 3 };
        return order[a.priority] - order[b.priority];
      });
  }, [allSkills, roleTargets]);

  const criticalCount = gaps.filter((g) => g.priority === "Critical").length;
  const highCount     = gaps.filter((g) => g.priority === "High").length;
  const onTarget      = gaps.filter((g) => g.priority === "On target").length;

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>
        Skill Gap Analysis
      </h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>
        See exactly where you stand against the skills required for your target role — and jump straight to the course that closes each gap.
      </p>

      {/* Role selector */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <p className="text-xs font-semibold mb-2" style={{ color: C.muted }}>Select your target role</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(ROLE_TARGETS).map((role) => {
            const active = role === selectedRole;
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className="text-xs font-semibold px-3 py-2 rounded-lg"
                style={{
                  background: active ? C.blue2 : "#1c2438",
                  color: active ? "#fff" : C.muted,
                  border: `1px solid ${active ? C.blue2 : C.border}`,
                }}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 mb-6">
        <SummaryPill color="#f28b8b" bg="#2b1313" count={criticalCount} label="Critical Gaps" />
        <SummaryPill color={C.amber}  bg="#2b2013" count={highCount}     label="High Priority" />
        <SummaryPill color={C.green}  bg="#132a22" count={onTarget}      label="On Target" />
      </div>

      {/* Gap cards */}
      <div className="space-y-3">
        {gaps.map((gap) => {
          const meta    = PRIORITY_META[gap.priority];
          const gapPct  = Math.max(0, gap.target - gap.current);
          const barPct  = Math.min(100, gap.current);
          const tgtPct  = Math.min(100, gap.target);

          return (
            <div
              key={gap.name}
              className="rounded-2xl p-5"
              style={{ background: C.card, border: `1px solid ${C.border}` }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>{gap.name}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: C.muted }}>{gap.reason}</p>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-1 rounded-md ml-3 whitespace-nowrap"
                  style={{ background: meta.bg, color: meta.color }}
                >
                  {meta.label}
                </span>
              </div>

              {/* Progress bar */}
              <div className="relative h-2 rounded-full mb-2" style={{ background: "#1c2438" }}>
                {/* current */}
                <div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ width: `${barPct}%`, background: meta.color, transition: "width 0.4s" }}
                />
                {/* target marker */}
                <div
                  className="absolute top-0 h-full w-0.5 rounded-full"
                  style={{ left: `${tgtPct}%`, background: "#fff4", transform: "translateX(-50%)" }}
                />
              </div>

              {/* Labels */}
              <div className="flex justify-between text-[10px] mb-3" style={{ color: C.muted }}>
                <span>You: <b style={{ color: C.text }}>{gap.current}%</b></span>
                {gapPct > 0 && <span style={{ color: meta.color }}>Gap: {gapPct}%</span>}
                <span>Target: <b style={{ color: C.text }}>{gap.target}%</b></span>
              </div>

              {/* CTA */}
              {gap.priority !== "On target" && gap.tag ? (
                <button
                  onClick={() => navigate("/courses/learn", { state: { tag: gap.tag } })}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-2 rounded-xl"
                  style={{ background: C.blue2 }}
                >
                  Start Course <ArrowRight size={12} />
                </button>
              ) : gap.priority === "On target" ? (
                <div className="flex items-center gap-1.5 text-[11px]" style={{ color: C.green }}>
                  <CheckCircle2 size={13} /> You meet the target for this role.
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SummaryPill({ color, bg, count, label }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
      style={{ background: bg, color }}
    >
      <span className="text-sm font-extrabold">{count}</span> {label}
    </div>
  );
}