// src/pages/HomePage.js
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome! 🎉</h1>
      <button onClick={() => { logout(); navigate("/login"); }}>
        Logout
      </button>
    </div>
  );
}
