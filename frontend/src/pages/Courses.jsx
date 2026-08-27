import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Star, Clock, Users, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { C } from "../lib/theme";
import { COURSES } from "../data/mock";

const TABS = ["All", "Python", "Java", "DSA", "SQL", "AI/ML", "Cloud", "Aptitude", "Frontend", "Backend"];

function getProgress(course) {
  if (course.tag !== "PYTHON") return course.progress || 0;
  const saved = JSON.parse(localStorage.getItem("evolva-python-progress") || "[]");
  return saved.length ? Math.round((saved.length / 30) * 100) : course.progress || 0;
}

export default function Courses() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => COURSES.filter((c) => {
    const inTab = tab === "All" || c.tag.toLowerCase().includes(tab.toLowerCase());
    const inQuery = !query || `${c.title} ${c.inst} ${c.tag} ${c.desc}`.toLowerCase().includes(query.toLowerCase());
    return inTab && inQuery;
  }), [tab, query]);

  const openCourse = (course) => navigate("/recommendations/course", { state: { course } });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold px-2 py-1 rounded-md" style={{ background: "#1c2438", color: C.blue2 }}>LEARN</span>
            <span className="text-[10px] font-semibold" style={{ color: C.green }}>Placement focused</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl mb-1" style={{ color: C.text }}>Learn with Evolva</h1>
          <p className="text-sm" style={{ color: C.muted }}>Structured, lesson-by-lesson courses with examples, practice, quizzes and progress tracking.</p>
        </div>
        <div className="rounded-xl px-4 py-3 text-xs" style={{ background: "#132a22", border: `1px solid ${C.green}55`, color: "#7fe3bd" }}>
          <Sparkles size={14} className="inline mr-1.5" /> AI personalization can be added after the core lessons.
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <Search size={15} color={C.muted} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Python, SQL, DSA, AI/ML..." className="bg-transparent text-sm w-full outline-none" style={{ color: C.text }} />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className="text-xs font-semibold px-3.5 py-2 rounded-lg transition" style={{ background: tab === t ? C.blue2 : C.card, color: tab === t ? "#fff" : C.muted, border: `1px solid ${tab === t ? C.blue2 : C.border}` }}>{t}</button>
        ))}
      </div>

      <p className="text-xs mb-4" style={{ color: C.muted }}>Showing {filtered.length} of {COURSES.length} courses</p>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        {filtered.map((c) => {
          const progress = getProgress(c);
          return (
            <div key={c.title} className="rounded-2xl overflow-hidden flex flex-col transition hover:-translate-y-0.5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <div className="h-32 relative flex items-center justify-center" style={{ background: c.grad }}>
                <span className="absolute top-3 left-3 text-[10px] font-bold text-white/90 px-2 py-1 rounded-md" style={{ background: "rgba(0,0,0,0.25)" }}>{c.tag}</span>
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-md text-white" style={{ background: "rgba(0,0,0,0.25)" }}>{c.level}</span>
                <BookOpen size={30} color="#fff" opacity={0.9} />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-display font-bold text-sm mb-1.5" style={{ color: C.text }}>{c.title}</h3>
                <p className="text-[11px] mb-3 flex-1" style={{ color: C.muted, lineHeight: 1.55 }}>{c.desc}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: "linear-gradient(135deg,#5865f2,#8b6bf7,#14c88e)" }}>{c.init}</div><span className="text-[11px]" style={{ color: C.muted }}>{c.inst}</span></div>
                  <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: C.amber }}><Star size={11} fill={C.amber} /> {c.rating}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] mb-3" style={{ color: C.muted }}><span className="flex items-center gap-1"><Clock size={11} /> {c.hrs}</span><span className="flex items-center gap-1"><Users size={11} /> {c.students}</span></div>
                <div className="flex items-center justify-between text-[10px] mb-1.5" style={{ color: C.muted }}><span>PROGRESS</span><span className="font-bold" style={{ color: C.text }}>{progress}%</span></div>
                <div className="w-full h-1.5 rounded-full mb-3" style={{ background: "#1e2536" }}><div className="h-1.5 rounded-full transition-all" style={{ width: `${progress}%`, background: progress === 100 ? C.green : C.blue2 }} /></div>
                <button onClick={() => openCourse(c)} className="w-full text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5" style={{ background: progress > 0 ? C.blue2 : "#1c2438", color: "#fff" }}>
                  {progress === 100 ? <><CheckCircle2 size={12} /> Completed</> : progress > 0 ? <>Continue Learning <ArrowRight size={12} /></> : <>Start Learning <ArrowRight size={12} /></>}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
