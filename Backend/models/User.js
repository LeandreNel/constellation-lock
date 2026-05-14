/**
 * ============================================
 * USER MODEL
 * ============================================
 * Defines the MongoDB schema for user accounts
 * Stores username, email, and hashed constellation pattern
 */

const mongoose = require("mongoose");

// Define user schema with validation
const userSchema = new mongoose.Schema(
  {
    // Unique username for each user
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Unique email for account recovery and identification
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // Bcrypt hash of the user's constellation star sequence
    // Format: sequence array joined with "-" then hashed
    // Example: "3-7-1-12-5" -> hashed string
    constellationHash: {
      type: String,
      required: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
