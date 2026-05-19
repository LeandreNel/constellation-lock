// MongoDB user schema - stores account info and constellation password hash
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    // Bcrypt hash of constellation pattern (e.g., "3-7-1-12-5" hashed)
    constellationHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }, // Auto-add createdAt and updatedAt
);

module.exports = mongoose.model("User", userSchema);
