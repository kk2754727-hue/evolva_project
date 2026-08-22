import React, { useState } from "react";
import { C } from "../lib/theme";
import { NOTIFS } from "../data/mock";

export default function Notifications() {
  const [items, setItems] = useState(NOTIFS);

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display font-extrabold text-2xl" style={{ color: C.text }}>Notifications</h1>
        <button onClick={() => setItems(items.map((i) => ({ ...i, read: true })))} className="text-xs font-semibold" style={{ color: C.blue2 }}>
          Mark all read
        </button>
      </div>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Updates on your scores, courses, and interview feedback.</p>
      <div className="space-y-2">
        {items.map((n, i) => (
          <div
            key={i}
            onClick={() => setItems(items.map((it, idx) => (idx === i ? { ...it, read: true } : it)))}
            className="flex items-start gap-3 rounded-xl p-4 cursor-pointer"
            style={{ background: n.read ? C.card : "#141d33", border: `1px solid ${C.border}` }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${n.color}22` }}>
              <n.icon size={16} color={n.color} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: C.text }}>{n.title}</p>
              <p className="text-[11px]" style={{ color: C.muted }}>{n.time}</p>
            </div>
            {!n.read && <span className="w-2 h-2 rounded-full mt-1.5" style={{ background: C.blue2 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
