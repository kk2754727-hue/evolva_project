import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, FileText, Video, Target, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const bullets = [
    { icon: FileText, label: "Resume Scanner" },
    { icon: Video, label: "Mock AI Interview" },
    { icon: Target, label: "Skill Evaluator" },
  ];

  const handleSignIn = (e) => {
    e.preventDefault();
    // TODO: wire this up to POST /api/auth/login once the backend is ready
    navigate("/dashboard");
  };

  return (
    <div className="grid md:grid-cols-2 min-h-screen">
      <div className="relative p-10 md:p-14 flex flex-col justify-center" style={{ background: "linear-gradient(135deg,#161b3a,#0a0e17)" }}>
        <div className="flex items-center gap-2 mb-16 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#5865f2,#8b6bf7,#14c88e)" }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <span className="font-display font-extrabold text-xl text-white">EVOLVA</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl text-white mb-4">
          Welcome to{" "}
          <span style={{ background: "linear-gradient(90deg,#8b6bf7,#14c88e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>EVOLVA</span>
        </h1>
        <p className="text-sm mb-16 max-w-sm" style={{ color: "#9aa0bd", lineHeight: 1.7 }}>
          AI-powered placement preparation platform translating skill improvements into corporate placement credentials.
        </p>
        <div className="flex flex-wrap gap-3 mb-8">
          {bullets.map((b, i) => (
            <span
              key={i}
              className="flex items-center gap-2 text-xs font-semibold text-white px-3 py-2 rounded-full float-slow"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", animationDelay: `${i * 0.4}s` }}
            >
              <b.icon size={13} /> {b.label}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium" style={{ color: "#6d7396" }}>
          <span>Resume ATS Optimizer</span>
          <span>Conversational Mock Interviews</span>
          <span>Realtime Skill Gap Analysis</span>
          <span>Placement Prediction Analytics</span>
        </div>
      </div>

      <div className="flex items-center justify-center p-8" style={{ background: "#f7f7fb" }}>
        <form onSubmit={handleSignIn} className="w-full max-w-sm">
          <h2 className="font-display font-bold text-2xl mb-1 flex items-center gap-2" style={{ color: "#12142b" }}>
            Sign In <Sparkles size={16} color="#4338ec" />
          </h2>
          <p className="text-sm mb-8" style={{ color: "#5a5f78" }}>Access your skills profile and resume score dashboards.</p>

          <label className="text-xs font-semibold mb-2 block" style={{ color: "#12142b" }}>Email Address *</label>
          <div className="flex items-center gap-2 border rounded-xl px-3 py-3 mb-5 bg-white" style={{ borderColor: "#dcdcea" }}>
            <Mail size={16} color="#9295ab" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@college.edu"
              className="w-full text-sm bg-transparent"
              style={{ color: "#12142b" }}
            />
          </div>

          <label className="text-xs font-semibold mb-2 block" style={{ color: "#12142b" }}>Password *</label>
          <div className="flex items-center gap-2 border rounded-xl px-3 py-3 mb-4 bg-white" style={{ borderColor: "#dcdcea" }}>
            <Lock size={16} color="#9295ab" />
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type your password"
              className="w-full text-sm bg-transparent"
              style={{ color: "#12142b" }}
            />
            <button type="button" onClick={() => setShowPw(!showPw)}>
              {showPw ? <EyeOff size={16} color="#9295ab" /> : <Eye size={16} color="#9295ab" />}
            </button>
          </div>

          <div className="flex items-center justify-between mb-6 text-xs font-medium">
            <label className="flex items-center gap-2" style={{ color: "#5a5f78" }}>
              <input type="checkbox" /> Remember Me
            </label>
            <span style={{ color: "#4338ec" }} className="font-semibold cursor-pointer">Forgot Password?</span>
          </div>

          <button type="submit" className="w-full text-white font-semibold py-3.5 rounded-xl mb-4" style={{ background: "linear-gradient(90deg,#4338ec,#6d5bf5)" }}>
            Sign In
          </button>
          <div className="text-center text-xs mb-4" style={{ color: "#9295ab" }}>OR</div>
          <button type="button" onClick={() => navigate("/dashboard")} className="w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl border bg-white" style={{ borderColor: "#dcdcea", color: "#12142b" }}>
            Continue with Google
          </button>
          <p className="text-center text-xs mt-6" style={{ color: "#5a5f78" }}>
            Don't have an account?{" "}
            <span style={{ color: "#4338ec" }} className="font-semibold cursor-pointer" onClick={() => navigate("/dashboard")}>Register Now</span>
          </p>
        </form>
      </div>
    </div>
  );
}
