import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, ArrowRight, PlayCircle, FileText, Target, BookOpen, Video,
  BarChart3, ChevronRight, Zap, GraduationCap,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const goLogin    = () => navigate("/login");
  const goRegister = () => navigate("/register");

  const modules = [
    { icon: FileText, title: "AI Resume Analyzer", desc: "Instant structural analysis and ATS compatibility scoring. Receive specific modular advice to optimize your resume for Tier-1 tech roles.", color: "#4f6df5" },
    { icon: Target, title: "Skill Gap Analysis", desc: "Evaluate your skillset against real-time industry demands. Identify missing technical competencies and receive targeted recommendations.", color: "#14c88e" },
    { icon: BookOpen, title: "Learning Courses", desc: "Access curated learning paths configured dynamically based on your skill gaps. Track your progress with modular micro-credentials.", color: "#f2a93b" },
    { icon: Video, title: "Mock Interviews", desc: "Practice virtual interviews with our conversational AI. Receive behavioral assessment, communication feedback, and code structure reviews.", color: "#9b6bf7" },
    { icon: Sparkles, title: "Placement Prediction", desc: "Machine learning forecasting models process your performance data to predict job offer probability and match you with companies.", color: "#5865f2" },
    { icon: BarChart3, title: "Progress Dashboard", desc: "Single analytical console visualizing resume score progression, interview history, courseload growth, and mock assessment metrics.", color: "#f2596b" },
  ];

  return (
    <div style={{ background: "#f7f7fb", minHeight: "100vh" }}>
      <nav className="flex items-center justify-between px-10 py-4 border-b" style={{ borderColor: "#ececf5", background: "#fff" }}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#5865f2,#8b6bf7,#14c88e)" }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <span className="font-display font-extrabold text-xl" style={{ color: "#181b2e" }}>EVOLVA</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: "#4b4f66" }}>
          <span className="cursor-pointer">Home</span>
          <span className="cursor-pointer">Features</span>
          <span className="cursor-pointer">How It Works</span>
          <span className="cursor-pointer">Testimonials</span>
          <span className="cursor-pointer">FAQ</span>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={goLogin} className="text-sm font-semibold" style={{ color: "#181b2e" }}>Login</button>
          <button onClick={goRegister} className="flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2.5 rounded-xl" style={{ background: "#4338ec" }}>
            Register <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      <header className="grid md:grid-cols-2 gap-10 px-10 md:px-16 pt-16 pb-24 items-center max-w-7xl mx-auto">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6" style={{ background: "#eceafc", color: "#4338ec" }}>
            <Sparkles size={13} /> Next-Gen Placement Intelligence Platform
          </div>
          <h1 className="font-display font-extrabold leading-tight mb-6" style={{ fontSize: 52, color: "#12142b" }}>
            Transform Your{" "}
            <span style={{ background: "linear-gradient(90deg,#4338ec,#14c88e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Skills</span>{" "}
            into Career Success with AI
          </h1>
          <p className="text-base mb-8 max-w-md" style={{ color: "#5a5f78", lineHeight: 1.7 }}>
            AI-powered placement preparation platform providing personalized learning path design, automated resume analysis, interactive mock interviews, skill gap assessments, and placement probability predictions.
          </p>
          <div className="flex items-center gap-4 mb-10">
            <button onClick={goLogin} className="flex items-center gap-2 text-white font-semibold px-6 py-3.5 rounded-xl" style={{ background: "#4338ec" }}>
              Get Started Free <ArrowRight size={16} />
            </button>
            <button className="flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl border" style={{ borderColor: "#dcdcea", color: "#12142b" }}>
              <PlayCircle size={16} /> Learn More
            </button>
          </div>
          <div className="flex items-center gap-6 text-xs font-semibold tracking-wide" style={{ color: "#9295ab" }}>
            <span>TRUSTED BY TECH STUDENTS</span><span>&middot;</span><span>AI-DRIVEN ANALYSIS</span>
          </div>
        </div>

        <div className="relative h-[420px] hidden md:block">
          <div className="absolute rounded-2xl p-5 shadow-xl float-slow" style={{ top: 30, right: 40, width: 300, background: "#fff", border: "1px solid #ececf5" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold px-2 py-1 rounded-md" style={{ background: "#eafff5", color: "#0ea973" }}>AI ACTIVE</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="w-2 h-2 rounded-full bg-amber-300" />
                <span className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold" style={{ color: "#7a7e94" }}>Interview Score</span>
              <span className="text-xs font-bold" style={{ color: "#0ea973" }}>88%</span>
            </div>
            <div className="w-full h-2 rounded-full mb-4" style={{ background: "#eef0f7" }}>
              <div className="h-2 rounded-full" style={{ width: "88%", background: "#0ea973" }} />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold" style={{ color: "#7a7e94" }}>Placement Prediction</span>
              <span className="text-xs font-bold" style={{ color: "#4338ec" }}>Highly Likely</span>
            </div>
            <div className="flex items-end gap-1.5 h-12">
              {[30, 45, 55, 70, 90].map((h, i) => (
                <div key={i} className="flex-1 rounded" style={{ height: `${h}%`, background: "linear-gradient(180deg,#8b6bf7,#4338ec)" }} />
              ))}
            </div>
          </div>
          <div className="absolute rounded-xl p-3 shadow-lg float-slower" style={{ top: 10, right: 320, width: 160, background: "#fff", border: "1px solid #ececf5" }}>
            <div className="flex items-center gap-2 mb-1"><FileText size={14} color="#4338ec" /><span className="text-xs font-semibold" style={{ color: "#7a7e94" }}>Resume Score</span></div>
            <span className="font-display font-extrabold text-lg">92 / 100</span>
          </div>
          <div className="absolute rounded-xl p-3 shadow-lg float-slow" style={{ bottom: 60, right: 10, width: 170, background: "#fff", border: "1px solid #ececf5" }}>
            <div className="flex items-center gap-2 mb-1"><Zap size={14} color="#0ea973" /><span className="text-xs font-semibold" style={{ color: "#7a7e94" }}>Skills Scanned</span></div>
            <span className="font-display font-extrabold text-lg">14 Core Skills</span>
          </div>
          <div className="absolute rounded-xl p-3 shadow-lg float-slower" style={{ bottom: 0, right: 200, width: 170, background: "#fff", border: "1px solid #ececf5" }}>
            <div className="flex items-center gap-2 mb-1"><GraduationCap size={14} color="#f2a93b" /><span className="text-xs font-semibold" style={{ color: "#7a7e94" }}>Next Course</span></div>
            <span className="font-display font-extrabold text-sm">System Design</span>
          </div>
        </div>
      </header>

      <section className="px-10 md:px-16 pb-24 max-w-7xl mx-auto">
        <h2 className="font-display font-extrabold text-2xl mb-2" style={{ color: "#12142b" }}>Everything you need, in one place</h2>
        <p className="text-sm mb-10" style={{ color: "#5a5f78" }}>Six modules working together to take you from unsure to placement-ready.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((m, i) => (
            <div key={i} className="rounded-2xl p-6 bg-white border hover:shadow-lg transition-shadow" style={{ borderColor: "#ececf5" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: `${m.color}18` }}>
                <m.icon size={20} color={m.color} />
              </div>
              <h3 className="font-display font-bold text-lg mb-2" style={{ color: "#12142b" }}>{m.title}</h3>
              <p className="text-sm mb-5" style={{ color: "#5a5f78", lineHeight: 1.6 }}>{m.desc}</p>
              <button onClick={goLogin} className="flex items-center gap-1 text-xs font-bold tracking-wide" style={{ color: "#4338ec" }}>
                EXPLORE MODULE <ChevronRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}