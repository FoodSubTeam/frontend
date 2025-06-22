import React, { useEffect, useState } from "react";
import { BASE_URL, ORIGIN_URL } from '../config';

const KitchenDashboard = ({}) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [actionMsg, setActionMsg] = useState("");
  const [settingUp, setSettingUp] = useState(false);
  const token = localStorage.getItem("token");
  const kitchenId = localStorage.getItem("kitchen_id");

  // Fetch all pending orders
  const fetchOrders = async () => {
    try {
        const res = await fetch(`${BASE_URL}/kitchen-order/pending/${kitchenId}`, {
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
        setOrders(data.orders || []);
    } catch (err) {
        console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Mark individual order as ready
  const markAsReady = async (orderId) => {
    try {
        setActionMsg("");
        const res = await fetch(`${BASE_URL}/kitchen-order/ready/${orderId}`, {
            method: "POST",
            headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
            credentials: 'include',
            mode: 'cors',
            referrerPolicy: 'no-referrer',
            origin: ORIGIN_URL,
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.detail || "Failed to mark as ready");
        }

        const updated = await res.json();

        setActionMsg(`Order #${orderId} marked as ready.`);
        // Refetch updated list
        await fetchOrders();
    } catch (err) {
        setActionMsg(`Error: ${err.message}`);
    }
  };

  // Trigger setup from paid subscriptions
  const handleSetupOrders = async () => {
    setSettingUp(true);
    setActionMsg("");
    try {
      const res = await fetch(`${BASE_URL}/kitchen-orders-paid/${kitchenId}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        mode: 'cors',
        referrerPolicy: 'no-referrer',
        origin: ORIGIN_URL,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Setup failed");
      }

      setActionMsg("Kitchen orders generated successfully.");
      await fetchOrders(); // Refresh the list
    } catch (err) {
      setActionMsg(`Error: ${err.message}`);
    } finally {
      setSettingUp(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Kitchen Dashboard</h1>

      {/* Message area */}
      {actionMsg && <p className="text-blue-600 mb-4">{actionMsg}</p>}

      {/* Setup Button */}
      <div className="mb-6">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleSetupOrders}
          disabled={settingUp}
        >
          {settingUp ? "Setting up..." : "Setup Orders from Paid Subscriptions"}
        </button>
      </div>

      {/* Orders List */}
      <h2 className="text-xl font-semibold mb-3">Pending Orders</h2>
      {loadingOrders ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No pending kitchen orders.</p>
      ) : (
        <table className="w-full border bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border-b">Order ID</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Meals Count</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{order.id}</td>
                <td className="p-3 border-b capitalize">{order.status}</td>
                <td className="p-3 border-b">{order.meals?.length || 0}</td>
                <td className="p-3 border-b">
                  <button
                    onClick={() => markAsReady(order.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Mark as Ready
                  </button>
                </td>
              </tr>

              {order.meals?.length > 0 && (
                <tr className="bg-gray-50">
                  <td colSpan="4" className="p-3 border-b text-sm text-gray-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {order.meals.map((meal) => (
                        <li key={meal.id}>
                          <strong>{meal.meal_name}</strong> — {meal.quantity} pcs
                          {meal.notes ? ` — Notes: ${meal.notes}` : ""}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default KitchenDashboard;
