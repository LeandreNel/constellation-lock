// Main app router - handles navigation between register, login, and dashboard
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Authenticated user dashboard (placeholder)
function Dashboard() {
  return (
    <div className="page">
      <div
        style={{ textAlign: "center", animation: "fadeInDown 0.8s ease-out" }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          Welcome, Star Navigator!
        </h1>
        <p
          style={{ fontSize: "1.1rem", color: "#aad4ff", marginBottom: "3rem" }}
        >
          Your constellation has unlocked infinite possibilities
        </p>
        <button
          className="btn"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Animated nebula background */}
      <div className="nebula-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
