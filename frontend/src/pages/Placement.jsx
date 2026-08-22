import React from "react";
import { Building2 } from "lucide-react";
import { C } from "../lib/theme";
import { COMPANIES } from "../data/mock";
import { RadialProgress, Pill } from "../components/ui";

const FACTORS = [
  { label: "Resume Strength", pct: 88 },
  { label: "Skill Match", pct: 76 },
  { label: "Interview Performance", pct: 81 },
  { label: "Course Completion", pct: 70 },
];

export default function Placement() {
  return (
    <div className="p-8">
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>Placement Prediction</h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Machine-learning forecast of your job-offer probability, updated after every activity.</p>

      <div className="grid lg:grid-cols-[1fr_1.3fr] gap-6">
        <div className="rounded-2xl p-8 flex flex-col items-center justify-center" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="relative">
            <RadialProgress value={82} size={180} stroke={14} color={C.green} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-extrabold text-4xl" style={{ color: C.text }}>82%</span>
              <span className="text-xs font-semibold" style={{ color: C.green }}>Highly Likely</span>
            </div>
          </div>
          <p className="text-xs text-center mt-5" style={{ color: C.muted }}>Tier-1 companies matching based on your current profile</p>
        </div>

        <div className="rounded-2xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <h3 className="font-display font-bold text-base mb-4" style={{ color: C.text }}>Prediction Factors</h3>
          <div className="space-y-4 mb-6">
            {FACTORS.map((f, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span style={{ color: C.text }} className="font-semibold">{f.label}</span>
                  <span style={{ color: C.muted }}>{f.pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: "#1e2536" }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${f.pct}%`, background: C.blue2 }} />
                </div>
              </div>
            ))}
          </div>
          <h3 className="font-display font-bold text-sm mb-3" style={{ color: C.text }}>Matched Companies</h3>
          <div className="space-y-2">
            {COMPANIES.map((c, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl p-3" style={{ background: "#1c2438" }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#242c46" }}>
                    <Building2 size={15} color={C.blue2} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: C.text }}>{c.name}</p>
                    <p className="text-[10px]" style={{ color: C.muted }}>{c.role}</p>
                  </div>
                </div>
                <Pill color={c.match > 85 ? C.green : c.match > 75 ? C.blue2 : C.amber}>{c.match}% match</Pill>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
