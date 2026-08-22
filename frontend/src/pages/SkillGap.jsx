import React from "react";
import { C } from "../lib/theme";
import { Pill } from "../components/ui";

const GAPS = [
  { name: "System Design", current: 45, target: 80, priority: "High priority", color: C.red, course: "System Design Fundamentals" },
  { name: "Communication & Interview", current: 60, target: 80, priority: "Medium priority", color: C.amber, course: "Interview Communication Lab" },
  { name: "Machine Learning Basics", current: 70, target: 75, priority: "Low priority", color: C.blue2, course: "Machine Learning Foundations" },
  { name: "React & Web Frontend", current: 80, target: 85, priority: "Low priority", color: C.blue2, course: "React & Modern Frontend" },
  { name: "SQL & Database", current: 85, target: 85, priority: "On target", color: C.green, course: "—" },
  { name: "Python & DSA", current: 90, target: 90, priority: "On target", color: C.green, course: "—" },
];

export default function SkillGap() {
  return (
    <div className="p-8">
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>Skill Gap Analysis</h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Your current skillset benchmarked against Tier-1 role requirements.</p>
      <div className="space-y-4">
        {GAPS.map((g, i) => (
          <div key={i} className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold" style={{ color: C.text }}>{g.name}</span>
              <Pill color={g.color}>{g.priority}</Pill>
            </div>
            <div className="relative w-full h-2.5 rounded-full mb-2" style={{ background: "#1e2536" }}>
              <div className="h-2.5 rounded-full" style={{ width: `${g.current}%`, background: g.color }} />
              <div className="absolute top-0 h-2.5 w-0.5" style={{ left: `${g.target}%`, background: "#fff" }} />
            </div>
            <div className="flex items-center justify-between text-[11px]" style={{ color: C.muted }}>
              <span>
                Current: <b style={{ color: C.text }}>{g.current}%</b> &middot; Target: <b style={{ color: C.text }}>{g.target}%</b>
              </span>
              {g.course !== "—" && <span>Recommended: <b style={{ color: C.blue2 }}>{g.course}</b></span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
