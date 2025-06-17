import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
      mode: 'cors',
      referrerPolicy: 'no-referrer',
      origin: "http://localhost:8082/",
    });
    if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_role", data.role);
      
        const role = data.role;

        // redirect
        if (role === "admin") {
            navigate("/admin-dashboard");
        } else if (role === "kitchen") {
            navigate("/kitchen-orders");
        } else if (role === "customer") {
            navigate("/home");
        }

    } else {
      alert("Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/login";
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" /><br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" /><br />
        <button type="submit">Login</button>
      </form>
      <hr />
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
}
