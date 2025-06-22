import React, { useEffect, useState } from "react";
import { BASE_URL, ORIGIN_URL } from '../config';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/offers`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          mode: 'cors',
          referrerPolicy: 'no-referrer',
          origin: ORIGIN_URL,
        });
        const data = await res.json();
        setOffers(data.offers);
      } catch (error) {
        console.error("Failed to fetch offers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleSelectOffer = async (offer) => {
    try {
      await fetch(`${BASE_URL}/subscription`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          user_id: user_id,
          offer_id: offer.id.toString(),
          price_id: offer.price_id,
          kitchen_id: offer.kitchen_id.toString()
        }),
        credentials: 'include',
        mode: 'cors',
        referrerPolicy: 'no-referrer',
        origin: ORIGIN_URL,
      });
      alert("Offer selected successfully and payment triggered!");
    } catch (err) {
      console.error("Subscription failed", err);
      alert("Failed to subscribe.");
    }
  };

  if (loading) return <p>Loading offers...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Available Offers</h1>
      {offers.length === 0 ? (
        <p>No offers found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <div key={offer.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{offer.name}</h2>
              <p className="text-sm text-gray-600">Duration: {offer.duration} days</p>
              <p className="text-md font-bold">€{offer.price}</p>

              <h3 className="mt-2 font-semibold">Meals:</h3>
              <ul className="list-disc list-inside text-sm">
                {offer.meals?.map((meal) => (
                  <li key={meal.id}>
                    <strong>{meal.name}</strong>: {meal.description}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectOffer(offer)}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Select & Buy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersPage;
