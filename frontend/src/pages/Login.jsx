// Login page - authenticates users by recreating their constellation pattern
import { useState } from "react";
import axios from "axios";
import StarMap from "../components/StarMap";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [sequence, setSequence] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit() {
    // Require at least 4 stars
    if (sequence.length < 4) {
      return setMessage("Please select at least 4 stars");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        sequence,
      });

      // Store JWT token for authenticated requests
      localStorage.setItem("token", res.data.token);

      setMessage(`✓ Welcome back, ${res.data.username}!`);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error logging in");
    }
  }

  return (
    <div className="page">
      <h1>Find Your Constellation</h1>
      <p>Recreate your star pattern to sign in</p>
      <input
        className="input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <StarMap onSequenceComplete={setSequence} minStars={4} />
      <button className="btn" onClick={handleSubmit}>
        Login
      </button>
      {message && <p className="msg">{message}</p>}
    </div>
  );
}
