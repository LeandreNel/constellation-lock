// Interactive star map for constellation pattern selection
import { useRef, useEffect, useState } from "react";

const NUM_STARS = 15;
const CANVAS_SIZE = 400;

// Generate random star positions with margin from edges
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
  const [sequence, setSequence] = useState([]); // Selected star indices in order
  const [hoveredStar, setHoveredStar] = useState(null);

  // Redraw on state changes
  useEffect(() => {
    draw();
  }, [sequence, hoveredStar]);

  // Draw canvas with stars, connections, and labels
  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Dark background
    ctx.fillStyle = "#0a0a2e";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Connection lines between selected stars
    ctx.strokeStyle = "rgba(150, 200, 255, 0.6)";
    ctx.lineWidth = 1.5;
    for (let i = 1; i < sequence.length; i++) {
      const startStar = stars[sequence[i - 1]];
      const endStar = stars[sequence[i]];
      ctx.beginPath();
      ctx.moveTo(startStar.x, startStar.y);
      ctx.lineTo(endStar.x, endStar.y);
      ctx.stroke();
    }

    // Draw stars
    stars.forEach((star, i) => {
      const isSelected = sequence.includes(i);
      const isHovered = hoveredStar === i;

      // Size changes based on state
      const radius = isSelected ? 7 : isHovered ? 6 : 4;

      // Draw star circle
      ctx.beginPath();
      ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
      // Color changes based on state
      ctx.fillStyle = isSelected ? "#fff" : isHovered ? "#aad4ff" : "#6a90c8";
      ctx.fill();

      // Show order number on selected stars
      if (isSelected) {
        const orderNumber = sequence.indexOf(i) + 1;
        ctx.fillStyle = "#0a0a2e";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(orderNumber, star.x, star.y);
      }
    });
  }

  // Get star index at clicked position
  function getClickedStar(x, y) {
    return stars.findIndex((s) => Math.hypot(s.x - x, s.y - y) < 15);
  }

  // Handle star selection (add, undo, prevent duplicates)
  function handleClick(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const starIndex = getClickedStar(x, y);

    if (starIndex === -1) return;

    setSequence((prev) => {
      // Allow undo by clicking last selected star
      if (prev[prev.length - 1] === starIndex) {
        return prev.slice(0, -1);
      }

      // Prevent duplicate selections
      if (prev.includes(starIndex)) {
        return prev;
      }

      // Add new star
      const next = [...prev, starIndex];

      if (next.length >= minStars) {
        onSequenceComplete(next);
      }

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
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        className="star-canvas"
      />
      <div className="star-info">
        {sequence.length < minStars
          ? `Select at least ${minStars} stars`
          : `✓ ${sequence.length} stars selected`}
      </div>
      <button onClick={handleReset} className="btn-reset">
        Reset
      </button>
    </div>
  );
}
