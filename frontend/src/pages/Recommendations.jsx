import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, Clock, ArrowRight, Target, BookOpen, Star,
  CheckCircle2, TrendingUp, Users, BarChart3, Zap, Search,
} from "lucide-react";
import { C } from "../lib/theme";
import { COURSES } from "../data/mock";

// ─────────────────────────────────────────────────────────────────────────────
// RECOMMENDATION ENGINE DATA
// ─────────────────────────────────────────────────────────────────────────────

// How much each role values each course tag (0–10)
const ROLE_WEIGHTS = {
  "Software Engineer (SDE)": { PYTHON: 9, DSA: 10, SQL: 7, JAVA: 8, "AI/ML": 4, CLOUD: 6, FRONTEND: 5, APTITUDE: 8 },
  "Data Scientist":          { PYTHON: 9, DSA: 5,  SQL: 8, JAVA: 2, "AI/ML": 10,CLOUD: 6, FRONTEND: 2, APTITUDE: 5 },
  "Backend Developer":       { PYTHON: 8, DSA: 7,  SQL: 9, JAVA: 9, "AI/ML": 3, CLOUD: 8, FRONTEND: 3, APTITUDE: 6 },
  "Full Stack Developer":    { PYTHON: 7, DSA: 6,  SQL: 7, JAVA: 5, "AI/ML": 2, CLOUD: 7, FRONTEND: 9, APTITUDE: 5 },
  "Data Analyst":            { PYTHON: 7, DSA: 3,  SQL: 10,JAVA: 2, "AI/ML": 6, CLOUD: 5, FRONTEND: 2, APTITUDE: 8 },
  "ML Engineer":             { PYTHON: 10,DSA: 6,  SQL: 5, JAVA: 3, "AI/ML": 9, CLOUD: 9, FRONTEND: 2, APTITUDE: 4 },
  "Frontend Developer":      { PYTHON: 4, DSA: 7,  SQL: 4, JAVA: 3, "AI/ML": 2, CLOUD: 5, FRONTEND: 10,APTITUDE: 6 },
};

// User skill level tags → course tags they already partially know
const KNOWN_TAGS = {
  "Python":          ["PYTHON", "AI/ML"],
  "DSA":             ["DSA"],
  "Java":            ["JAVA"],
  "SQL":             ["SQL"],
  "Machine Learning":["AI/ML"],
  "AI":              ["AI/ML"],
  "Cloud":           ["CLOUD"],
  "AWS":             ["CLOUD"],
  "React":           ["FRONTEND"],
  "Frontend":        ["FRONTEND"],
  "Aptitude":        ["APTITUDE"],
  "Communication":   ["APTITUDE"],
};

// Rich "why this is recommended" copy per tag per role
const WHY = {
  "Software Engineer (SDE)": {
    DSA:       "DSA is the #1 skill tested in every Tier-1 coding round. Without it, you won't clear the first filter.",
    PYTHON:    "Python proficiency means faster DSA implementation and automation scripts — tested in every tech interview.",
    JAVA:      "Java OOP + Collections are the backbone of TCS, Infosys, and Wipro technical interviews.",
    SQL:       "DB design and query optimisation appear in almost every backend and full-stack interview loop.",
    APTITUDE:  "Quantitative aptitude + logical reasoning are tested in mass-placement rounds before tech interviews.",
    CLOUD:     "Production awareness (Docker, CI/CD, basic AWS) is expected at mid-level SDE and above.",
    FRONTEND:  "Full-stack SDE roles at product companies expect React knowledge in addition to backend.",
    "AI/ML":   "AI/ML familiarity gives you an edge at product companies like Google, Meta, and Amazon.",
  },
  "Data Scientist": {
    "AI/ML":   "This IS the job. Supervised, unsupervised, evaluation metrics, feature engineering — must know all.",
    PYTHON:    "Pandas, NumPy, Scikit-learn are used daily. Python fluency is non-negotiable.",
    SQL:       "Every data scientist extracts data via SQL. Complex joins and window functions are interview staples.",
    CLOUD:     "Model deployment on AWS SageMaker / GCP Vertex AI is increasingly expected even at junior level.",
    APTITUDE:  "Statistical reasoning and probability are tested in data science interviews at all levels.",
    DSA:       "Basic algorithmic thinking is expected, though less heavily tested than in SDE roles.",
    FRONTEND:  "Streamlit / Gradio dashboards are a bonus; full frontend knowledge not required.",
    JAVA:      "Rarely needed in Python-dominated data science roles.",
  },
  "Backend Developer": {
    SQL:       "Schema design, indexing, and query tuning are the most heavily tested backend skills.",
    JAVA:      "Spring Boot microservices and REST APIs dominate backend interviews at service companies.",
    CLOUD:     "Deploying and scaling services on AWS/GCP with Docker and Kubernetes is expected.",
    PYTHON:    "FastAPI/Flask backend APIs and scripting are core tools for Python backend engineers.",
    DSA:       "Graph and tree problems appear in backend-focused DSA rounds.",
    APTITUDE:  "Logical reasoning rounds still appear in mass-hiring backend interviews.",
    FRONTEND:  "API design knowledge helps with REST/GraphQL contracts with frontend teams.",
    "AI/ML":   "Nice to have for AI-product backends, but not core for most roles.",
  },
  "Full Stack Developer": {
    FRONTEND:  "React, state management, and component architecture are the core of your frontend work.",
    SQL:       "You'll design the DB schema and write queries — both relational and NoSQL.",
    PYTHON:    "Backend REST APIs and scripting. Python or Node.js is expected on the server side.",
    CLOUD:     "CI/CD pipelines, Docker containers, and cloud deployment are now standard for full-stack devs.",
    DSA:       "Full-stack roles at product companies still include a DSA coding round.",
    JAVA:      "Relevant if the backend stack is Java/Spring Boot; otherwise secondary.",
    APTITUDE:  "Aptitude rounds appear in campus placements regardless of role.",
    "AI/ML":   "Only relevant if you're building AI-powered product features.",
  },
  "Data Analyst": {
    SQL:       "The single most important skill — you'll write complex queries every day. Master this first.",
    PYTHON:    "Pandas data wrangling, automation scripts, and Matplotlib/Seaborn for visualisation.",
    "AI/ML":   "Regression and classification for predictive analytics — not deep ML, but basics are expected.",
    APTITUDE:  "Storytelling with data and stakeholder communication is the primary analyst value-add.",
    CLOUD:     "BigQuery, Redshift, and Snowflake are standard cloud data warehouse tools.",
    DSA:       "Rarely tested at the same depth as SDE roles, but basic algorithmic thinking helps.",
    JAVA:      "Almost never required for analyst roles.",
    FRONTEND:  "Tableau/Power BI count here — web frontend is not the focus.",
  },
  "ML Engineer": {
    PYTHON:    "PyTorch/TensorFlow + Python is the entire ML engineering stack — non-negotiable.",
    CLOUD:     "AWS SageMaker, GCP Vertex AI, and Azure ML are the daily deployment platforms.",
    "AI/ML":   "Model training pipelines, evaluation metrics, and hyperparameter tuning are core skills.",
    SQL:       "Feature extraction from data warehouses — SQL is a frequent part of the role.",
    DSA:       "Efficient data processing and algorithmic thinking underpin ML engineering work.",
    APTITUDE:  "Statistical and mathematical reasoning is tested in ML engineering interviews.",
    FRONTEND:  "Gradio/Streamlit for model demo UIs — occasional but not core.",
    JAVA:      "Rarely needed in the Python-dominated ML ecosystem.",
  },
  "Frontend Developer": {
    FRONTEND:  "React, hooks, state management, and production builds — this is the entire role.",
    DSA:       "Frontend-focused DSA (arrays, strings, recursion) is tested at product companies.",
    PYTHON:    "Basic scripting and tooling knowledge; not the primary language.",
    SQL:       "Understanding how APIs are backed by databases helps with API design.",
    CLOUD:     "Static hosting (Vercel, Netlify, S3+CloudFront) and CDN basics are expected.",
    APTITUDE:  "Logical reasoning and attention to detail show up in frontend interviews.",
    JAVA:      "Not relevant for frontend-focused roles.",
    "AI/ML":   "Only relevant if building AI-powered UI features.",
  },
};

// Skill proficiency chips the user can select
const SKILL_CHIPS = [
  { key: "Python",           icon: "🐍" },
  { key: "DSA",              icon: "🌲" },
  { key: "Java",             icon: "☕" },
  { key: "SQL",              icon: "🗄️" },
  { key: "React",            icon: "⚛️" },
  { key: "Machine Learning", icon: "🤖" },
  { key: "Cloud",            icon: "☁️" },
  { key: "Aptitude",         icon: "🧮" },
  { key: "Communication",    icon: "💬" },
];

const LEVEL_FILTERS = ["All Levels", "Beginner", "Intermediate", "Advanced"];

// ─────────────────────────────────────────────────────────────────────────────
// SCORING ENGINE
// ─────────────────────────────────────────────────────────────────────────────
function scoreAndRank(courses, knownSkills, role) {
  const roleWeights = ROLE_WEIGHTS[role] || {};

  // Build set of tags the user already knows
  const knownTagSet = new Set();
  for (const sk of knownSkills) {
    for (const [kw, tags] of Object.entries(KNOWN_TAGS)) {
      if (sk.toLowerCase().includes(kw.toLowerCase())) {
        tags.forEach((t) => knownTagSet.add(t));
      }
    }
  }

  return courses.map((course) => {
    const tag         = course.tag;
    const roleWeight  = (roleWeights[tag] || 3) / 10;       // 0–1
    const isGap       = !knownTagSet.has(tag);
    const gapBonus    = isGap ? 0.35 : 0;
    const rawMatch    = Math.min(1, roleWeight + gapBonus);
    const matchPct    = Math.round(rawMatch * 100);
    const whyText     = (WHY[role] || {})[tag] || "Recommended based on your target role and skill profile.";

    return {
      ...course,
      matchPct,
      isGap,
      whyText,
      roleWeight: roleWeights[tag] || 3,
    };
  }).sort((a, b) => b.matchPct - a.matchPct || b.roleWeight - a.roleWeight);
}

// ─────────────────────────────────────────────────────────────────────────────
// MATCH BADGE
// ─────────────────────────────────────────────────────────────────────────────
function MatchBadge({ pct }) {
  const color = pct >= 80 ? C.green : pct >= 60 ? C.amber : C.muted;
  return (
    <div className="flex items-center gap-1">
      <div className="w-16 h-1.5 rounded-full" style={{ background: "#1c2438" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px] font-bold" style={{ color }}>{pct}%</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COURSE CARD
// ─────────────────────────────────────────────────────────────────────────────
function CourseCard({ course, rank, onOpen }) {
  const isTop = rank <= 3;
  const matchColor = course.matchPct >= 80 ? C.green : course.matchPct >= 60 ? C.amber : C.muted;

  return (
    <div
      className="rounded-2xl p-5 flex flex-col"
      style={{
        background: C.card,
        border: `1px solid ${isTop ? C.blue2 + "44" : C.border}`,
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-2 py-1 rounded-md"
            style={{ background: "#1c2438", color: C.blue2 }}
          >
            {course.tag}
          </span>
          <span className="text-[10px] font-bold" style={{ color: C.muted }}>{course.level}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isTop && (
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1"
              style={{ background: "#1a2a1a", color: C.green }}
            >
              <Star size={9} /> Top Pick
            </span>
          )}
          {course.isGap && (
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-md"
              style={{ background: "#2b1313", color: "#f28b8b" }}
            >
              Gap
            </span>
          )}
        </div>
      </div>

      {/* Match bar */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px]" style={{ color: C.muted }}>Role match</span>
        <MatchBadge pct={course.matchPct} />
      </div>

      {/* Title + desc */}
      <h3 className="font-display font-bold text-sm mb-1.5" style={{ color: C.text }}>
        {course.title}
      </h3>
      <p className="text-xs mb-3" style={{ color: C.muted, lineHeight: 1.55 }}>
        {course.desc}
      </p>

      {/* Why recommended */}
      <div
        className="flex items-start gap-2 text-[11px] mb-4 p-2.5 rounded-lg flex-1"
        style={{ background: "#1c2438", color: C.muted }}
      >
        <Target size={11} className="mt-0.5 shrink-0" color={C.green} />
        {course.whyText}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3 text-[11px]" style={{ color: C.muted }}>
          <span className="flex items-center gap-1"><Clock size={10} /> {course.hrs}</span>
          <span className="flex items-center gap-1"><Users size={10} /> {course.students}</span>
          <span className="flex items-center gap-1">
            <Star size={10} color={C.amber} />
            <span style={{ color: C.amber }}>{course.rating}</span>
          </span>
        </div>
        <button
          onClick={onOpen}
          className="flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-2 rounded-xl"
          style={{ background: C.blue2 }}
        >
          Start <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Recommendations() {
  const navigate = useNavigate();
  const [role, setRole]           = useState("Software Engineer (SDE)");
  const [knownSkills, setKnown]   = useState(["Python", "DSA", "SQL"]);
  const [levelFilter, setLevel]   = useState("All Levels");
  const [query, setQuery]         = useState("");
  const [showAll, setShowAll]     = useState(false);

  const toggle = (chip) =>
    setKnown((prev) =>
      prev.includes(chip) ? prev.filter((s) => s !== chip) : [...prev, chip]
    );

  const ranked = useMemo(
    () => scoreAndRank(COURSES, knownSkills, role),
    [knownSkills, role]
  );

  const filtered = useMemo(() => {
    return ranked.filter((c) => {
      const levelOk = levelFilter === "All Levels" || c.level === levelFilter;
      const queryOk = !query || c.title.toLowerCase().includes(query.toLowerCase()) || c.tag.toLowerCase().includes(query.toLowerCase());
      return levelOk && queryOk;
    });
  }, [ranked, levelFilter, query]);

  const visible = showAll ? filtered : filtered.slice(0, 6);
  const topPick = filtered[0];

  return (
    <div className="p-6 max-w-5xl">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>
          Course Recommendations
        </h1>
        <p className="text-sm" style={{ color: C.muted }}>
          Tell Evolva what you know and where you want to go — it ranks every course by how much it
          closes your gap for that specific role.
        </p>
      </div>

      {/* ── Profile panel ───────────────────────────────────────────────── */}
      <div className="rounded-2xl p-5 mb-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="grid md:grid-cols-2 gap-5">
          {/* Role */}
          <div>
            <p className="text-xs font-semibold mb-3" style={{ color: C.muted }}>🎯 Target Role</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(ROLE_WEIGHTS).map((r) => {
                const active = r === role;
                return (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all"
                    style={{
                      background: active ? C.blue2 : "#1c2438",
                      color: active ? "#fff" : C.muted,
                      border: `1px solid ${active ? C.blue2 : C.border}`,
                    }}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Known skills */}
          <div>
            <p className="text-xs font-semibold mb-3" style={{ color: C.muted }}>
              ✅ Skills I already know
            </p>
            <div className="flex flex-wrap gap-2">
              {SKILL_CHIPS.map(({ key, icon }) => {
                const active = knownSkills.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggle(key)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1"
                    style={{
                      background: active ? C.green + "22" : "#1c2438",
                      color: active ? C.green : C.muted,
                      border: `1px solid ${active ? C.green + "55" : C.border}`,
                    }}
                  >
                    {active && <CheckCircle2 size={10} />}
                    {icon} {key}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Top Pick hero card ───────────────────────────────────────────── */}
      {topPick && (
        <div
          className="rounded-2xl p-5 mb-5 flex flex-col md:flex-row gap-4"
          style={{
            background: `linear-gradient(135deg, #131a29 60%, ${C.blue2}18)`,
            border: `1px solid ${C.blue2}55`,
          }}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={13} color={C.amber} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.amber }}>
                #1 Recommended for {role}
              </span>
            </div>
            <h2 className="font-display font-extrabold text-lg mb-1.5" style={{ color: C.text }}>
              {topPick.title}
            </h2>
            <p className="text-xs mb-3" style={{ color: C.muted, lineHeight: 1.6 }}>
              {topPick.whyText}
            </p>
            <div className="flex items-center gap-4 text-[11px]" style={{ color: C.muted }}>
              <span className="flex items-center gap-1"><Clock size={11} /> {topPick.hrs}</span>
              <span className="flex items-center gap-1"><Users size={11} /> {topPick.students}</span>
              <span className="flex items-center gap-1"><Star size={11} color={C.amber} /> <span style={{ color: C.amber }}>{topPick.rating}</span></span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 shrink-0">
            <div className="text-center">
              <p className="text-3xl font-display font-extrabold" style={{ color: C.green }}>{topPick.matchPct}%</p>
              <p className="text-[10px]" style={{ color: C.muted }}>Role match</p>
            </div>
            <button
              onClick={() => navigate("/courses/learn", { state: { tag: topPick.tag } })}
              className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl"
              style={{ background: C.blue2 }}
            >
              Start Now <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Filters + stats row ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={13} color={C.blue2} />
          <span className="text-sm font-semibold" style={{ color: C.text }}>
            {filtered.length} courses ranked for you
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Level filter */}
          <div className="flex gap-1">
            {LEVEL_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setLevel(f)}
                className="text-[10px] font-semibold px-2 py-1.5 rounded-lg"
                style={{
                  background: levelFilter === f ? C.blue2 : "#1c2438",
                  color: levelFilter === f ? "#fff" : C.muted,
                  border: `1px solid ${levelFilter === f ? C.blue2 : C.border}`,
                }}
              >
                {f}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5" style={{ background: "#1c2438", border: `1px solid ${C.border}` }}>
            <Search size={11} color={C.muted} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses…"
              className="text-[11px] bg-transparent outline-none w-28"
              style={{ color: C.text }}
            />
          </div>
        </div>
      </div>

      {/* ── Course grid ─────────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {visible.map((course, i) => (
          <CourseCard
            key={course.tag + i}
            course={course}
            rank={i + 1}
            onOpen={() => navigate("/courses/learn", { state: { tag: course.tag } })}
          />
        ))}
      </div>

      {filtered.length > 6 && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="w-full text-xs font-semibold py-2.5 rounded-xl"
          style={{ background: "#1c2438", color: C.muted, border: `1px solid ${C.border}` }}
        >
          {showAll ? "Show Less" : `Show All ${filtered.length} Courses`}
        </button>
      )}

      {/* ── Learning stats footer ────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mt-5">
        <div className="rounded-xl p-3 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <p className="text-lg font-display font-extrabold" style={{ color: C.text }}>{filtered.filter((c) => c.isGap).length}</p>
          <p className="text-[10px]" style={{ color: C.muted }}>Courses filling gaps</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <p className="text-lg font-display font-extrabold" style={{ color: C.text }}>{filtered.filter((c) => c.matchPct >= 80).length}</p>
          <p className="text-[10px]" style={{ color: C.muted }}>High-match courses (≥80%)</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <p className="text-lg font-display font-extrabold" style={{ color: C.text }}>
            {filtered.filter((c) => c.matchPct >= 80).length > 0
              ? (filtered.filter((c) => c.matchPct >= 80).reduce((a, c) => a + c.rating, 0) /
                 filtered.filter((c) => c.matchPct >= 80).length).toFixed(1)
              : "—"}
          </p>
          <p className="text-[10px]" style={{ color: C.muted }}>Avg rating (top picks)</p>
        </div>
      </div>
    </div>
  );
}