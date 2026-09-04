import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Sparkles, Mail, Lock, ArrowRight, Loader2,
  AlertTriangle, Eye, EyeOff, FileText, Video, Target,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const navigate       = useNavigate();
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [showPass, setShow]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) { setError("Email and password are required."); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      // Store user info
      sessionStorage.setItem("evolva_user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bullets = [
    { icon: FileText, label: "Resume ATS Scorer"  },
    { icon: Target,   label: "Skill Gap Analyzer" },
    { icon: Video,    label: "AI Mock Interviews" },
  ];

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
          <h1 className="font-display font-extrabold text-4xl text-white mb-5 leading-tight">
            Your AI-Powered<br />
            <span style={{ background: "linear-gradient(90deg,#8b6bf7,#14c88e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Career Engine
            </span>
          </h1>
          <p className="text-sm mb-8 max-w-xs" style={{ color: "#9aa0bd", lineHeight: 1.7 }}>
            From skill gap to job offer — Evolva guides every step of your placement journey with real AI, not templates.
          </p>
          <div className="flex flex-wrap gap-3">
            {bullets.map((b, i) => (
              <span key={i} className="flex items-center gap-2 text-xs font-semibold text-white px-3 py-2 rounded-full"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <b.icon size={13} /> {b.label}
              </span>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: "#5a6480" }}>
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold" style={{ color: "#8b6bf7" }}>Register →</Link>
        </p>

        <div className="absolute top-20 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "#5865f2" }} />
        <div className="absolute bottom-16 left-10 w-48 h-48 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: "#14c88e" }} />
      </div>

      {/* ── Right form panel ─────────────────────────────────────────── */}
      <div className="flex items-center justify-center p-8 min-h-screen" style={{ background: "#f7f7fb" }}>
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#5865f2,#8b6bf7,#14c88e)" }}>
              <Sparkles size={15} color="#fff" />
            </div>
            <span className="font-display font-extrabold text-lg" style={{ color: "#12142b" }}>EVOLVA</span>
          </div>

          <h2 className="font-display font-bold text-2xl mb-1" style={{ color: "#12142b" }}>Welcome back</h2>
          <p className="text-sm mb-8" style={{ color: "#5a5f78" }}>
            Sign in to continue your placement preparation.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#12142b" }}>
                Email Address
              </label>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-3 bg-white focus-within:border-indigo-500 transition-colors"
                style={{ borderColor: "#dcdcea" }}>
                <Mail size={15} color="#9295ab" />
                <input
                  type="email" value={email} autoFocus autoComplete="email"
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@example.com"
                  className="w-full text-sm bg-transparent outline-none"
                  style={{ color: "#12142b" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#12142b" }}>
                Password
              </label>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-3 bg-white focus-within:border-indigo-500 transition-colors"
                style={{ borderColor: "#dcdcea" }}>
                <Lock size={15} color="#9295ab" />
                <input
                  type={showPass ? "text" : "password"} value={password}
                  onChange={(e) => { setPass(e.target.value); setError(""); }}
                  placeholder="Your password"
                  autoComplete="current-password"
                  className="w-full text-sm bg-transparent outline-none"
                  style={{ color: "#12142b" }}
                />
                <button type="button" onClick={() => setShow((s) => !s)}>
                  {showPass ? <EyeOff size={15} color="#9295ab" /> : <Eye size={15} color="#9295ab" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 text-xs p-3 rounded-xl" style={{ background: "#fef2f2", color: "#b91c1c" }}>
                <AlertTriangle size={13} className="mt-0.5 shrink-0" /> {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl disabled:opacity-60 mt-2"
              style={{ background: "linear-gradient(90deg,#4338ec,#6d5bf5)" }}>
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Signing in…</>
                : <><ArrowRight size={16} /> Sign In</>}
            </button>

            <p className="text-center text-xs pt-1" style={{ color: "#9295ab" }}>
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold" style={{ color: "#4338ec" }}>Create one free</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}