/**
 * ============================================
 * STAR MAP COMPONENT
 * ============================================
 * Interactive canvas-based star map
 * Users click stars to create their constellation pattern
 * Visual feedback: hover effects, selection highlights, connection lines
 */

import { useRef, useEffect, useState } from "react";

// ============ CONSTANTS ============
const NUM_STARS = 15; // Total number of stars to display
const CANVAS_SIZE = 400; // Canvas dimensions (square)

/**
 * Generate random star positions
 * Stars are positioned within a margin to keep them away from edges
 * @param {number} count - Number of stars to generate
 * @returns {array} Array of star objects with id, x, y coordinates
 */
function generateStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    // Random X position with 30px margin
    x: Math.random() * (CANVAS_SIZE - 60) + 30,
    // Random Y position with 30px margin
    y: Math.random() * (CANVAS_SIZE - 60) + 30,
  }));
}

/**
 * StarMap Component
 * Canvas-based interactive star selection interface
 *
 * @param {function} onSequenceComplete - Callback when minimum stars selected
 * @param {number} minStars - Minimum stars required to enable login/register
 */
export default function StarMap({ onSequenceComplete, minStars = 4 }) {
  // ============ STATE ============
  const canvasRef = useRef(null);
  const [stars] = useState(() => generateStars(NUM_STARS));
  const [sequence, setSequence] = useState([]); // Selected star indices in order
  const [hoveredStar, setHoveredStar] = useState(null); // Currently hovered star

  // ============ EFFECTS ============
  // Redraw canvas whenever sequence or hover state changes
  useEffect(() => {
    draw();
  }, [sequence, hoveredStar]);

  /**
   * Draw the star map canvas
   * Renders:
   * - Dark background
   * - Connection lines between selected stars
   * - Star circles with size based on state (selected/hovered/normal)
   * - Order numbers on selected stars
   */
  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw dark background
    ctx.fillStyle = "#0a0a2e";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // ============ DRAW CONNECTION LINES ============
    // Draw lines connecting selected stars in order
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

    // ============ DRAW STARS ============
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

      // ============ DRAW ORDER LABEL ============
      // Show number label on selected stars
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

  /**
   * Get star index at clicked position
   * Uses distance calculation to check if click is within star radius
   * @param {number} x - Click X coordinate
   * @param {number} y - Click Y coordinate
   * @returns {number} Star index or -1 if no star clicked
   */
  function getClickedStar(x, y) {
    return stars.findIndex((s) => Math.hypot(s.x - x, s.y - y) < 15);
  }

  /**
   * Handle canvas click events
   * Updates sequence by adding clicked star
   * Prevents duplicates and allows undoing last selection
   */
  function handleClick(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const starIndex = getClickedStar(x, y);

    // Do nothing if no star was clicked
    if (starIndex === -1) return;

    setSequence((prev) => {
      // Allow undoing: clicking last selected star removes it
      if (prev[prev.length - 1] === starIndex) {
        return prev.slice(0, -1);
      }

      // Prevent adding same star twice
      if (prev.includes(starIndex)) {
        return prev;
      }

      // Add new star to sequence
      const next = [...prev, starIndex];

      // Call callback when minimum stars reached
      if (next.length >= minStars) {
        onSequenceComplete(next);
      }

      return next;
    });
  }

  /**
   * Handle mouse move to show hover effects
   */
  function handleMouseMove(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoveredStar(getClickedStar(x, y));
  }

  /**
   * Reset the star selection
   */
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
