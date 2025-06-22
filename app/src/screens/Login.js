import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, ORIGIN_URL } from '../config';

export default function Login({ }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
      mode: 'cors',
      referrerPolicy: 'no-referrer',
      origin: ORIGIN_URL,
    });
    if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("user_id", data.user_id);
      
        const role = data.role;

        // redirect
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "kitchen") {

          const kitchenIdRes = await fetch(`${BASE_URL}/user/${data.user_id}/kitchen-id`, {
            method: "GET",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${data.access_token}`
            },
            credentials: 'include',
            mode: 'cors',
            referrerPolicy: 'no-referrer',
            origin: ORIGIN_URL,
          });

          const kitchenIdData = await kitchenIdRes.json();
          localStorage.setItem("kitchen_id", kitchenIdData.kitchen_id);

          navigate("/kitchen-dashboard");
        } else if (role === "delivery") {
          navigate("/delivery-dashboard");
        } else if (role === "customer") {
          navigate("/offers");
        }
        window.location.reload();
    } else {
      alert("Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/login`;
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
