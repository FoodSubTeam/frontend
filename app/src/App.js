import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./screens/Login";
import RegisterPage from "./screens/Register";
import CallbackPage from "./screens/GoogleCallback";
import HomePage from "./screens/CustomerHomePage";
import OffersPage from "./screens/Offers";
import SaveCardPage from "./screens/SaveCard";
import SubscriptionsPage from "./screens/Subscription";
import AdminDashboard from "./screens/AdminDashboard";
import KitchenDashboard from "./screens/KitchenDashboard";

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

      <Route path="/offers" element={<RoleRoute allowedRoles={["customer"]}><OffersPage /></RoleRoute>} />
      <Route path="/save-card" element={<RoleRoute allowedRoles={["customer"]}><SaveCardPage /></RoleRoute>} />
      <Route path="/subscriptions" element={<RoleRoute allowedRoles={["customer"]}><SubscriptionsPage /></RoleRoute>} />

      <Route path="/admin-dashboard" element={<RoleRoute allowedRoles={["admin"]}><AdminDashboard /></RoleRoute>} />
      
      <Route path="/kitchen-dashboard" element={<RoleRoute allowedRoles={["kitchen"]}><KitchenDashboard /></RoleRoute>} />
    </Routes>
  );
}

export default App;

