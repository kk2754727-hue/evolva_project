import React, { useMemo } from "react";
import { Home, Search, Bell, Moon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { C } from "../lib/theme";
import { NAV } from "./Sidebar";

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

export default function Topbar() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const user         = useUser();
  const name         = getDisplayName(user);
  const initials     = getInitials(user);

  const match  = NAV.find((n) => n.to === pathname);
  const crumbs = match ? ["Dashboard", match.label] : ["Dashboard", "Home"];

  return (
    <div
      className="flex items-center justify-between px-8 py-4 border-b"
      style={{ borderColor: C.border, background: C.panel }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
        <Home size={14} />
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-2">
            <span>&rsaquo;</span>
            <span style={{
              color:      i === crumbs.length - 1 ? C.text : C.muted,
              fontWeight: i === crumbs.length - 1 ? 600 : 400,
            }}>
              {c}
            </span>
          </span>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div
          className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
        >
          <Search size={14} color={C.muted} />
          <input
            placeholder="Search courses, skills, interviews..."
            className="bg-transparent text-xs w-52 outline-none"
            style={{ color: C.text }}
          />
        </div>

        <Moon size={16} color={C.muted} className="cursor-pointer" />

        {/* Notifications */}
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/notifications")}
        >
          <Bell size={16} color={C.muted} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
            style={{ background: C.red }} />
        </div>

        {/* User avatar — shows REAL name, clickable to profile */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: C.grad }}
          >
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold" style={{ color: C.text }}>{name}</p>
            <p className="text-[10px]" style={{ color: C.muted }}>
              {user?.target_role || "Student"}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}