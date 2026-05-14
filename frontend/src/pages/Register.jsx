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
    if (sequence.length < 4)
      return setMessage("Please select at least 4 stars");
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        sequence,
      });
      setMessage("Registered! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Create Your Constellation</h1>
      <p style={styles.sub}>Your star pattern is your password</p>
      <input
        style={styles.input}
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        style={styles.input}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <StarMap onSequenceComplete={setSequence} minStars={4} />
      <button style={styles.btn} onClick={handleSubmit}>
        Register
      </button>
      {message && <p style={styles.msg}>{message}</p>}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050518",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    padding: "2rem",
  },
  title: { color: "#fff", fontFamily: "serif", fontSize: "2rem" },
  sub: { color: "#6a90c8", marginTop: "-0.5rem" },
  input: {
    background: "#0f0f3a",
    border: "1px solid #2a2a6e",
    borderRadius: "0.5rem",
    color: "#fff",
    padding: "0.6rem 1rem",
    width: "300px",
    fontSize: "1rem",
  },
  btn: {
    background: "#1a1a6e",
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.75rem 2rem",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  msg: { color: "#aad4ff" },
};
