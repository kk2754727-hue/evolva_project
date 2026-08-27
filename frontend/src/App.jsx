import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AppLayout from "./layouts/AppLayout";

import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import SkillGap from "./pages/SkillGap";
import MockInterview from "./pages/MockInterview";
import CameraInterview from "./pages/CameraInterview";
import Placement from "./pages/Placement";
import Recommendations from "./pages/Recommendations";
import CourseDetail from "./pages/CourseDetail";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="/skill-gap" element={<SkillGap />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/mock-interview/camera" element={<CameraInterview />} />
        <Route path="/placement-prediction" element={<Placement />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/recommendations/course" element={<CourseDetail />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
