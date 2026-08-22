import React, { useState } from "react";
import { C } from "../lib/theme";

const FIELDS = [
  ["Full Name", "name"],
  ["College", "college"],
  ["Target Role", "role"],
  ["Graduation Year", "grad"],
];

export default function Profile() {
  const [form, setForm] = useState({
    name: "Nagowtham",
    college: "SRM Institute of Science and Technology",
    role: "SDE-1 / Backend Engineer",
    grad: "2027",
  });
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm({ ...form, [k]: v });
  const save = () => {
    // TODO: PUT /api/profile
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="p-8 max-w-xl">
      <h1 className="font-display font-extrabold text-2xl mb-1" style={{ color: C.text }}>Profile</h1>
      <p className="text-sm mb-6" style={{ color: C.muted }}>Your details help tailor recommendations and course matching.</p>
      <div className="rounded-2xl p-6" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ background: C.grad }}>N</div>
          <div>
            <p className="font-display font-bold text-base" style={{ color: C.text }}>{form.name}</p>
            <p className="text-xs" style={{ color: C.muted }}>nagowtham2@evolva.student</p>
          </div>
        </div>
        {FIELDS.map(([label, key]) => (
          <div key={key} className="mb-4">
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: C.muted }}>{label}</label>
            <input
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              className="w-full text-sm rounded-xl px-3 py-2.5"
              style={{ background: "#1c2438", color: C.text, border: `1px solid ${C.border}` }}
            />
          </div>
        ))}
        <button onClick={save} className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl" style={{ background: C.blue2 }}>
          {saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
