import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Circle, ChevronDown, ChevronRight,
  ClipboardCheck, Clock, Award, Copy, Check, Lightbulb,
} from "lucide-react";
import { C } from "../lib/theme";
import { getCourseContent } from "../data/courseContent";
import { getCourseProgress, saveCourseProgress } from "../lib/api";

// Lessons account for up to 90% of a course; passing the assessment finishes
// the remaining 10% (that step is saved by the assessment page, not here).
const MAX_LESSON_PCT = 90;

function userKey() {
  try {
    const u = JSON.parse(sessionStorage.getItem("evolva_user") || "null");
    return u && typeof u === "object" && u.id ? String(u.id) : "guest";
  } catch {
    return "guest";
  }
}

function CodeBlock({ label, code, accent, copyable = true }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between px-3 py-1.5"
        style={{ background: "#0e1421", borderBottom: `1px solid ${C.border}` }}>
        <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: accent }}>{label}</span>
        {copyable && (
          <button onClick={copy} className="flex items-center gap-1 text-[10px] font-semibold"
            style={{ color: copied ? C.green : C.muted }}>
            {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
          </button>
        )}
      </div>
      <pre className="p-4 text-xs overflow-x-auto"
        style={{
          background: "#0a0e17", color: C.text, margin: 0, lineHeight: 1.65,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        }}>{code}</pre>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: C.muted }}>
      {children}
    </p>
  );
}

export default function CourseViewer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Courses / Recommendations / Skill Gap all send { state: { tag } }.
  // "?tag=PYTHON" also works, so the page survives a manual refresh or shared link.
  const tag = location.state?.tag || params.get("tag") || "";
  const course = useMemo(() => getCourseContent(tag), [tag]);

  const lessons = useMemo(
    () => course
      ? course.modules.flatMap((m, mi) =>
          m.lessons.map((lesson, li) => ({ id: `${mi}-${li}`, mi, module_title: m.module_title, lesson })))
      : [],
    [course]
  );

  const storageKey = `evolva_lessons_${userKey()}_${tag}`;
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch { return []; }
  });
  const [serverRec, setServerRec] = useState(null);
  const [openMods, setOpenMods] = useState(() => new Set([0]));
  const topRef = useRef(null);
  const firstRender = useRef(true);

  // Existing saved progress for this course (so we never move it backwards)
  useEffect(() => {
    if (!tag) return;
    getCourseProgress()
      .then((rows) => {
        if (Array.isArray(rows)) setServerRec(rows.find((r) => r.course_tag === tag) || null);
      })
      .catch(() => {});
  }, [tag]);

  // Keep the active lesson's module expanded and scroll to the top on change
  useEffect(() => {
    if (!lessons[active]) return;
    setOpenMods((s) => new Set(s).add(lessons[active].mi));
    if (firstRender.current) { firstRender.current = false; return; }
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active, lessons]);

  if (!course) {
    return (
      <div className="p-8 max-w-xl">
        <div className="rounded-2xl p-6 text-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <p className="text-sm mb-4" style={{ color: C.muted }}>
            {tag ? `No course content found for "${tag}".` : "No course selected."} Pick one from the course list.
          </p>
          <button onClick={() => navigate("/courses")}
            className="text-xs font-semibold text-white px-4 py-2.5 rounded-xl" style={{ background: C.blue2 }}>
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const validDone = done.filter((id) => lessons.some((l) => l.id === id));
  const doneCount = validDone.length;
  const allDone   = doneCount === lessons.length;
  const current   = lessons[active];
  const l         = current.lesson;
  const isDone    = validDone.includes(current.id);
  const pctShown  = Math.round((doneCount / lessons.length) * 100);

  const persist = (nextDone) => {
    setDone(nextDone);
    try { localStorage.setItem(storageKey, JSON.stringify(nextDone)); } catch {}

    // Don't touch a course that is already completed (badge/XP live on that record)
    if (serverRec?.status === "completed") return;

    const pct  = Math.round((nextDone.length / lessons.length) * MAX_LESSON_PCT);
    const best = Math.max(serverRec?.progress_pct || 0, pct);
    if (serverRec && best === (serverRec.progress_pct || 0)) return;

    setServerRec({ ...(serverRec || {}), course_tag: tag, status: "started", progress_pct: best });
    saveCourseProgress({
      course_tag: tag, course_title: course.title, status: "started", progress_pct: best,
    }).catch(() => {});
  };

  const toggleDone = () =>
    persist(isDone ? validDone.filter((id) => id !== current.id) : [...validDone, current.id]);

  const toggleModule = (mi) =>
    setOpenMods((s) => { const n = new Set(s); n.has(mi) ? n.delete(mi) : n.add(mi); return n; });

  const goAssessment = () =>
    navigate("/recommendations/course", {
      state: { course: { title: course.title, tag, level: course.level, description: `${course.title} assessment` } },
    });

  return (
    <div className="p-6 max-w-6xl">
      <div ref={topRef} />

      <button onClick={() => navigate("/courses")}
        className="flex items-center gap-1.5 text-xs font-semibold mb-4" style={{ color: C.muted }}>
        <ArrowLeft size={14} /> All courses
      </button>

      {/* Course header */}
      <div className="rounded-2xl p-5 mb-5"
        style={{ background: `linear-gradient(135deg, ${C.card} 60%, #1a1f3a)`, border: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold px-2 py-1 rounded-md" style={{ background: "#1c2438", color: C.blue2 }}>{tag}</span>
          <span className="text-[10px] font-bold" style={{ color: C.muted }}>{course.level}</span>
          <span className="flex items-center gap-1 text-[10px]" style={{ color: C.muted }}>
            <Clock size={10} /> ~{course.estimated_hours}h
          </span>
        </div>
        <h1 className="font-display font-extrabold text-xl mb-3" style={{ color: C.text }}>{course.title}</h1>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full" style={{ background: "#1c2438" }}>
            <div className="h-1.5 rounded-full" style={{ width: `${pctShown}%`, background: C.green, transition: "width .4s" }} />
          </div>
          <span className="text-[11px] font-semibold" style={{ color: C.muted }}>
            {doneCount}/{lessons.length} lessons
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-5">

        {/* Outline */}
        <div className="rounded-2xl p-3 lg:sticky lg:top-4 self-start"
          style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <p className="text-[11px] font-bold uppercase tracking-wide px-2 py-2" style={{ color: C.muted }}>Course content</p>
          {course.modules.map((m, mi) => (
            <div key={mi} className="mb-1">
              <button onClick={() => toggleModule(mi)}
                className="w-full flex items-center justify-between px-2 py-2 rounded-lg text-left"
                style={{ color: C.text }}>
                <span className="text-xs font-semibold">{mi + 1}. {m.module_title}</span>
                {openMods.has(mi) ? <ChevronDown size={13} color={C.muted} /> : <ChevronRight size={13} color={C.muted} />}
              </button>
              {openMods.has(mi) && lessons.map((x, idx) => x.mi === mi && (
                <button key={x.id} onClick={() => setActive(idx)}
                  className="w-full flex items-start gap-2 pl-4 pr-2 py-2 rounded-lg text-left"
                  style={{ background: idx === active ? "rgba(88,101,242,0.15)" : "transparent" }}>
                  {validDone.includes(x.id)
                    ? <CheckCircle2 size={14} color={C.green} className="mt-0.5 shrink-0" />
                    : <Circle size={14} color={C.muted} className="mt-0.5 shrink-0" />}
                  <span className="text-[11px]" style={{ color: idx === active ? "#8b9bff" : C.muted }}>
                    {x.lesson.lesson_title}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Lesson */}
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
          <div className="px-5 py-4" style={{ background: "#132a22", borderBottom: `2px solid ${C.green}` }}>
            <p className="text-[10px] font-semibold mb-0.5" style={{ color: "#7fe3bd" }}>
              {current.module_title} · Lesson {active + 1} of {lessons.length}
            </p>
            <h2 className="font-display font-bold text-lg" style={{ color: "#7fe3bd" }}>{l.lesson_title}</h2>
          </div>

          <div className="p-5 space-y-5" style={{ background: "#161c2c" }}>
            {l.introduction && (
              <p className="text-sm italic" style={{ color: C.muted, lineHeight: 1.7 }}>{l.introduction}</p>
            )}

            {l.explanation && (
              <div>
                <SectionTitle>Explanation</SectionTitle>
                <p className="text-sm" style={{ color: C.text, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{l.explanation}</p>
              </div>
            )}

            {l.syntax && <CodeBlock label="Syntax" code={l.syntax} accent={C.blue2} />}
            {l.example_code && <CodeBlock label="Example" code={l.example_code} accent={C.purple} />}
            {l.example_output && <CodeBlock label="Output" code={l.example_output} accent={C.amber} copyable={false} />}

            {l.example_explanation && (
              <p className="text-xs p-3 rounded-lg" style={{ background: "#1c2438", color: C.muted, lineHeight: 1.65 }}>
                <b style={{ color: C.text }}>How it works: </b>{l.example_explanation}
              </p>
            )}

            {l.key_points?.length > 0 && (
              <div>
                <SectionTitle>Key points</SectionTitle>
                <ul className="space-y-1.5">
                  {l.key_points.map((k, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: C.muted, lineHeight: 1.6 }}>
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0" color={C.green} /> {k}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {l.practice_problems?.length > 0 && (
              <div className="p-4 rounded-xl" style={{ background: "#241c33" }}>
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: "#c9b3f2" }}>
                  <Lightbulb size={13} /> Practice problems
                </p>
                <ol className="space-y-1.5">
                  {l.practice_problems.map((p, i) => (
                    <li key={i} className="text-xs" style={{ color: "#c9b3f2", lineHeight: 1.6 }}>{i + 1}. {p}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-wrap items-center gap-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
              <button onClick={() => setActive((a) => Math.max(0, a - 1))} disabled={active === 0}
                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl disabled:opacity-40"
                style={{ background: "#1c2438", color: C.text, border: `1px solid ${C.border}` }}>
                <ArrowLeft size={13} /> Previous
              </button>

              <button onClick={toggleDone}
                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-xl"
                style={{
                  background: isDone ? "#132a22" : "#1c2438",
                  color: isDone ? C.green : C.text,
                  border: `1px solid ${isDone ? C.green : C.border}`,
                }}>
                <CheckCircle2 size={13} /> {isDone ? "Completed" : "Mark as complete"}
              </button>

              <div className="flex-1" />

              {active + 1 < lessons.length ? (
                <button onClick={() => setActive((a) => a + 1)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2.5 rounded-xl"
                  style={{ background: C.blue2 }}>
                  Next lesson <ArrowRight size={13} />
                </button>
              ) : allDone ? (
                <button onClick={goAssessment}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2.5 rounded-xl"
                  style={{ background: C.green }}>
                  <ClipboardCheck size={13} /> Take assessment <Award size={13} />
                </button>
              ) : (
                <span className="text-[11px]" style={{ color: C.muted }}>
                  Complete every lesson to unlock the assessment
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}