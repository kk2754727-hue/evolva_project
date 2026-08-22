import React from "react";
import { C } from "../lib/theme";

export function RadialProgress({ value, size = 76, stroke = 8, color = C.blue2, track = "#232b40" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
}

export function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative rounded-full transition-colors"
      style={{ width: 44, height: 24, background: on ? C.blue2 : "#2a3350" }}
    >
      <span
        className="absolute rounded-full bg-white transition-all"
        style={{ width: 18, height: 18, top: 3, left: on ? 23 : 3 }}
      />
    </button>
  );
}

export function Pill({ children, color }) {
  return (
    <span className="text-xs font-semibold px-2 py-1 rounded-md" style={{ background: `${color}22`, color }}>
      {children}
    </span>
  );
}
