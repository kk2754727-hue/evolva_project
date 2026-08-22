import React from "react";
import { Home, Search, Moon, Bell } from "lucide-react";
import { C } from "../lib/theme";
import { NAV } from "./Sidebar";
import { useLocation } from "react-router-dom";

const EXTRA_CRUMBS = { "/dashboard": ["Dashboard", "Home"] };

export default function Topbar() {
  const { pathname } = useLocation();
  const match = NAV.find((n) => n.to === pathname);
  const crumbs = EXTRA_CRUMBS[pathname] || (match ? [match.label] : []);

  return (
    <div className="flex items-center justify-between px-8 py-4 border-b" style={{ borderColor: C.border }}>
      <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
        <Home size={14} />
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-2">
            <span>&rsaquo;</span>
            <span style={{ color: i === crumbs.length - 1 ? C.text : C.muted, fontWeight: i === crumbs.length - 1 ? 600 : 400 }}>{c}</span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <Search size={14} color={C.muted} />
          <input placeholder="Search courses, skills, interviews..." className="bg-transparent text-xs w-56" style={{ color: C.text }} />
        </div>
        <Moon size={16} color={C.muted} />
        <div className="relative">
          <Bell size={16} color={C.muted} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: C.red }} />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: C.grad }}>N</div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold" style={{ color: C.text }}>nagowtham2</p>
            <p className="text-[10px]" style={{ color: C.muted }}>STUDENT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
