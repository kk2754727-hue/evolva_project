import React from "react";
import { C } from "../lib/theme";
import { RECS } from "../data/mock";
import { Pill } from "../components/ui";

export default function Recommendations() {
  return (
    <div className="p-8">
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>AI Recommendations</h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Actionable, personalized next steps generated from your latest activity.</p>
      <div className="grid md:grid-cols-2 gap-5">
        {RECS.map((r, i) => (
          <div key={i} className="rounded-2xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#1c2438" }}>
                <r.icon size={18} color={C.blue2} />
              </div>
              <Pill color={r.tagColor}>{r.tag}</Pill>
            </div>
            <h3 className="font-display font-bold text-sm mb-2" style={{ color: C.text }}>{r.title}</h3>
            <p className="text-xs mb-4" style={{ color: C.muted, lineHeight: 1.6 }}>{r.body}</p>
            <button className="text-xs font-semibold" style={{ color: C.blue2 }}>Take action &rarr;</button>
          </div>
        ))}
      </div>
    </div>
  );
}
