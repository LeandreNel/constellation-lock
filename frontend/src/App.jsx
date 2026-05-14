import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

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

export default function App() {
  return (
    <BrowserRouter>
      <div className="nebula-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
