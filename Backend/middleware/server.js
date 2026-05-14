/**
 * ============================================
 * CONSTELLATION LOCK - BACKEND SERVER
 * ============================================
 * Main Express server configuration
 * Handles CORS, middleware, MongoDB connection,
 * and routes authentication requests
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import authentication routes
const authRoutes = require("./routes/auth");

// Initialize Express app
const app = express();

// ============ MIDDLEWARE ============
// Enable CORS for frontend communication
// Origin restricted to localhost:5173 (Vite dev server)
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Parse incoming JSON requests
app.use(express.json());

// ============ ROUTES ============
// Mount authentication routes at /api/auth
app.use("/api/auth", authRoutes);

// ============ DATABASE & SERVER ============
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✓ MongoDB connected successfully");

    // Start listening on configured port
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("✗ Database connection failed:", err);
    process.exit(1);
  });
