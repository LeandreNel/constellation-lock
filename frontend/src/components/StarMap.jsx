import { useRef, useEffect, useState } from "react";

const NUM_STARS = 15;
const CANVAS_SIZE = 400;

function generateStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * (CANVAS_SIZE - 60) + 30,
    y: Math.random() * (CANVAS_SIZE - 60) + 30,
  }));
}

export default function StarMap({ onSequenceComplete, minStars = 4 }) {
  const canvasRef = useRef(null);
  const [stars] = useState(() => generateStars(NUM_STARS));
  const [sequence, setSequence] = useState([]);
  const [hoveredStar, setHoveredStar] = useState(null);

  useEffect(() => {
    draw();
  }, [sequence, hoveredStar]);

  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Background
    ctx.fillStyle = "#0a0a2e";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw lines between selected stars
    ctx.strokeStyle = "rgba(150, 200, 255, 0.6)";
    ctx.lineWidth = 1.5;
    for (let i = 1; i < sequence.length; i++) {
      const a = stars[sequence[i - 1]];
      const b = stars[sequence[i]];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    // Draw stars
    stars.forEach((star, i) => {
      const isSelected = sequence.includes(i);
      const isHovered = hoveredStar === i;
      const radius = isSelected ? 7 : isHovered ? 6 : 4;

      ctx.beginPath();
      ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? "#fff" : isHovered ? "#aad4ff" : "#6a90c8";
      ctx.fill();

      // Order number label
      if (isSelected) {
        const order = sequence.indexOf(i) + 1;
        ctx.fillStyle = "#0a0a2e";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(order, star.x, star.y);
      }
    });
  }

  function getClickedStar(x, y) {
    return stars.findIndex((s) => Math.hypot(s.x - x, s.y - y) < 15);
  }

  function handleClick(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const starIndex = getClickedStar(x, y);
    if (starIndex === -1) return;

    setSequence((prev) => {
      // Toggle off if already last selected
      if (prev[prev.length - 1] === starIndex) return prev.slice(0, -1);
      // Prevent duplicates
      if (prev.includes(starIndex)) return prev;
      const next = [...prev, starIndex];
      if (next.length >= minStars) onSequenceComplete(next);
      return next;
    });
  }

  function handleMouseMove(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoveredStar(getClickedStar(x, y));
  }

  function handleReset() {
    setSequence([]);
    onSequenceComplete([]);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        style={{
          borderRadius: "1rem",
          cursor: "crosshair",
          border: "1px solid #2a2a6e",
        }}
      />
      <div style={{ color: "#aad4ff", fontSize: "0.9rem" }}>
        {sequence.length < minStars
          ? `Select at least ${minStars} stars`
          : `✓ ${sequence.length} stars selected`}
      </div>
      <button
        onClick={handleReset}
        style={{
          background: "transparent",
          color: "#6a90c8",
          border: "1px solid #6a90c8",
          borderRadius: "0.5rem",
          padding: "0.4rem 1rem",
          cursor: "pointer",
        }}
      >
        Reset
      </button>
    </div>
  );
}
