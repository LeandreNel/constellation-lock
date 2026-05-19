// User authentication endpoints (register and login)
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register - creates new user with hashed constellation pattern
router.post("/register", async (req, res) => {
  const { username, email, sequence } = req.body;
  try {
    // Check for existing email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash constellation pattern: convert array to string, then bcrypt hash
    const sequenceString = sequence.join("-");
    const constellationHash = await bcrypt.hash(sequenceString, 12);

    // Create user in database
    await User.create({
      username,
      email,
      constellationHash,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login - verifies constellation pattern and returns JWT token
router.post("/login", async (req, res) => {
  const { email, sequence } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare provided pattern with stored hash
    const sequenceString = sequence.join("-");
    const isMatch = await bcrypt.compare(
      sequenceString,
      user.constellationHash,
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect constellation" });
    }

    // Generate JWT token (1 day expiry)
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
