import React, { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sparkles, Home, BookOpen, FileText, Target,
  Video, Wand2, Bell, User, Settings as Gear, LogOut,
} from "lucide-react";
import { C } from "../lib/theme";

// Placement Prediction REMOVED from nav
export const NAV = [
  { to: "/dashboard",       label: "Dashboard",         icon: Home     },
  { to: "/courses",         label: "Courses",           icon: BookOpen },
  { to: "/resume-analyzer", label: "Resume Analyzer",   icon: FileText },
  { to: "/skill-gap",       label: "Skill Gap",         icon: Target   },
  { to: "/mock-interview",  label: "Mock Interview",    icon: Video    },
  { to: "/recommendations", label: "AI Recommendations",icon: Wand2    },
  { to: "/notifications",   label: "Notifications",     icon: Bell     },
  { to: "/profile",         label: "Profile",           icon: User     },
  { to: "/settings",        label: "Settings",          icon: Gear     },
];

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

function getDisplayName(user) {
  if (!user) return "Student";
  if (user.full_name && user.full_name.trim()) return user.full_name.trim();
  if (user.email) return user.email.split("@")[0];
  return "Student";
}

function getInitials(user) {
  const name = getDisplayName(user);
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name[0]?.toUpperCase() || "S";
}

export default function Sidebar() {
  const navigate = useNavigate();
  const user     = useUser();
  const name     = getDisplayName(user);
  const initials = getInitials(user);

  const handleLogout = () => {
    sessionStorage.removeItem("evolva_user");
    navigate("/login");
  };

  return (
    <div className="w-64 shrink-0 flex flex-col h-full"
      style={{ background: C.panel, borderRight: `1px solid ${C.border}` }}>

      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: C.grad }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <span className="font-display font-extrabold text-lg" style={{ color: C.text }}>
          EVOLVA
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={({ isActive }) => ({
              background: isActive ? "rgba(88,101,242,0.15)" : "transparent",
              color:      isActive ? "#8b9bff" : C.muted,
            })}
          >
            <n.icon size={17} />
            {n.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 pt-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold mb-2"
          style={{ color: C.red }}
        >
          <LogOut size={17} /> Logout
        </button>

        {/* Clickable profile strip — shows REAL user name */}
        <button
          onClick={() => navigate("/profile")}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left hover:opacity-80 transition-opacity"
          style={{ background: "#1c2438", border: `1px solid ${C.border}` }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: C.grad }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: C.text }}>{name}</p>
            <p className="text-[10px] truncate" style={{ color: C.muted }}>
              {user?.target_role || user?.branch || "Evolva Student"}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}