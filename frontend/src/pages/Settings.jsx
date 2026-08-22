import React, { useState } from "react";
import { C } from "../lib/theme";
import { Toggle } from "../components/ui";

const ROWS = [
  { key: "email", label: "Email Notifications", body: "Get resume, interview, and course updates by email." },
  { key: "push", label: "Push Notifications", body: "Receive real-time alerts in your browser." },
  { key: "weekly", label: "Weekly Progress Report", body: "A Sunday summary of scores and skill movement." },
  { key: "twofa", label: "Two-Factor Authentication", body: "Add an extra verification step at sign-in." },
];

export default function Settings() {
  const [t, setT] = useState({ email: true, push: true, weekly: false, twofa: false });
  const flip = (k) => setT({ ...t, [k]: !t[k] });

  return (
    <div className="p-8 max-w-xl">
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>Settings</h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Control notifications and account security.</p>
      <div className="rounded-2xl p-2" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        {ROWS.map((r, i) => (
          <div key={r.key} className="flex items-center justify-between p-4" style={{ borderBottom: i < ROWS.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div className="pr-4">
              <p className="text-sm font-semibold" style={{ color: C.text }}>{r.label}</p>
              <p className="text-[11px]" style={{ color: C.muted }}>{r.body}</p>
            </div>
            <Toggle on={t[r.key]} onClick={() => flip(r.key)} />
          </div>
        ))}
      </div>
    </div>
  );
}
