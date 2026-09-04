import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Sparkles, User, Mail, Lock, GraduationCap, BookOpen,
  Phone, Target, ArrowRight, Loader2, AlertTriangle,
  CheckCircle2, Eye, EyeOff,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const YEARS   = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Alumni"];
const ROLES   = [
  "Software Engineer (SDE)", "Data Scientist", "Backend Developer",
  "Full Stack Developer", "Frontend Developer", "Data Analyst",
  "ML Engineer", "DevOps Engineer", "Cybersecurity Analyst", "Other",
];
const BRANCHES = [
  "Computer Science (CSE)", "Information Technology (IT)",
  "Electronics & Communication (ECE)", "Electrical Engineering (EEE)",
  "Mechanical Engineering (ME)", "Civil Engineering (CE)",
  "Artificial Intelligence (AI)", "Data Science (DS)", "Other",
];

function Field({ icon: Icon, label, children, required }) {
  return (
    <div>
      <label className="text-xs font-semibold mb-1.5 flex items-center gap-1" style={{ color: "#12142b" }}>
        {label}{required && <span style={{ color: "#e53e3e" }}>*</span>}
      </label>
      <div className="flex items-center gap-2 border rounded-xl px-3 py-3 bg-white focus-within:border-indigo-500 transition-colors" style={{ borderColor: "#dcdcea" }}>
        <Icon size={15} color="#9295ab" className="shrink-0" />
        {children}
      </div>
    </div>
  );
}

function SelectField({ icon: Icon, label, value, onChange, options, placeholder, required }) {
  return (
    <div>
      <label className="text-xs font-semibold mb-1.5 flex items-center gap-1" style={{ color: "#12142b" }}>
        {label}{required && <span style={{ color: "#e53e3e" }}>*</span>}
      </label>
      <div className="flex items-center gap-2 border rounded-xl px-3 py-3 bg-white focus-within:border-indigo-500 transition-colors" style={{ borderColor: "#dcdcea" }}>
        <Icon size={15} color="#9295ab" className="shrink-0" />
        <select
          value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full text-sm bg-transparent outline-none"
          style={{ color: value ? "#12142b" : "#9295ab" }}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "", email: "", password: "", confirm_password: "",
    college: "", year: "", branch: "", target_role: "", phone: "",
  });
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState(false);

  const set = (key) => (val) => {
    setForm((f) => ({ ...f, [key]: typeof val === "string" ? val : val.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.full_name.trim())   return "Full name is required.";
    if (!form.email.trim())       return "Email is required.";
    if (!form.password)           return "Password is required.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirm_password) return "Passwords do not match.";
    if (!form.college.trim())     return "College name is required.";
    if (!form.year)               return "Please select your year.";
    if (!form.branch)             return "Please select your branch.";
    if (!form.target_role)        return "Please select your target role.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name:   form.full_name.trim(),
          email:       form.email.trim().toLowerCase(),
          password:    form.password,
          college:     form.college.trim(),
          year:        form.year,
          branch:      form.branch,
          target_role: form.target_role,
          phone:       form.phone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed.");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f7f7fb" }}>
        <div className="text-center p-10 rounded-3xl bg-white shadow-sm" style={{ border: "1px solid #ececf5" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg,#d1fae5,#e0f2fe)" }}>
            <CheckCircle2 size={32} color="#059669" />
          </div>
          <h2 className="font-display font-bold text-xl mb-1" style={{ color: "#12142b" }}>Account Created!</h2>
          <p className="text-sm mb-1" style={{ color: "#5a5f78" }}>Welcome to Evolva, {form.full_name.split(" ")[0]}!</p>
          <p className="text-xs" style={{ color: "#9295ab" }}>Redirecting you to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* ── Left brand panel ─────────────────────────────────────────── */}
      <div className="hidden md:flex flex-col justify-between p-12 relative"
        style={{ background: "linear-gradient(160deg,#0d1130 0%,#0a0e17 60%,#101a10 100%)" }}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#5865f2,#8b6bf7,#14c88e)" }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <span className="font-display font-extrabold text-xl text-white">EVOLVA</span>
        </div>

        <div>
          <h1 className="font-display font-extrabold text-4xl text-white mb-4 leading-tight">
            Start Your<br />
            <span style={{ background: "linear-gradient(90deg,#8b6bf7,#14c88e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Placement Journey
            </span>
          </h1>
          <p className="text-sm max-w-xs mb-8" style={{ color: "#9aa0bd", lineHeight: 1.7 }}>
            Create your profile once — Evolva uses it to personalise your skill gap analysis, course recommendations, and interview practice.
          </p>
          {[
            "AI-powered skill gap analysis tailored to your role",
            "Personalised course roadmap based on your branch & year",
            "Mock interviews scored by AI with real feedback",
            "Resume ATS scoring with actionable improvements",
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2 mb-2.5">
              <CheckCircle2 size={14} color="#14c88e" className="mt-0.5 shrink-0" />
              <span className="text-xs" style={{ color: "#9aa0bd" }}>{t}</span>
            </div>
          ))}
        </div>

        <p className="text-xs" style={{ color: "#5a6480" }}>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold" style={{ color: "#8b6bf7" }}>Sign in →</Link>
        </p>

        <div className="absolute top-20 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "#5865f2" }} />
        <div className="absolute bottom-16 left-10 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: "#14c88e" }} />
      </div>

      {/* ── Right form panel ─────────────────────────────────────────── */}
      <div className="flex items-start justify-center p-8 overflow-y-auto" style={{ background: "#f7f7fb" }}>
        <div className="w-full max-w-sm py-6">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 md:hidden cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#5865f2,#8b6bf7,#14c88e)" }}>
              <Sparkles size={15} color="#fff" />
            </div>
            <span className="font-display font-extrabold text-lg" style={{ color: "#12142b" }}>EVOLVA</span>
          </div>

          <h2 className="font-display font-bold text-2xl mb-1" style={{ color: "#12142b" }}>Create your account</h2>
          <p className="text-sm mb-6" style={{ color: "#5a5f78" }}>
            Fill in your details — this helps Evolva personalise everything for you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">

            {/* ── Personal info ── */}
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#9295ab" }}>Personal Info</p>

            <Field icon={User} label="Full Name" required>
              <input value={form.full_name} onChange={set("full_name")} placeholder="e.g. Arun Kumar"
                className="w-full text-sm bg-transparent outline-none" style={{ color: "#12142b" }} />
            </Field>

            <Field icon={Mail} label="Email Address" required>
              <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com"
                className="w-full text-sm bg-transparent outline-none" style={{ color: "#12142b" }} />
            </Field>

            <Field icon={Phone} label="Phone Number">
              <input type="tel" value={form.phone} onChange={set("phone")} placeholder="10-digit mobile number"
                className="w-full text-sm bg-transparent outline-none" style={{ color: "#12142b" }} />
            </Field>

            {/* ── Password ── */}
            <p className="text-[10px] font-bold uppercase tracking-widest pt-1" style={{ color: "#9295ab" }}>Password</p>

            <Field icon={Lock} label="Password" required>
              <input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")}
                placeholder="At least 6 characters"
                className="w-full text-sm bg-transparent outline-none" style={{ color: "#12142b" }} />
              <button type="button" onClick={() => setShowPass((s) => !s)}>
                {showPass ? <EyeOff size={15} color="#9295ab" /> : <Eye size={15} color="#9295ab" />}
              </button>
            </Field>

            <Field icon={Lock} label="Confirm Password" required>
              <input type={showConfirm ? "text" : "password"} value={form.confirm_password} onChange={set("confirm_password")}
                placeholder="Re-enter password"
                className="w-full text-sm bg-transparent outline-none" style={{ color: "#12142b" }} />
              <button type="button" onClick={() => setShowConfirm((s) => !s)}>
                {showConfirm ? <EyeOff size={15} color="#9295ab" /> : <Eye size={15} color="#9295ab" />}
              </button>
            </Field>

            {/* ── Academic info ── */}
            <p className="text-[10px] font-bold uppercase tracking-widest pt-1" style={{ color: "#9295ab" }}>Academic Info</p>

            <Field icon={GraduationCap} label="College / University" required>
              <input value={form.college} onChange={set("college")} placeholder="e.g. VIT Vellore"
                className="w-full text-sm bg-transparent outline-none" style={{ color: "#12142b" }} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <SelectField icon={BookOpen} label="Year" value={form.year} onChange={set("year")}
                options={YEARS} placeholder="Select year" required />
              <SelectField icon={GraduationCap} label="Branch" value={form.branch} onChange={set("branch")}
                options={BRANCHES} placeholder="Select branch" required />
            </div>

            {/* ── Goal ── */}
            <p className="text-[10px] font-bold uppercase tracking-widest pt-1" style={{ color: "#9295ab" }}>Career Goal</p>

            <SelectField icon={Target} label="Target Role" value={form.target_role} onChange={set("target_role")}
              options={ROLES} placeholder="Select your target role" required />

            {/* ── Error ── */}
            {error && (
              <div className="flex items-start gap-2 text-xs p-3 rounded-xl" style={{ background: "#fef2f2", color: "#b91c1c" }}>
                <AlertTriangle size={13} className="mt-0.5 shrink-0" /> {error}
              </div>
            )}

            {/* ── Submit ── */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl disabled:opacity-60 mt-1"
              style={{ background: "linear-gradient(90deg,#4338ec,#6d5bf5)" }}>
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Creating account…</>
                : <><ArrowRight size={16} /> Create Account</>}
            </button>

            <p className="text-center text-xs pt-1" style={{ color: "#9295ab" }}>
              Already have an account?{" "}
              <Link to="/login" className="font-semibold" style={{ color: "#4338ec" }}>Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}