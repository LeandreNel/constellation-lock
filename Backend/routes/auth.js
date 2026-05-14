const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, sequence } = req.body;
  // sequence is an array like [3, 7, 1, 12, 5]

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const sequenceString = sequence.join("-");
    const constellationHash = await bcrypt.hash(sequenceString, 12);

    const user = await User.create({ username, email, constellationHash });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, sequence } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const sequenceString = sequence.join("-");
    const isMatch = await bcrypt.compare(
      sequenceString,
      user.constellationHash,
    );
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect constellation" });

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
