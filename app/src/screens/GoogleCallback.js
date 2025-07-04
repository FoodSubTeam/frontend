// src/pages/CallbackPage.js
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BASE_URL, ORIGIN_URL } from '../config';

export default function CallbackPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuth = async () => {
      // Call your backend to exchange code for token
      const res = await fetch(`${BASE_URL}/callback` + window.location.search);
      const data = await res.json();

      if (data.access_token) {
        login(data.access_token);
        navigate("/");
      } else {
        alert("Google login failed");
        navigate("/login");
      }
    };

    handleOAuth();
  }, [login, navigate]);

  return <div>Logging you in with Google...</div>;
}
