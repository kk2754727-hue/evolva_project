import { C } from "../lib/theme";
import { FileText, Target, BookOpen, Video, Sparkles, BarChart3, Mic, GraduationCap, TrendingUp, Users, Zap, CheckCircle2 } from "lucide-react";

export const WEEK = [
  { d: "Mon", hours: 2.5, tasks: 1 },
  { d: "Tue", hours: 4, tasks: 3 },
  { d: "Wed", hours: 3, tasks: 2 },
  { d: "Thu", hours: 6.5, tasks: 4 },
  { d: "Fri", hours: 4.5, tasks: 3 },
  { d: "Sat", hours: 5.5, tasks: 4 },
  { d: "Sun", hours: 3, tasks: 2 },
];

export const SKILLS = [
  { name: "Python & DSA", level: "ADVANCED", pct: 90, color: C.blue2 },
  { name: "SQL & Database", level: "ADVANCED", pct: 85, color: C.purple },
  { name: "React & Web Frontend", level: "INTERMEDIATE", pct: 80, color: C.green },
  { name: "Machine Learning Basics", level: "INTERMEDIATE", pct: 70, color: C.red },
  { name: "System Design", level: "BEGINNER", pct: 45, color: C.amber },
  { name: "Communication & Interview", level: "INTERMEDIATE", pct: 60, color: C.blue },
];

export const COURSES = [
  { tag: "PYTHON", level: "Beginner", title: "Python for Placement", desc: "Master core Python syntax, OOP concepts, data structures, and...", inst: "Dr. Aris Vance", init: "DA", rating: 4.9, hrs: "4.5 hrs", students: "4.8k students", progress: 25, grad: "linear-gradient(135deg,#5865f2,#8b6bf7)" },
  { tag: "JAVA", level: "Intermediate", title: "Java Mastery", desc: "Deep dive into Object-Oriented Programming, Collection Framework,...", inst: "Prof. Sarah Jenk...", init: "PS", rating: 4.8, hrs: "14 hrs", students: "4.0k students", progress: 40, grad: "linear-gradient(135deg,#f2a93b,#f2596b)" },
  { tag: "DSA", level: "Advanced", title: "Complete DSA", desc: "Comprehensive guide covering Arrays, Trees, Graphs, Dynamic Programming,...", inst: "Alex Rivera", init: "AR", rating: 4.95, hrs: "28 hrs", students: "8.4k students", progress: 20, grad: "linear-gradient(135deg,#9b6bf7,#5865f2)" },
  { tag: "SQL", level: "Beginner", title: "SQL Essentials", desc: "Learn database design, complex joins, indexing, subqueries, and query...", inst: "Elena Rostova", init: "ER", rating: 4.75, hrs: "4.0 hrs", students: "2.9k students", progress: 90, grad: "linear-gradient(135deg,#14c88e,#5865f2)" },
  { tag: "AI/ML", level: "Intermediate", title: "Machine Learning Foundations", desc: "Supervised and unsupervised learning, model evaluation, and feature...", inst: "Dr. Maya Chen", init: "MC", rating: 4.85, hrs: "18 hrs", students: "6.1k students", progress: 10, grad: "linear-gradient(135deg,#f2596b,#9b6bf7)" },
  { tag: "CLOUD", level: "Beginner", title: "Cloud Fundamentals (AWS)", desc: "Core cloud concepts, EC2, S3, IAM, and deploying your first application...", inst: "Rahul Nair", init: "RN", rating: 4.7, hrs: "9 hrs", students: "3.3k students", progress: 0, grad: "linear-gradient(135deg,#4f6df5,#14c88e)" },
  { tag: "APTITUDE", level: "Beginner", title: "Quantitative Aptitude Bootcamp", desc: "Speed, time & distance, permutations, probability, and logical reasoning...", inst: "Neha Kapoor", init: "NK", rating: 4.6, hrs: "6 hrs", students: "5.5k students", progress: 55, grad: "linear-gradient(135deg,#f2a93b,#14c88e)" },
  { tag: "FRONTEND", level: "Intermediate", title: "React & Modern Frontend", desc: "Hooks, state management, component architecture, and production builds...", inst: "Diego Fernandez", init: "DF", rating: 4.8, hrs: "16 hrs", students: "4.4k students", progress: 65, grad: "linear-gradient(135deg,#5865f2,#14c88e)" },
];

export const RECS = [
  { icon: Target, title: "Close your System Design gap", body: "You're 35% behind target for Tier-1 roles. A focused 2-week sprint on the System Design course would close most of this gap.", tag: "High priority", tagColor: C.red },
  { icon: Mic, title: "Book 3 more behavioral mock interviews", body: "Your technical scores are strong, but communication scoring trails by 20 points. Extra behavioral reps tend to close this fastest.", tag: "Medium priority", tagColor: C.amber },
  { icon: FileText, title: "Add measurable impact to your resume", body: "2 of your 4 project bullets lack quantifiable outcomes. Recruiters scan for numbers first — add metrics like %, time saved, or scale.", tag: "Quick win", tagColor: C.green },
  { icon: GraduationCap, title: "You're placement-ready for SDE-1 roles", body: "Your Python & DSA and SQL scores already clear the Tier-1 bar. Keep sitting mock interviews to hold this level.", tag: "On track", tagColor: C.blue2 },
];

export const NOTIFS = [
  { icon: CheckCircle2, color: C.green, title: "Resume re-scored: 88/100", time: "2 hours ago", read: false },
  { icon: Video, color: C.blue2, title: "Mock interview feedback is ready", time: "5 hours ago", read: false },
  { icon: Target, color: C.amber, title: "New skill gap detected in System Design", time: "1 day ago", read: false },
  { icon: BookOpen, color: C.purple, title: "You completed SQL Essentials — 90%", time: "2 days ago", read: true },
  { icon: TrendingUp, color: C.green, title: "Placement probability rose to 82%", time: "3 days ago", read: true },
];

export const COMPANIES = [
  { name: "Astra Systems", role: "SDE-1", match: 91 },
  { name: "Nimbus Cloud", role: "Backend Engineer", match: 86 },
  { name: "Vertex Labs", role: "ML Intern", match: 78 },
  { name: "Orbit Analytics", role: "Data Engineer", match: 74 },
];

export const INTERVIEW_TRACKS = [
  { id: "tech", title: "Technical (DSA)", desc: "Coding & problem-solving questions with code structure review.", icon: BarChart3, color: C.blue2,
    qs: ["Explain how you'd detect a cycle in a linked list.", "Walk through the time complexity of your last project's core algorithm.", "How would you optimize a function that runs in O(n^2) today?"] },
  { id: "hr", title: "HR Round", desc: "Fit, motivation, and career-goal questions.", icon: Users, color: C.purple,
    qs: ["Why do you want to work at our company?", "Where do you see yourself in three years?", "Tell me about a time you disagreed with a teammate."] },
  { id: "behavioral", title: "Behavioral", desc: "STAR-format questions on teamwork and ownership.", icon: Mic, color: C.amber,
    qs: ["Describe a project where you took ownership under a tight deadline.", "Tell me about a failure and what you learned.", "How do you handle conflicting priorities?"] },
  { id: "system", title: "System Design", desc: "High-level architecture and trade-off discussions.", icon: Zap, color: C.green,
    qs: ["Design a URL shortener at a high level.", "How would you scale a chat application to 1M users?", "What trade-offs would you consider for a rate limiter?"] },
];

export const TIPS = [
  "Strong structure — try quantifying the impact with a specific number.",
  "Good clarity. Slow down slightly on the technical terms for emphasis.",
  "Solid answer — lead with the outcome first, then explain how you got there.",
  "Nice use of a concrete example. Keep responses under 90 seconds.",
];
