import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const STARS = [
  { x: 0.08, y: 0.12, r: 1.8, brightness: 0.9 },
  { x: 0.21, y: 0.05, r: 1.2, brightness: 0.7 },
  { x: 0.35, y: 0.11, r: 2.0, brightness: 1.0 },
  { x: 0.52, y: 0.07, r: 1.4, brightness: 0.8 },
  { x: 0.67, y: 0.13, r: 1.6, brightness: 0.9 },
  { x: 0.81, y: 0.06, r: 1.1, brightness: 0.6 },
  { x: 0.93, y: 0.15, r: 1.9, brightness: 0.95 },
  { x: 0.05, y: 0.25, r: 1.3, brightness: 0.7 },
  { x: 0.17, y: 0.31, r: 1.7, brightness: 0.85 },
  { x: 0.29, y: 0.22, r: 1.0, brightness: 0.6 },
  { x: 0.44, y: 0.28, r: 2.1, brightness: 1.0 },
  { x: 0.58, y: 0.19, r: 1.5, brightness: 0.8 },
  { x: 0.72, y: 0.26, r: 1.2, brightness: 0.7 },
  { x: 0.86, y: 0.21, r: 1.8, brightness: 0.9 },
  { x: 0.96, y: 0.3, r: 1.4, brightness: 0.75 },
  { x: 0.11, y: 0.4, r: 1.6, brightness: 0.85 },
  { x: 0.24, y: 0.45, r: 1.1, brightness: 0.65 },
  { x: 0.38, y: 0.37, r: 1.9, brightness: 0.95 },
  { x: 0.51, y: 0.42, r: 1.3, brightness: 0.7 },
  { x: 0.63, y: 0.35, r: 2.0, brightness: 1.0 },
  { x: 0.77, y: 0.41, r: 1.5, brightness: 0.8 },
  { x: 0.9, y: 0.38, r: 1.2, brightness: 0.7 },
  { x: 0.03, y: 0.52, r: 1.7, brightness: 0.88 },
  { x: 0.16, y: 0.58, r: 1.4, brightness: 0.75 },
  { x: 0.3, y: 0.53, r: 1.0, brightness: 0.6 },
  { x: 0.43, y: 0.6, r: 1.8, brightness: 0.9 },
  { x: 0.56, y: 0.55, r: 2.2, brightness: 1.0 },
  { x: 0.7, y: 0.57, r: 1.3, brightness: 0.72 },
  { x: 0.83, y: 0.52, r: 1.6, brightness: 0.85 },
  { x: 0.95, y: 0.6, r: 1.1, brightness: 0.65 },
  { x: 0.08, y: 0.68, r: 1.9, brightness: 0.95 },
  { x: 0.22, y: 0.72, r: 1.5, brightness: 0.8 },
  { x: 0.36, y: 0.66, r: 1.2, brightness: 0.7 },
  { x: 0.49, y: 0.74, r: 1.7, brightness: 0.88 },
  { x: 0.62, y: 0.69, r: 1.4, brightness: 0.75 },
  { x: 0.75, y: 0.73, r: 2.0, brightness: 1.0 },
  { x: 0.88, y: 0.67, r: 1.3, brightness: 0.72 },
  { x: 0.97, y: 0.75, r: 1.6, brightness: 0.85 },
  { x: 0.14, y: 0.82, r: 1.1, brightness: 0.65 },
  { x: 0.27, y: 0.87, r: 1.8, brightness: 0.9 },
  { x: 0.41, y: 0.8, r: 1.5, brightness: 0.8 },
  { x: 0.54, y: 0.88, r: 1.2, brightness: 0.7 },
  { x: 0.68, y: 0.83, r: 1.9, brightness: 0.95 },
  { x: 0.8, y: 0.89, r: 1.4, brightness: 0.75 },
  { x: 0.92, y: 0.84, r: 1.7, brightness: 0.88 },
  { x: 0.06, y: 0.93, r: 1.3, brightness: 0.72 },
  { x: 0.19, y: 0.96, r: 2.0, brightness: 1.0 },
  { x: 0.33, y: 0.92, r: 1.6, brightness: 0.85 },
  { x: 0.47, y: 0.97, r: 1.1, brightness: 0.65 },
  { x: 0.6, y: 0.94, r: 1.8, brightness: 0.9 },
  { x: 0.73, y: 0.91, r: 1.4, brightness: 0.75 },
  { x: 0.85, y: 0.95, r: 1.5, brightness: 0.8 },
  { x: 0.13, y: 0.17, r: 1.2, brightness: 0.68 },
  { x: 0.26, y: 0.33, r: 1.6, brightness: 0.83 },
  { x: 0.4, y: 0.2, r: 1.0, brightness: 0.62 },
  { x: 0.55, y: 0.31, r: 1.7, brightness: 0.87 },
  { x: 0.69, y: 0.18, r: 1.3, brightness: 0.73 },
  { x: 0.84, y: 0.33, r: 1.9, brightness: 0.93 },
  { x: 0.1, y: 0.48, r: 1.5, brightness: 0.79 },
  { x: 0.23, y: 0.62, r: 1.1, brightness: 0.66 },
  { x: 0.37, y: 0.48, r: 2.0, brightness: 0.98 },
  { x: 0.5, y: 0.64, r: 1.4, brightness: 0.76 },
  { x: 0.64, y: 0.47, r: 1.6, brightness: 0.84 },
  { x: 0.78, y: 0.63, r: 1.2, brightness: 0.69 },
  { x: 0.91, y: 0.48, r: 1.8, brightness: 0.91 },
  { x: 0.15, y: 0.76, r: 1.3, brightness: 0.74 },
  { x: 0.28, y: 0.78, r: 1.7, brightness: 0.86 },
  { x: 0.42, y: 0.71, r: 1.0, brightness: 0.63 },
  { x: 0.57, y: 0.79, r: 1.5, brightness: 0.81 },
  { x: 0.71, y: 0.78, r: 1.9, brightness: 0.94 },
  { x: 0.87, y: 0.76, r: 1.2, brightness: 0.68 },
  { x: 0.04, y: 0.85, r: 1.6, brightness: 0.83 },
  { x: 0.32, y: 0.85, r: 1.4, brightness: 0.77 },
  { x: 0.46, y: 0.9, r: 1.1, brightness: 0.64 },
  { x: 0.59, y: 0.86, r: 1.7, brightness: 0.89 },
  { x: 0.74, y: 0.86, r: 1.3, brightness: 0.71 },
  { x: 0.94, y: 0.91, r: 1.5, brightness: 0.82 },
  { x: 0.2, y: 0.08, r: 1.8, brightness: 0.92 },
].map((s, i) => ({ ...s, id: i }));

const CANVAS_SIZE = 300;
const CLICK_RADIUS = 22;

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [sequence, setSequence] = useState([]);
  const [msg, setMsg] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    drawCanvas();
  }, [sequence]);

  function drawCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = CANVAS_SIZE;
    ctx.clearRect(0, 0, size, size);

    // Background
    ctx.fillStyle = "rgba(5, 5, 24, 0.95)";
    ctx.fillRect(0, 0, size, size);

    // Draw constellation lines
    if (sequence.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(123, 104, 238, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      for (let i = 0; i < sequence.length - 1; i++) {
        const a = STARS[sequence[i]];
        const b = STARS[sequence[i + 1]];
        ctx.moveTo(a.x * size, a.y * size);
        ctx.lineTo(b.x * size, b.y * size);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw stars
    STARS.forEach((star, i) => {
      const isSelected = sequence.includes(i);
      const selIndex = sequence.indexOf(i);
      const x = star.x * size;
      const y = star.y * size;

      // Glow for selected stars
      if (isSelected) {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 14);
        glow.addColorStop(0, "rgba(123,104,238,0.4)");
        glow.addColorStop(1, "rgba(123,104,238,0)");
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();
      }

      // Star dot
      ctx.beginPath();
      ctx.arc(x, y, isSelected ? star.r + 2 : star.r, 0, Math.PI * 2);
      ctx.fillStyle = isSelected
        ? "#b39dff"
        : `rgba(200,210,255,${star.brightness})`;
      ctx.fill();

      // Sequence number label
      if (isSelected) {
        ctx.fillStyle = "#e0d8ff";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(selIndex + 1, x, y - 10);
      }
    });
  }

  function handleCanvasClick(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    // Find closest star within click radius
    let closest = null;
    let minDist = CLICK_RADIUS;
    STARS.forEach((star, i) => {
      const dx = star.x * CANVAS_SIZE - mx;
      const dy = star.y * CANVAS_SIZE - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });

    if (closest === null) return;

    // Toggle star selection
    setSequence((prev) => {
      if (prev.includes(closest)) {
        return prev.filter((id) => id !== closest);
      }
      return [...prev, closest];
    });
  }

  async function handleSubmit() {
    if (!username.trim() || !email.trim()) {
      setIsError(true);
      setMsg("Please fill in your username and email.");
      return;
    }
    if (sequence.length < 3) {
      setIsError(true);
      setMsg("Select at least 3 stars to form your constellation.");
      return;
    }

    setLoading(true);
    setMsg(null);
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        sequence,
      });
      setIsError(false);
      setMsg("Account created! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setIsError(true);
      setMsg(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Constellation Lock</h1>
      <p>Create your account &amp; draw your constellation key</p>

      <input
        className="input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="canvas-container">
        <p className="star-info">
          {sequence.length === 0
            ? "Click stars to draw your constellation key"
            : `${sequence.length} star${sequence.length !== 1 ? "s" : ""} selected — need at least 3`}
        </p>
        <canvas
          ref={canvasRef}
          className="star-canvas"
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onClick={handleCanvasClick}
        />
        <button
          className="btn-reset"
          onClick={() => setSequence([])}
          disabled={sequence.length === 0}
        >
          Reset Constellation
        </button>
      </div>

      {msg && (
        <div
          className="msg"
          style={{
            color: isError ? "#ff8fa3" : "#aad4ff",
            borderColor: isError
              ? "rgba(255,143,163,0.3)"
              : "rgba(170,212,255,0.3)",
            background: isError
              ? "rgba(255,143,163,0.08)"
              : "rgba(170,212,255,0.1)",
          }}
        >
          {msg}
        </div>
      )}

      <button className="btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating account…" : "Register"}
      </button>

      <p style={{ color: "#6a90c8", fontSize: "0.9rem" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#b39dff", textDecoration: "none" }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
