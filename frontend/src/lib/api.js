// Thin client for the Evolva backend (Flask). Set VITE_API_URL in a .env
// file if the backend isn't running on the default http://localhost:5000.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function evaluateAnswer(question, answer, durationSeconds) {
  const body = { question, answer };
  if (durationSeconds) body.duration_seconds = durationSeconds;

  const res = await fetch(`${API_BASE}/api/interview/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await parseJsonSafely(res);
  if (!res.ok) {
    throw new Error(data?.error || `Evaluation failed (${res.status})`);
  }
  return data;
}

export async function analyzeSkillGap(payload) {
  const res = await fetch(`${API_BASE}/api/skills/analyze-gap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafely(res);
  if (!res.ok) {
    throw new Error(data?.error || `Skill gap analysis failed (${res.status})`);
  }
  return data;
}

export async function recommendCourses(payload) {
  const res = await fetch(`${API_BASE}/api/courses/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafely(res);
  if (!res.ok) {
    throw new Error(data?.error || `Recommendation failed (${res.status})`);
  }
  return data;
}

export async function generateCourseContent(payload) {
  const res = await fetch(`${API_BASE}/api/courses/generate-content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafely(res);
  if (!res.ok) {
    throw new Error(data?.error || `Content generation failed (${res.status})`);
  }
  return data;
}

export async function generateAssessment(payload) {
  const res = await fetch(`${API_BASE}/api/courses/generate-assessment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafely(res);
  if (!res.ok) {
    throw new Error(data?.error || `Assessment generation failed (${res.status})`);
  }
  return data;
}

export async function analyzeResume(file, targetRole) {
  const formData = new FormData();
  formData.append("resume", file);
  if (targetRole) formData.append("target_role", targetRole);

  const res = await fetch(`${API_BASE}/api/resume/analyze`, {
    method: "POST",
    body: formData,
  });
  const data = await parseJsonSafely(res);
  if (!res.ok) {
    throw new Error(data?.error || `Resume analysis failed (${res.status})`);
  }
  return data;
}

export async function analyzeFrame(base64Image) {
  const res = await fetch(`${API_BASE}/api/interview/analyze-frame`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image }),
  });
  const data = await parseJsonSafely(res);
  if (!res.ok) {
    throw new Error(data?.error || `Frame analysis failed (${res.status})`);
  }
  return data;
}