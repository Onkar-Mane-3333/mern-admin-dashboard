// import { useNavigate } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();

//   function handleLogin() {

//     // pretend backend returned token
//     localStorage.setItem("token", "abc123");
//     // fake login success
//     navigate("/dashboard");
//   }

//   return (
//     <div>
//       <h1>🔐 Login</h1>
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// }

// export default Login;


// import { useNavigate } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();
// //Sending login request to backend
//   async function handleLogin() {
//     console.log("Login clicked");
//     const res = await fetch("http://localhost:5000/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email: "user@gmail.com",
//         password: "1234",
//       }),
//     });
// //4️⃣ Read response from backend
//     const data = await res.json();
//     console.log(data);
// //5️⃣ Store token in localStorage
//     if (data.token) {
//       localStorage.setItem("token", data.token);
//       navigate("/dashboard");
//     }
//   }

//   return (
//     <div>
//       <h1>🔐 Login</h1>
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// }

// export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const res = await fetch("https://mern-admin-dashboard-5xlx.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        <input
          className="login-input"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
