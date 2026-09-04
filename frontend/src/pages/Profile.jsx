import React, { useState, useEffect } from "react";
import {
  User, GraduationCap, Target, Phone, Linkedin, Github, Mail,
  Save, Loader2, CheckCircle2, AlertTriangle, Award,
  FileText, Video, BookOpen, Star, TrendingUp, Edit2, X,
} from "lucide-react";
import { C } from "../lib/theme";
import {
  getProfile, updateProfile,
  getResumeHistory, getInterviewHistory, getCourseProgress,
} from "../lib/api";

const YEARS    = ["1st Year","2nd Year","3rd Year","4th Year","Alumni"];
const ROLES    = ["Software Engineer (SDE)","Data Scientist","Backend Developer",
                  "Full Stack Developer","Frontend Developer","Data Analyst",
                  "ML Engineer","DevOps Engineer","Other"];
const BRANCHES = ["Computer Science (CSE)","Information Technology (IT)",
                  "Electronics & Communication (ECE)","Electrical Engineering (EEE)",
                  "Mechanical Engineering (ME)","Civil Engineering (CE)",
                  "Artificial Intelligence (AI)","Data Science (DS)","Other"];

function getInitials(name) {
  if (!name) return "S";
  const p = name.trim().split(" ");
  return p.length >= 2 ? (p[0][0] + p[p.length-1][0]).toUpperCase() : p[0][0].toUpperCase();
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold mb-1.5 block" style={{ color: C.muted }}>{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
      style={{ background: "#1c2438", color: C.text, border: `1px solid ${C.border}` }}
    />
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value} onChange={onChange}
      className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
      style={{ background: "#1c2438", color: value ? C.text : C.muted, border: `1px solid ${C.border}` }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export default function Profile() {
  const [summary,    setSummary]    = useState(null);
  const [resumes,    setResumes]    = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [courses,    setCourses]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [editing,    setEditing]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [saveOk,     setSaveOk]     = useState(false);
  const [saveErr,    setSaveErr]    = useState("");
  const [form,       setForm]       = useState({});

  useEffect(() => {
    (async () => {
      try {
        const [s, r, i, c] = await Promise.all([
          getProfile(), getResumeHistory(), getInterviewHistory(), getCourseProgress(),
        ]);
        setSummary(s);
        setResumes(r || []);
        setInterviews(i || []);
        setCourses(c || []);
        setForm(s?.user || {});
      } catch {
        // user not logged in or backend not ready — just show what we have from sessionStorage
        try {
          const raw = sessionStorage.getItem("evolva_user");
          const u   = raw ? JSON.parse(raw) : {};
          setForm(typeof u === "object" ? u : {});
        } catch {}
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setSaveOk(false); setSaveErr("");
    try {
      const res = await updateProfile(form);
      // Update sessionStorage
      const raw = sessionStorage.getItem("evolva_user");
      if (raw) {
        try {
          const u = JSON.parse(raw);
          sessionStorage.setItem("evolva_user", JSON.stringify({ ...u, ...res.user }));
        } catch {}
      }
      setSaveOk(true);
      setEditing(false);
      setTimeout(() => setSaveOk(false), 2500);
    } catch (err) {
      setSaveErr(err.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const user       = summary?.user || form;
  const initials   = getInitials(user.full_name);
  const completed  = courses.filter((c) => c.status === "completed");
  const totalXP    = completed.reduce((a, c) => a + (c.xp_earned || 0), 0);
  const avgInterview = interviews.length
    ? Math.round(interviews.reduce((a, i) => a + i.overall_score, 0) / interviews.length) : 0;
  const latestResume = resumes[0] || null;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <Loader2 size={22} className="animate-spin" color={C.blue2} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl p-6 mb-5 flex items-center gap-5"
        style={{ background: `linear-gradient(135deg, ${C.card} 60%, #1a1f3a)`, border: `1px solid ${C.border}` }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-display font-extrabold text-white shrink-0"
          style={{ background: C.grad }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-extrabold text-xl mb-0.5 truncate" style={{ color: C.text }}>
            {user.full_name || "Student"}
          </h1>
          <p className="text-sm truncate" style={{ color: C.muted }}>
            {user.email} {user.target_role && `· ${user.target_role}`}
          </p>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>
            {[user.college, user.branch, user.year].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl"
              style={{ background: "#1c2438", color: C.blue2, border: `1px solid ${C.border}` }}>
              <Edit2 size={13} /> Edit Profile
            </button>
          ) : (
            <>
              <button onClick={() => { setEditing(false); setSaveErr(""); }}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl"
                style={{ background: "#1c2438", color: C.muted, border: `1px solid ${C.border}` }}>
                <X size={13} /> Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-2 rounded-xl disabled:opacity-60"
                style={{ background: C.blue2 }}>
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                Save
              </button>
            </>
          )}
        </div>
      </div>

      {saveOk && (
        <div className="flex items-center gap-2 text-xs p-3 rounded-xl mb-4" style={{ background: "#132a22", color: C.green }}>
          <CheckCircle2 size={13} /> Profile updated successfully.
        </div>
      )}
      {saveErr && (
        <div className="flex items-center gap-2 text-xs p-3 rounded-xl mb-4" style={{ background: "#2b1313", color: "#f28b8b" }}>
          <AlertTriangle size={13} /> {saveErr}
        </div>
      )}

      {/* ── Stats row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { icon: FileText,   label: "Resume Score",     value: latestResume ? `${latestResume.ats_score}%` : "—", color: C.blue2  },
          { icon: Video,      label: "Interviews",        value: interviews.length,                                  color: C.purple },
          { icon: BookOpen,   label: "Courses Completed", value: completed.length,                                   color: C.green  },
          { icon: Star,       label: "Total XP",          value: totalXP,                                            color: C.amber  },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={14} color={s.color} />
              <span className="text-[10px]" style={{ color: C.muted }}>{s.label}</span>
            </div>
            <p className="text-xl font-display font-extrabold" style={{ color: C.text }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">

        {/* ── Left col ───────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Edit form / view */}
          <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.muted }}>Personal Info</p>
            {editing ? (
              <div className="space-y-3">
                <Field label="Full Name"><Input value={form.full_name || ""} onChange={set("full_name")} placeholder="Full name" /></Field>
                <Field label="Phone"><Input value={form.phone || ""} onChange={set("phone")} placeholder="Phone number" /></Field>
                <Field label="LinkedIn"><Input value={form.linkedin || ""} onChange={set("linkedin")} placeholder="LinkedIn URL" /></Field>
                <Field label="GitHub"><Input value={form.github || ""} onChange={set("github")} placeholder="GitHub URL" /></Field>
                <Field label="Bio">
                  <textarea value={form.bio || ""} onChange={set("bio")} placeholder="Short bio..."
                    rows={3} className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
                    style={{ background: "#1c2438", color: C.text, border: `1px solid ${C.border}` }} />
                </Field>
              </div>
            ) : (
              <div className="space-y-2.5">
                {[
                  { icon: Mail,         val: user.email },
                  { icon: Phone,        val: user.phone || "Not provided" },
                  { icon: Linkedin,     val: user.linkedin || "Not provided" },
                  { icon: Github,       val: user.github || "Not provided" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs" style={{ color: C.muted }}>
                    <r.icon size={13} color={C.muted} />
                    <span className="truncate" style={{ color: r.val === "Not provided" ? C.muted : C.text }}>{r.val}</span>
                  </div>
                ))}
                {user.bio && <p className="text-xs mt-2 pt-2 border-t" style={{ color: C.muted, borderColor: C.border }}>{user.bio}</p>}
              </div>
            )}
          </div>

          {/* Academic */}
          <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: C.muted }}>Academic Info</p>
            {editing ? (
              <div className="space-y-3">
                <Field label="College"><Input value={form.college || ""} onChange={set("college")} placeholder="College name" /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Year"><Select value={form.year || ""} onChange={set("year")} options={YEARS} placeholder="Year" /></Field>
                  <Field label="Branch"><Select value={form.branch || ""} onChange={set("branch")} options={BRANCHES} placeholder="Branch" /></Field>
                </div>
                <Field label="Target Role"><Select value={form.target_role || ""} onChange={set("target_role")} options={ROLES} placeholder="Target role" /></Field>
              </div>
            ) : (
              <div className="space-y-2.5">
                {[
                  { icon: GraduationCap, label: "College",     val: user.college },
                  { icon: BookOpen,      label: "Year",        val: user.year    },
                  { icon: GraduationCap, label: "Branch",      val: user.branch  },
                  { icon: Target,        label: "Target Role", val: user.target_role },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <r.icon size={13} color={C.muted} />
                    <span style={{ color: C.muted }}>{r.label}:</span>
                    <span className="font-semibold truncate" style={{ color: C.text }}>{r.val || "—"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Badges */}
          {summary?.badges?.length > 0 && (
            <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.muted }}>Badges Earned</p>
              <div className="flex flex-wrap gap-2">
                {summary.badges.map((b, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg"
                    style={{ background: "#1a2a1a", color: C.green, border: `1px solid ${C.green}44` }}>
                    <Award size={11} /> {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right col ─────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Resume history */}
          <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.muted }}>Resume History</p>
            {resumes.length === 0 ? (
              <p className="text-xs" style={{ color: C.muted }}>No resumes analyzed yet.</p>
            ) : (
              <div className="space-y-3">
                {resumes.slice(0, 4).map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: "#1c2438", border: i === 0 ? `1px solid ${C.blue2}44` : `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={13} color={i === 0 ? C.blue2 : C.muted} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: C.text }}>{r.filename}</p>
                        <p className="text-[10px]" style={{ color: C.muted }}>
                          {new Date(r.uploaded_at).toLocaleDateString()}
                          {r.target_role && ` · ${r.target_role}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="text-sm font-display font-extrabold" style={{ color: C.green }}>{r.ats_score}%</p>
                      <p className="text-[10px]" style={{ color: C.muted }}>ATS</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interview history */}
          <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.muted }}>Interview History</p>
              {interviews.length > 0 && (
                <span className="text-xs font-semibold" style={{ color: C.blue2 }}>Avg: {avgInterview}%</span>
              )}
            </div>
            {interviews.length === 0 ? (
              <p className="text-xs" style={{ color: C.muted }}>No interviews taken yet.</p>
            ) : (
              <div className="space-y-2">
                {interviews.slice(0, 5).map((iv, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: "#1c2438", border: `1px solid ${C.border}` }}>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: C.text }}>{iv.track}</p>
                      <p className="text-[10px]" style={{ color: C.muted }}>
                        {iv.mode} · {new Date(iv.taken_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm font-display font-extrabold" style={{ color: C.purple }}>{iv.overall_score}%</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Course progress */}
          <div className="rounded-2xl p-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.muted }}>Course Progress</p>
              <span className="text-xs font-semibold" style={{ color: C.amber }}>{totalXP} XP</span>
            </div>
            {courses.length === 0 ? (
              <p className="text-xs" style={{ color: C.muted }}>No courses started yet.</p>
            ) : (
              <div className="space-y-2">
                {courses.slice(0, 5).map((c, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ background: "#1c2438", border: `1px solid ${C.border}` }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-semibold truncate" style={{ color: C.text }}>{c.course_title}</p>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded ml-2"
                        style={{ background: c.status === "completed" ? "#132a22" : "#1a2030", color: c.status === "completed" ? C.green : C.muted }}>
                        {c.status === "completed" ? "✓ Done" : `${c.progress_pct}%`}
                      </span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: "#111827" }}>
                      <div className="h-1 rounded-full" style={{ width: `${c.progress_pct}%`, background: c.status === "completed" ? C.green : C.blue2 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}