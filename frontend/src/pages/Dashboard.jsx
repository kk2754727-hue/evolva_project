import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Target, TrendingUp, BookOpen,
  Video, CheckCircle2, ArrowRight,
} from "lucide-react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { C } from "../lib/theme";
import { WEEK, SKILLS } from "../data/mock";
import { Pill } from "../components/ui";

// ── read logged-in user from sessionStorage ───────────────────────────────
function useUser() {
  return useMemo(() => {
    try {
      const raw = sessionStorage.getItem("evolva_user");
      if (!raw) return null;
      // stored as JSON object by new login, or plain email string by old OTP login
      return typeof JSON.parse(raw) === "object" ? JSON.parse(raw) : { email: raw };
    } catch {
      const raw = sessionStorage.getItem("evolva_user");
      return raw ? { email: raw } : null;
    }
  }, []);
}

function getFirstName(user) {
  if (!user) return "Student";
  if (user.full_name) return user.full_name.split(" ")[0];
  if (user.email)     return user.email.split("@")[0];
  return "Student";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user     = useUser();
  const firstName = getFirstName(user);

  const stats = [
    { label: "Resume Score",        value: "88%",    icon: FileText,    sub: "+3.5% this week",        color: C.blue2  },
    { label: "Skill Score",          value: "76%",    icon: Target,      sub: "+2.1% from last month",  color: C.green  },
    { label: "Placement Probability",value: "82%",    icon: TrendingUp,  sub: "Excellent progress",     color: C.purple },
    { label: "Courses Completed",    value: "12",     icon: BookOpen,    sub: "2 active courses",       color: C.amber  },
    { label: "Mock Interviews",      value: "8",      icon: Video,       sub: "+1 scheduled tomorrow",  color: C.red    },
    { label: "Today's Goal",         value: "3 Tasks",icon: CheckCircle2,sub: "1/3 tasks completed",   color: C.blue   },
  ];

  // Quick-action buttons with their routes
  const actions = [
    { label: "Resume Analysis",    route: "/resume-analyzer",   primary: true  },
    { label: "Continue Learning",  route: "/courses",           primary: false },
    { label: "Start Mock Interview",route: "/mock-interview",   primary: false },
    { label: "View Placement Score",route: "/placement-prediction", primary: false },
  ];

  return (
    <div className="p-8">
      {/* ── Greeting ──────────────────────────────────────────────── */}
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>
        Welcome back, {firstName} 👋
      </h1>
      <p className="text-sm mb-2" style={{ color: C.muted }}>
        {user?.target_role
          ? `Working towards: ${user.target_role}`
          : "Let's continue your placement preparation."}
      </p>
      {user?.college && (
        <p className="text-xs mb-6" style={{ color: C.muted }}>
          {user.college}{user?.year ? ` · ${user.year}` : ""}{user?.branch ? ` · ${user.branch}` : ""}
        </p>
      )}
      {!user?.college && <div className="mb-6" />}

      {/* ── Quick actions ──────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-6">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.route)}
            className="text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-opacity hover:opacity-80"
            style={{
              background: a.primary ? C.blue2 : C.card,
              color:      a.primary ? "#fff"  : C.text,
              border:     a.primary ? "none"  : `1px solid ${C.border}`,
            }}
          >
            {a.label}
            {a.primary && <ArrowRight size={14} />}
          </button>
        ))}
      </div>

      {/* ── Stat cards ────────────────────────────────────────────── */}
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

      {/* ── Charts ────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly progress chart */}
        <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <h3 className="font-display font-bold text-base mb-1" style={{ color: C.text }}>
            Weekly Learning Progress
          </h3>
          <p className="text-xs mb-4" style={{ color: C.muted }}>
            Hours studied vs tasks completed
          </p>
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

        {/* Skill overview */}
        <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display font-bold text-base" style={{ color: C.text }}>
              Skill Proficiency Overview
            </h3>
            <button
              onClick={() => navigate("/skill-gap")}
              className="text-xs font-semibold flex items-center gap-1"
              style={{ color: C.blue2 }}
            >
              Analyze gaps <ArrowRight size={11} />
            </button>
          </div>
          <p className="text-xs mb-5" style={{ color: C.muted }}>
            Assessed competencies across core placement domains
          </p>
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

          {/* Go to recommendations */}
          <button
            onClick={() => navigate("/recommendations")}
            className="mt-5 w-full text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2"
            style={{ background: "#1c2438", color: C.blue2, border: `1px solid ${C.border}` }}
          >
            <BookOpen size={13} /> View Recommended Courses
          </button>
        </div>
      </div>
    </div>
  );
}