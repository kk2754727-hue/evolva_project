import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  BookOpen,
  Star,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react";
import { C } from "../lib/theme";
import { COURSES } from "../data/mock";

const TABS = [
  "All",
  "Python",
  "Java",
  "DSA",
  "SQL",
  "AI/ML",
  "Cloud",
  "Aptitude",
  "Frontend",
  "Backend",
];

export default function Courses() {
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = COURSES.filter((c) => {
    const inTab =
      tab === "All" ||
      (c.tag || "").toLowerCase().includes(tab.toLowerCase());

    const inQuery =
      !query ||
      (c.title || "").toLowerCase().includes(query.toLowerCase()) ||
      (c.inst || "").toLowerCase().includes(query.toLowerCase());

    return inTab && inQuery;
  });

  // Pass the course tag because courseContent.js is keyed by tags:
  // PYTHON, JAVA, DSA, SQL, AI/ML, CLOUD, APTITUDE, FRONTEND
  const openCourse = (course) => {
    if (!course?.tag) {
      console.error("Cannot open course: missing course tag", course);
      return;
    }

    navigate("/recommendations/course", {
      state: { course },
    });
  };

  return (
    <div className="p-8">
      <h1
        className="font-display font-extrabold text-2xl mb-1"
        style={{ color: C.text }}
      >
        Courses
      </h1>

      <p className="text-sm mb-6" style={{ color: C.muted }}>
        Curated learning paths mapped to your active skill gaps.
      </p>

      <div
        className="flex items-center gap-2 rounded-xl px-4 py-3 mb-4"
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
        }}
      >
        <Search size={15} color={C.muted} />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses by title, topic, or instructor..."
          className="bg-transparent text-sm w-full outline-none"
          style={{ color: C.text }}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="text-xs font-semibold px-3.5 py-2 rounded-lg"
            style={{
              background: tab === t ? C.blue2 : C.card,
              color: tab === t ? "#fff" : C.muted,
              border: `1px solid ${tab === t ? C.blue2 : C.border}`,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="text-xs mb-4" style={{ color: C.muted }}>
        Showing {filtered.length} of {COURSES.length} courses
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((c, i) => (
          <div
            key={c.id || `${c.tag}-${i}`}
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              className="h-28 relative flex items-center justify-center"
              style={{ background: c.grad }}
            >
              <span
                className="absolute top-3 left-3 text-[10px] font-bold text-white/90 px-2 py-1 rounded-md"
                style={{ background: "rgba(0,0,0,0.25)" }}
              >
                {c.tag}
              </span>

              <span
                className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-md text-white"
                style={{ background: "rgba(0,0,0,0.25)" }}
              >
                {c.level}
              </span>

              <BookOpen size={26} color="#fff" opacity={0.85} />
            </div>

            <div className="p-4 flex flex-col flex-1">
              <h3
                className="font-display font-bold text-sm mb-1.5"
                style={{ color: C.text }}
              >
                {c.title}
              </h3>

              <p
                className="text-[11px] mb-3 flex-1"
                style={{ color: C.muted, lineHeight: 1.5 }}
              >
                {c.desc}
              </p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg,#5865f2,#8b6bf7,#14c88e)",
                    }}
                  >
                    {c.init}
                  </div>

                  <span
                    className="text-[11px]"
                    style={{ color: C.muted }}
                  >
                    {c.inst}
                  </span>
                </div>

                <span
                  className="flex items-center gap-1 text-[11px] font-bold"
                  style={{ color: C.amber }}
                >
                  <Star size={11} fill={C.amber} /> {c.rating}
                </span>
              </div>

              <div
                className="flex items-center gap-3 text-[10px] mb-3"
                style={{ color: C.muted }}
              >
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {c.hrs}
                </span>

                <span className="flex items-center gap-1">
                  <Users size={11} /> {c.students}
                </span>
              </div>

              <div
                className="flex items-center justify-between text-[10px] mb-1.5"
                style={{ color: C.muted }}
              >
                <span>PROGRESS</span>

                <span
                  className="font-bold"
                  style={{ color: C.text }}
                >
                  {c.progress}%
                </span>
              </div>

              <div
                className="w-full h-1.5 rounded-full mb-3"
                style={{ background: "#1e2536" }}
              >
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${c.progress}%`,
                    background: C.blue2,
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => openCourse(c)}
                className="w-full text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 transition"
                style={{
                  background: "#1c2438",
                  color: C.text,
                }}
              >
                Continue Learning <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
