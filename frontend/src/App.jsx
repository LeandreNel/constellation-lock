/**
 * ============================================
 * CONSTELLATION LOCK - MAIN APP
 * ============================================
 * Main application component
 * Handles routing between authentication pages
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

/**
 * Dashboard Component
 * Placeholder for authenticated user dashboard
 * Shown after successful login
 */
function Dashboard() {
  return (
    <div
      style={{
        color: "#fff",
        background: "#050518",
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontSize: "2rem",
      }}
    >
      🌌 Welcome, Star Navigator!
    </div>
  );
}

/**
 * Main App Component
 * Sets up routing for entire application
 * Routes:
 * - / → redirects to /register
 * - /register → New user registration
 * - /login → Existing user login
 * - /dashboard → Authenticated user dashboard
 */
export default function App() {
  return (
    <BrowserRouter>
      {/* Animated nebula background with floating blobs */}
      <div className="nebula-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
      </div>

      {/* Application routes */}
      <Routes>
        {/* Redirect root to registration page */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* New user registration */}
        <Route path="/register" element={<Register />} />

        {/* Existing user login */}
        <Route path="/login" element={<Login />} />

        {/* Authenticated user dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
