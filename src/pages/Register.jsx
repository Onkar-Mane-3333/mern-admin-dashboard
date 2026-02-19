import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const navigate = useNavigate();

  async function handleRegister() {
    const res = await fetch("https://mern-admin-dashboard-5xlx.onrender.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registered successfully");
      navigate("/login");
    } else {
      alert(data.message);
    }
  }

  return (
  <div className="register-container">
    <div className="register-card">
      <h2>Register</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={handleRegister}>Register</button>
    </div>
  </div>
);
}

export default Register;
