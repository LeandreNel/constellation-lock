// Registration page - allows users to create account with constellation pattern
import { useState } from "react";
import axios from "axios";
import StarMap from "../components/StarMap";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [sequence, setSequence] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit() {
    // Require at least 4 stars
    if (sequence.length < 4) {
      return setMessage("Please select at least 4 stars");
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        sequence,
      });

      setMessage("✓ Registered! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering");
    }
  }

  return (
    <div className="page">
      <h1>Create Your Constellation</h1>
      <p>Your star pattern is your unique password</p>
      <input
        className="input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <StarMap onSequenceComplete={setSequence} minStars={4} />
      <button className="btn" onClick={handleSubmit}>
        Register
      </button>
      {message && <p className="msg">{message}</p>}
    </div>
  );
}
