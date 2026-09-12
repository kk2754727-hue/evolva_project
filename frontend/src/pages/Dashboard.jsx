import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Target, BookOpen, Video,
  ArrowRight, TrendingUp, Award,
} from "lucide-react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { C } from "../lib/theme";
import { WEEK, SKILLS } from "../data/mock";
import { Pill } from "../components/ui";

function useUser() {
  return useMemo(() => {
    try {
      const raw = sessionStorage.getItem("evolva_user");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return typeof parsed === "object" && parsed !== null ? parsed : { email: String(raw) };
    } catch {
      return null;
    }
  }, []);
}

function getFirstName(user) {
  if (!user) return "Student";
  if (user.full_name && user.full_name.trim()) {
    return user.full_name.trim().split(/\s+/)[0];
  }
  if (user.email) return user.email.split("@")[0];
  return "Student";
}

// Quick action cards
const ACTIONS = [
  { label: "Resume Analysis",     route: "/resume-analyzer",   icon: FileText, color: C.blue2,  desc: "Upload your resume for ATS scoring"    },
  { label: "Skill Gap Analyzer",  route: "/skill-gap",         icon: Target,   color: C.green,  desc: "Find what to improve for your role"    },
  { label: "Mock Interview",      route: "/mock-interview",    icon: Video,    color: C.purple, desc: "Practice with AI-powered interviews"   },
  { label: "AI Recommendations",  route: "/recommendations",   icon: Award,    color: C.amber,  desc: "Get personalized course picks"         },
];

export default function Dashboard() {
  const navigate  = useNavigate();
  const user      = useUser();
  const firstName = getFirstName(user);

  return (
    <div className="p-8 max-w-6xl">

      {/* ── Greeting ───────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>
          Welcome back, {firstName} 👋
        </h1>
        {user?.target_role && (
          <p className="text-sm" style={{ color: C.muted }}>
            Working towards: <span style={{ color: C.blue2, fontWeight: 600 }}>{user.target_role}</span>
          </p>
        )}
        {(user?.college || user?.year || user?.branch) && (
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>
            {[user.college, user.year, user.branch].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>

      {/* ── Quick action cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.route)}
            className="rounded-2xl p-5 text-left flex flex-col gap-3 hover:opacity-90 transition-opacity"
            style={{ background: C.card, border: `1px solid ${C.border}` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${a.color}22` }}
            >
              <a.icon size={20} color={a.color} />
            </div>
            <div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: C.text }}>{a.label}</p>
              <p className="text-[11px]" style={{ color: C.muted }}>{a.desc}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold mt-auto" style={{ color: a.color }}>
              Start <ArrowRight size={12} />
            </div>
          </button>
        ))}
      </div>

      {/* ── Charts row ──────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Weekly progress */}
        <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <h3 className="font-display font-bold text-base mb-0.5" style={{ color: C.text }}>
            Weekly Learning Progress
          </h3>
          <p className="text-xs mb-4" style={{ color: C.muted }}>
            Hours studied vs tasks completed
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={WEEK}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2536" vertical={false} />
              <XAxis dataKey="d" stroke="#5a6280" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#5a6280" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#161e30",
                  border: "1px solid #2a3350",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="tasks" name="Tasks" fill={C.green} radius={[4,4,0,0]} barSize={18} />
              <Line dataKey="hours" name="Hours" stroke={C.blue2} strokeWidth={2.5} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Skill overview */}
        <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between mb-0.5">
            <h3 className="font-display font-bold text-base" style={{ color: C.text }}>
              Skill Proficiency
            </h3>
            <button
              onClick={() => navigate("/skill-gap")}
              className="text-xs font-semibold flex items-center gap-1"
              style={{ color: C.blue2 }}
            >
              Analyze gaps <ArrowRight size={11} />
            </button>
          </div>
          <p className="text-xs mb-4" style={{ color: C.muted }}>
            Core placement competencies
          </p>
          <div className="space-y-3">
            {SKILLS.map((s, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: C.text }}>{s.name}</span>
                  <div className="flex items-center gap-2">
                    <Pill color={s.color}>{s.level}</Pill>
                    <span className="text-xs font-bold w-8 text-right" style={{ color: C.text }}>{s.pct}%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: "#1e2536" }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${s.pct}%`, background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/recommendations")}
            className="mt-4 w-full text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2"
            style={{ background: "#1c2438", color: C.blue2, border: `1px solid ${C.border}` }}
          >
            <BookOpen size={13} /> View Recommended Courses
          </button>
        </div>
      </div>
    </div>
  );
}