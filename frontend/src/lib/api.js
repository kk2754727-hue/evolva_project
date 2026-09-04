const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function parseJsonSafely(res) {
  try { return await res.json(); } catch { return null; }
}

// Attach X-User-Id header so backend can save data to the right student
function authHeaders() {
  try {
    const raw = sessionStorage.getItem("evolva_user");
    if (!raw) return { "Content-Type": "application/json" };
    const user = JSON.parse(raw);
    const id   = typeof user === "object" ? user.id : null;
    return {
      "Content-Type": "application/json",
      ...(id ? { "X-User-Id": String(id) } : {}),
    };
  } catch {
    return { "Content-Type": "application/json" };
  }
}

async function apiFetch(path, options = {}) {
  const res  = await fetch(`${API_BASE}${path}`, {
    headers: authHeaders(),
    ...options,
  });
  const data = await parseJsonSafely(res);
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

// ── Auth ───────────────────────────────────────────────────────────────────
export async function registerUser(payload) {
  return apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });
}

export async function loginUser(email, password) {
  return apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

// ── Student profile & progress ────────────────────────────────────────────
export async function getProfile() {
  return apiFetch("/api/student/profile");
}

export async function updateProfile(fields) {
  return apiFetch("/api/student/profile", { method: "PUT", body: JSON.stringify(fields) });
}

export async function getResumeHistory() {
  return apiFetch("/api/student/resume-history");
}

export async function getCourseProgress() {
  return apiFetch("/api/student/course-progress");
}

export async function saveCourseProgress(payload) {
  return apiFetch("/api/student/course-progress", { method: "POST", body: JSON.stringify(payload) });
}

export async function completeAssessment(payload) {
  return apiFetch("/api/courses/complete-assessment", { method: "POST", body: JSON.stringify(payload) });
}

export async function getInterviewHistory() {
  return apiFetch("/api/student/interview-history");
}

export async function saveInterviewSession(payload) {
  return apiFetch("/api/interview/save-session", { method: "POST", body: JSON.stringify(payload) });
}

export async function getSkillScores() {
  return apiFetch("/api/student/skills");
}

export async function saveSkillScores(skills) {
  return apiFetch("/api/student/skills", { method: "POST", body: JSON.stringify({ skills }) });
}

// ── Interview ─────────────────────────────────────────────────────────────
export async function evaluateAnswer(question, answer, durationSeconds) {
  const body = { question, answer };
  if (durationSeconds) body.duration_seconds = durationSeconds;
  return apiFetch("/api/interview/evaluate", { method: "POST", body: JSON.stringify(body) });
}

export async function analyzeFrame(base64Image) {
  return apiFetch("/api/interview/analyze-frame", {
    method: "POST", body: JSON.stringify({ image: base64Image }),
  });
}

// ── Resume ────────────────────────────────────────────────────────────────
export async function analyzeResume(file, targetRole) {
  const formData = new FormData();
  formData.append("resume", file);
  if (targetRole) formData.append("target_role", targetRole);
  // For file upload we can't use authHeaders() directly (no Content-Type override)
  const uid = (() => { try { const u = JSON.parse(sessionStorage.getItem("evolva_user")); return u?.id; } catch { return null; } })();
  const res = await fetch(`${API_BASE}/api/resume/analyze`, {
    method: "POST",
    headers: uid ? { "X-User-Id": String(uid) } : {},
    body: formData,
  });
  const data = await parseJsonSafely(res);
  if (!res.ok) throw new Error(data?.error || `Resume analysis failed (${res.status})`);
  return data;
}

// ── Courses ────────────────────────────────────────────────────────────────
export async function recommendCourses(payload) {
  return apiFetch("/api/courses/recommend", { method: "POST", body: JSON.stringify(payload) });
}

export async function generateCourseContent(payload) {
  return apiFetch("/api/courses/generate-content", { method: "POST", body: JSON.stringify(payload) });
}

export async function generateAssessment(payload) {
  return apiFetch("/api/courses/generate-assessment", { method: "POST", body: JSON.stringify(payload) });
}