import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Sparkles, Home, BookOpen, FileText, Target, Video, TrendingUp, Wand2, Bell, User, Settings as SettingsIcon, LogOut } from "lucide-react";
import { C } from "../lib/theme";

export const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/resume-analyzer", label: "Resume Analyzer", icon: FileText },
  { to: "/skill-gap", label: "Skill Gap", icon: Target },
  { to: "/mock-interview", label: "Mock Interview", icon: Video },
  { to: "/placement-prediction", label: "Placement Prediction", icon: TrendingUp },
  { to: "/recommendations", label: "AI Recommendations", icon: Wand2 },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="w-64 shrink-0 flex flex-col h-full" style={{ background: C.panel, borderRight: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.grad }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <span className="font-display font-extrabold text-lg" style={{ color: C.text }}>EVOLVA</span>
      </div>

      <div className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={({ isActive }) => ({
              background: isActive ? "rgba(88,101,242,0.15)" : "transparent",
              color: isActive ? "#8b9bff" : C.muted,
            })}
          >
            <n.icon size={17} /> {n.label}
          </NavLink>
        ))}
      </div>

      <div className="px-3 pb-4">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold"
          style={{ color: C.red }}
        >
          <LogOut size={17} /> Logout
        </button>
        <div className="flex items-center gap-3 px-3 pt-4 border-t" style={{ borderColor: C.border }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: C.grad }}>N</div>
          <div>
            <p className="text-xs font-semibold" style={{ color: C.text }}>nagowtham2</p>
            <p className="text-[10px]" style={{ color: C.muted }}>EVOLVA STUDENT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
