// components/NavBar.jsx
import { Link } from "react-router-dom";

export default function NavBar() {
  const role = localStorage.getItem("user_role");

  return (
    <nav style={{ padding: "10px", background: "#f0f0f0" }}>
      <Link to="/" style={{ marginRight: "15px" }}>🏠 Home</Link>

      {role === "customer" && (
        <>
          <Link to="/offers" style={{ marginRight: "15px" }}>🏷️ Offers</Link>
          <Link to="/save-card" style={{ marginRight: "15px" }}>💳 Save Payment Method</Link>
          <Link to="/subscriptions" style={{ marginRight: "15px" }}>Subscriptions</Link>
        </>
      )}

      {/* Optionally add logout */}
      <span style={{ float: "right" }}>
        {role && (
          <button onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
            window.location.reload();
          }}>
            🔓 Logout
          </button>
        )}
      </span>
    </nav>
  );
}
