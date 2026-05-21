// Backend server - Express.js with MongoDB
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("../routes/auth");
const app = express();

// CORS middleware - allows frontend on localhost:5173
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// JSON body parser
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
// Connect to MongoDB and start server
console.log("Attempting to connect to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✓ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("✗ Database connection failed:", err.message);
    console.error(
      "MongoDB URI:",
      process.env.MONGO_URI.substring(0, 50) + "...",
    );
    process.exit(1);
  });
