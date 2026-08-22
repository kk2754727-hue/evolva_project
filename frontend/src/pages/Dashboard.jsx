import React from "react";
import { FileText, Target, TrendingUp, BookOpen, Video, CheckCircle2 } from "lucide-react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { C } from "../lib/theme";
import { WEEK, SKILLS } from "../data/mock";
import { Pill } from "../components/ui";

export default function Dashboard() {
  const stats = [
    { label: "Resume Score", value: "88%", icon: FileText, sub: "+3.5% this week", color: C.blue2 },
    { label: "Skill Score", value: "76%", icon: Target, sub: "+2.1% from last month", color: C.green },
    { label: "Placement Probability", value: "82%", icon: TrendingUp, sub: "Excellent progress", color: C.purple },
    { label: "Courses Completed", value: "12", icon: BookOpen, sub: "2 active courses", color: C.amber },
    { label: "Mock Interviews", value: "8", icon: Video, sub: "+1 scheduled tomorrow", color: C.red },
    { label: "Today's Goal", value: "3 Tasks", icon: CheckCircle2, sub: "1/3 tasks completed", color: C.blue },
  ];

  return (
    <div className="p-8">
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>Welcome back, nagowtham2</h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Let's continue translating your skill improvements into corporate placement credentials.</p>

      <div className="flex flex-wrap gap-3 mb-6">
        {["Resume Analysis", "Continue Learning", "Start Mock Interview", "View Placement Score"].map((b, i) => (
          <button
            key={i}
            className="text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2"
            style={{ background: i === 0 ? C.blue2 : C.card, color: i === 0 ? "#fff" : C.text, border: i === 0 ? "none" : `1px solid ${C.border}` }}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium" style={{ color: C.muted }}>{s.label}</span>
              <s.icon size={15} color={s.color} />
            </div>
            <p className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>{s.value}</p>
            <p className="text-[11px]" style={{ color: C.muted }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <h3 className="font-display font-bold text-base mb-1" style={{ color: C.text }}>Weekly Learning Progress</h3>
          <p className="text-xs mb-4" style={{ color: C.muted }}>Composed view of hours studied vs tasks completed</p>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={WEEK}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2536" vertical={false} />
              <XAxis dataKey="d" stroke="#5a6280" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#5a6280" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#161e30", border: "1px solid #2a3350", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="tasks" name="Tasks Completed" fill={C.green} radius={[4, 4, 0, 0]} barSize={18} />
              <Line dataKey="hours" name="Hours Studied" stroke={C.blue2} strokeWidth={2.5} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <h3 className="font-display font-bold text-base mb-1" style={{ color: C.text }}>Skill Proficiency Overview</h3>
          <p className="text-xs mb-5" style={{ color: C.muted }}>Assessed competencies across core placement nodes</p>
          <div className="space-y-4">
            {SKILLS.map((s, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold" style={{ color: C.text }}>{s.name}</span>
                  <div className="flex items-center gap-2">
                    <Pill color={s.color}>{s.level}</Pill>
                    <span className="text-xs font-bold" style={{ color: C.text }}>{s.pct}%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: "#1e2536" }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
