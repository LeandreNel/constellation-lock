/**
 * ============================================
 * AUTHENTICATION ROUTES
 * ============================================
 * Handles user registration and login
 * Uses constellation (star) patterns as passwords
 * Passwords are hashed with bcrypt for security
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/**
 * POST /api/auth/register
 * Creates a new user account with a constellation pattern
 *
 * Request body:
 * - username (string): Unique username
 * - email (string): Unique email address
 * - sequence (array): Star indices [3, 7, 1, 12, 5]
 *
 * Response:
 * - 201: User registered successfully
 * - 400: User already exists with that email
 * - 500: Server error
 */
router.post("/register", async (req, res) => {
  const { username, email, sequence } = req.body;

  try {
    // Check if user with this email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Convert star sequence array to string format
    // [3, 7, 1, 12, 5] -> "3-7-1-12-5"
    const sequenceString = sequence.join("-");

    // Hash the sequence with bcrypt (salt rounds: 12)
    const constellationHash = await bcrypt.hash(sequenceString, 12);

    // Create new user in database
    const user = await User.create({
      username,
      email,
      constellationHash,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * POST /api/auth/login
 * Authenticates user by verifying their constellation pattern
 *
 * Request body:
 * - email (string): User's email
 * - sequence (array): Star indices [3, 7, 1, 12, 5]
 *
 * Response:
 * - 200: { token: JWT_TOKEN, username: string }
 * - 404: User not found
 * - 401: Incorrect constellation pattern
 * - 500: Server error
 */
router.post("/login", async (req, res) => {
  const { email, sequence } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert input sequence to string format
    const sequenceString = sequence.join("-");

    // Compare provided sequence with stored hash
    const isMatch = await bcrypt.compare(
      sequenceString,
      user.constellationHash,
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect constellation" });
    }

    // Generate JWT token (expires in 1 day)
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // Return token and username
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
