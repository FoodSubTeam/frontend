// src/pages/HomePage.js
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome! 🎉</h1>
    </div>
  );
}
