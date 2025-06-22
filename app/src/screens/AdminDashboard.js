import React, { useEffect, useState } from "react";
import { BASE_URL, ORIGIN_URL } from '../config';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "customer",
    kitchen_id: "",
  });
  const [kitchens, setKitchens] = useState([]);
  const [kitchenForm, setKitchenForm] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [kitchenMsg, setKitchenMsg] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/users`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        mode: 'cors',
        referrerPolicy: 'no-referrer',
        origin: ORIGIN_URL,
      });
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  // Fetch kitchens
  const fetchKitchens = async () => {
    try {
      const res = await fetch(`${BASE_URL}/kitchens`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        mode: 'cors',
        referrerPolicy: 'no-referrer',
        origin: ORIGIN_URL,
      });
      const data = await res.json();
      setKitchens(data.kitchens || []);
    } catch (err) {
      console.error("Error fetching kitchens:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchKitchens();
  }, []);

  // Create new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/auth/create_user`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form),
        credentials: 'include',
        mode: 'cors',
        referrerPolicy: 'no-referrer',
        origin: ORIGIN_URL,
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.detail || "Failed to create user");
        return;
      }

      setForm({ email: "", password: "", role: "customer", kitchen_id: "" });
      await fetchUsers(); // refresh list
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAddKitchen = async (e) => {
    e.preventDefault();
    setKitchenMsg("");

    try {
      const res = await fetch(`${BASE_URL}/kitchen`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(kitchenForm),
        credentials: 'include',
        mode: 'cors',
        referrerPolicy: 'no-referrer',
        origin: ORIGIN_URL,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Kitchen creation failed");
      }

      setKitchenForm({ name: "" });
      setKitchenMsg("Kitchen added successfully.");
      await fetchKitchens();
    } catch (err) {
      setKitchenMsg(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* User Creation Form */}
      <form onSubmit={handleCreateUser} className="mb-8 border p-4 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            className="border p-2 rounded"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="border p-2 rounded"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            className="border p-2 rounded"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="kitchen">Kitchen</option>
            <option value="sales">Sales</option>
            <option value="delivery">Delivery</option>
          </select>

          {/* Kitchen dropdown if role === "kitchen" */}
          {form.role === "kitchen" && (
            <select
              className="border p-2 rounded w-full"
              value={form.kitchen_id}
              onChange={(e) => setForm({ ...form, kitchen_id: e.target.value })}
              required
            >
              <option value="">Select a Kitchen</option>
              {kitchens.map((kitchen) => (
                <option key={kitchen.id} value={kitchen.id}>
                  {kitchen.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create User"}
        </button>

        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>

      {/* Add Kitchen Form */}
      <div className="border p-4 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Add New Kitchen</h2>
        <form onSubmit={handleAddKitchen} className="space-y-4">
          <input
            type="text"
            placeholder="Kitchen Name"
            className="border p-2 rounded w-full"
            value={kitchenForm.name}
            onChange={(e) =>
              setKitchenForm({ ...kitchenForm, name: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Kitchen
          </button>
          {kitchenMsg && <p className="text-blue-700">{kitchenMsg}</p>}
        </form>
      </div>

      {/* Kitchens List */}
      <div>
        <h2 className="text-xl font-semibold mb-3">All Kitchens</h2>
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 border-b">Kitchen ID</th>
              <th className="p-3 border-b">Name</th>
            </tr>
          </thead>
          <tbody>
            {kitchens.map((kitchen) => (
              <tr key={kitchen.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{kitchen.id}</td>
                <td className="p-3 border-b">{kitchen.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {kitchens.length === 0 && (
          <p className="text-gray-600 mt-2">No kitchens found.</p>
        )}
      </div>


      {/* User List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Users</h2>
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-3 border-b">{user.email}</td>
                <td className="p-3 border-b capitalize">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-gray-500 mt-4">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
