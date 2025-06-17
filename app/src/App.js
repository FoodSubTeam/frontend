import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./screens/Login";
import RegisterPage from "./screens/Register";
import CallbackPage from "./screens/GoogleCallback";
import HomePage from "./screens/CustomerHomePage";

const RoleRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  const role = localStorage.getItem("user_role");
  return allowedRoles.includes(role) ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleRoute allowedRoles={["kitchen", "admin"]}><HomePage /></RoleRoute>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/callback" element={<CallbackPage />} />
    </Routes>
  );
}

export default App;

