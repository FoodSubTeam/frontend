import React, { useEffect, useState } from "react";
import { BASE_URL, ORIGIN_URL } from '../config';

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(`${BASE_URL}/subscriptions/user/${userId}`, {
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
        setSubscriptions(data.subscriptions || []);
      } catch (error) {
        console.error("Failed to fetch subscriptions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [userId]);

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Subscriptions</h1>
      {subscriptions.length === 0 ? (
        <p className="text-gray-600">No subscriptions found.</p>
      ) : (
        <div className="grid gap-4">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="font-medium text-lg">
                Subscription ID: {sub.subscription_id}
              </div>
              <div>Status: <span className="font-semibold">{sub.status}</span></div>
              <div>Offer ID: {sub.offer_id}</div>
              <div>Delivery Address: {sub.delivery_address}</div>
              <div>Start Date: {new Date(sub.start_date).toLocaleDateString()}</div>
              <div>Renewal Date: {sub.renewal_date ? new Date(sub.renewal_date).toLocaleDateString() : "N/A"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
