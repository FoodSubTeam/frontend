import React, { useEffect, useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { BASE_URL, ORIGIN_URL } from '../config';

const stripePromise = loadStripe("pk_test_51R87ZHCkm29VkqjPZpM9D66eAMR22nTZL85H7O1QrAldvfi2vM52yxmU0pUkDFSwuAiyvy8JMhByGyroaPuQtp8l00Jj8WIjRL");

function AddCardForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");

  const setDefaultPaymentMethod = async (payment_method_id) => {
    try {
      await fetch(`${BASE_URL}/payment/default-method/${user_id}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          id: payment_method_id
        }),
        credentials: 'include',
        mode: 'cors',
        referrerPolicy: 'no-referrer',
        origin: ORIGIN_URL,
      });
      alert("Succesfully set default payment method.");
    } catch (err) {
      console.error("Set default payment method failed", err);
      alert("Failed to set default payment method.");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cardElement = elements.getElement(CardElement);
    const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Card saved successfully!");
      console.log("Payment method ID:", setupIntent.payment_method);

      setDefaultPaymentMethod(setupIntent.payment_method);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <CardElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : "Save Card"}
      </button>
    </form>
  );
}

function SaveCardPage() {
  const [clientSecret, setClientSecret] = useState(null);
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchSetupIntent = async () => {
      const res = await fetch(`${BASE_URL}//payment/intent/${user_id}`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: 'include',
        mode: 'cors',
        referrerPolicy: 'no-referrer',
        origin: ORIGIN_URL,
      });
      const data = await res.json();
      setClientSecret(data.client_secret);
    };

    fetchSetupIntent();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Payment Method</h1>
      {clientSecret ? (
        <Elements stripe={stripePromise}>
          <AddCardForm clientSecret={clientSecret} />
        </Elements>
      ) : (
        <p>Loading payment form...</p>
      )}
    </div>
  );
}

export default SaveCardPage;
