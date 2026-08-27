import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, Clock, ArrowRight, Target, BookOpen,
  CheckCircle2, Star,
} from "lucide-react";
import { C } from "../lib/theme";
import { COURSES, SKILLS } from "../data/mock";

// ─── Skill → Course tag mapping ───────────────────────────────────────────
// Maps a student skill keyword to which course tags close that gap.
const SKILL_TO_TAGS = {
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

// Role → priority tags (what a hiring manager for that role cares most about)
const ROLE_TO_PRIORITY = {
  "Data Scientist":       ["AI/ML", "PYTHON", "SQL"],
  "ML Engineer":          ["AI/ML", "PYTHON", "CLOUD"],
  "Backend Developer":    ["PYTHON", "SQL", "JAVA", "CLOUD"],
  "Frontend Developer":   ["FRONTEND", "DSA"],
  "Full Stack Developer": ["FRONTEND", "PYTHON", "SQL", "DSA"],
  "Data Analyst":         ["SQL", "PYTHON", "AI/ML"],
  "DevOps Engineer":      ["CLOUD", "PYTHON"],
  "Software Engineer":    ["DSA", "PYTHON", "JAVA", "SQL"],
  "SDE":                  ["DSA", "PYTHON", "JAVA"],
};

// Why each course helps (shown on the card)
const TAG_WHY = {
  PYTHON:   "Strong Python fundamentals are expected in almost every tech interview.",
  DSA:      "Data Structures & Algorithms are the core of placement coding rounds.",
  SQL:      "SQL is tested in 80%+ of data and backend roles.",
  JAVA:     "Java OOP and collections are heavily tested in service-based companies.",
  "AI/ML":  "ML skills are the fastest-growing requirement across all tech domains.",
  CLOUD:    "Cloud knowledge (AWS) is now a baseline expectation for most roles.",
  FRONTEND: "React and modern frontend skills open roles at product companies.",
  APTITUDE: "Quantitative aptitude and logical reasoning appear in every placement test.",
};

function matchCourses(selectedSkills, targetRole) {
  const tagScores = {};

  // Score based on skills the student doesn't have (gap = high score)
  const studentTagSet = new Set();
  for (const sk of selectedSkills) {
    for (const [kw, tags] of Object.entries(SKILL_TO_TAGS)) {
      if (sk.toLowerCase().includes(kw.toLowerCase())) {
        tags.forEach((t) => studentTagSet.add(t));
      }
    }
  }

  // Every course not in student's tag set is a gap → recommend it
  const allTags = [...new Set(COURSES.map((c) => c.tag))];
  for (const tag of allTags) {
    tagScores[tag] = studentTagSet.has(tag) ? 1 : 3; // gap = higher base score
  }

  // Boost by role priority
  if (targetRole) {
    const roleLower = targetRole.toLowerCase();
    for (const [role, tags] of Object.entries(ROLE_TO_PRIORITY)) {
      if (roleLower.includes(role.toLowerCase()) || role.toLowerCase().includes(roleLower)) {
        tags.forEach((t) => { tagScores[t] = (tagScores[t] || 1) + 4; });
      }
    }
  }

  // Map to COURSES entries, sort by score descending
  return COURSES
    .filter((c) => c.tag && TAG_WHY[c.tag]) // only courses with content
    .map((c) => ({ ...c, _score: tagScores[c.tag] || 1 }))
    .sort((a, b) => b._score - a._score);
}

const SKILL_CHIPS = [
  "Python", "Java", "DSA", "SQL", "React", "Machine Learning",
  "Cloud / AWS", "Aptitude", "Communication",
];

export default function Recommendations() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(
    SKILLS.slice(0, 3).map((s) => s.name.split(" ")[0])
  );
  const [targetRole, setTargetRole] = useState("");

  const toggle = (chip) =>
    setSelected((prev) =>
      prev.includes(chip) ? prev.filter((s) => s !== chip) : [...prev, chip]
    );

  const recommended = useMemo(
    () => matchCourses(selected, targetRole),
    [selected, targetRole]
  );

  const openCourse = (course) => {
    navigate("/courses/learn", { state: { tag: course.tag } });
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <h1
        className="font-display font-extrabold text-2xl mb-1"
        style={{ color: C.text }}
      >
        Course Recommendations
      </h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>
        Select your current skills and target role — Evolva instantly matches
        the courses that will close your skill gaps fastest.
      </p>

      {/* Filter panel */}
      <div
        className="rounded-2xl p-6 mb-7"
        style={{ background: C.card, border: `1px solid ${C.border}` }}
      >
        <p
          className="text-xs font-semibold mb-3"
          style={{ color: C.muted }}
        >
          Skills I already have
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {SKILL_CHIPS.map((chip) => {
            const active = selected.includes(chip);
            return (
              <button
                key={chip}
                onClick={() => toggle(chip)}
                className="text-xs font-semibold px-3 py-2 rounded-lg transition-all"
                style={{
                  background: active ? C.blue2 : "#1c2438",
                  color: active ? "#fff" : C.muted,
                  border: `1px solid ${active ? C.blue2 : C.border}`,
                }}
              >
                {active && <CheckCircle2 size={11} className="inline mr-1.5" />}
                {chip}
              </button>
            );
          })}
        </div>

        <p
          className="text-xs font-semibold mb-2"
          style={{ color: C.muted }}
        >
          Target role (optional)
        </p>
        <input
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g. Data Scientist, Backend Developer, SDE…"
          className="w-full rounded-xl p-3 text-sm max-w-sm"
          style={{
            background: "#1c2438",
            color: C.text,
            border: `1px solid ${C.border}`,
          }}
        />
      </div>

      {/* Results */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={14} color={C.blue2} />
        <p className="text-sm font-semibold" style={{ color: C.text }}>
          {recommended.length} courses matched
          {targetRole && ` for "${targetRole}"`}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {recommended.map((course, i) => (
          <CourseCard
            key={course.tag}
            course={course}
            rank={i + 1}
            onOpen={() => openCourse(course)}
          />
        ))}
      </div>
    </div>
  );
}

function CourseCard({ course, rank, onOpen }) {
  const isPriority = rank <= 3;
  return (
    <div
      className="rounded-2xl p-5 flex flex-col"
      style={{
        background: C.card,
        border: `1px solid ${isPriority ? C.blue2 + "55" : C.border}`,
      }}
    >
      {/* Badge row */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10px] font-bold px-2 py-1 rounded-md"
          style={{ background: "#1c2438", color: C.blue2 }}
        >
          {course.tag}
        </span>
        <div className="flex items-center gap-2">
          {isPriority && (
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1"
              style={{ background: "#1a2a1a", color: C.green }}
            >
              <Star size={9} /> Top Pick
            </span>
          )}
          <span
            className="text-[10px] font-bold"
            style={{ color: C.muted }}
          >
            {course.level}
          </span>
        </div>
      </div>

      {/* Title + desc */}
      <h3
        className="font-display font-bold text-sm mb-1.5"
        style={{ color: C.text }}
      >
        {course.title}
      </h3>
      <p
        className="text-xs mb-3"
        style={{ color: C.muted, lineHeight: 1.55 }}
      >
        {course.desc}
      </p>

      {/* Why recommended */}
      <div
        className="flex items-start gap-2 text-[11px] mb-4 p-2.5 rounded-lg"
        style={{ background: "#1c2438", color: C.muted }}
      >
        <Target size={11} className="mt-0.5 shrink-0" color={C.green} />
        {TAG_WHY[course.tag] || "Recommended based on your profile."}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3 text-[11px]" style={{ color: C.muted }}>
          <span className="flex items-center gap-1">
            <Clock size={11} /> {course.hrs}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={11} /> {course.students}
          </span>
        </div>
        <button
          onClick={onOpen}
          className="flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-2 rounded-xl"
          style={{ background: C.blue2 }}
        >
          Start Learning <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}