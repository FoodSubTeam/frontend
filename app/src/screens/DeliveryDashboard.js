import { useEffect, useState } from "react";
import { BASE_URL, ORIGIN_URL } from '../config';

export default function DeliveryDashboard() {
    const initialWarehouseForm = {
        name: "",
        origin_address: {
            company_name: "",
            name: "",
            phone: "",
            email: "",
            address_line1: "",
            address_line2: "",
            city_locality: "",
            state_province: "",
            postal_code: "",
            country_code: "US",
            address_residential_indicator: "yes",
        },
        return_address: {
            company_name: "",
            name: "",
            phone: "",
            email: "",
            address_line1: "",
            address_line2: "",
            city_locality: "",
            state_province: "",
            postal_code: "",
            country_code: "US",
            address_residential_indicator: "yes",
        },
    };

    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [warehouses, setWarehouses] = useState([]);
    const [warehouseForm, setWarehouseForm] = useState(initialWarehouseForm);
    const token = localStorage.getItem("token");


    const updateAddressField = (section, field, value) => {
        setWarehouseForm((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const fetchWarehouses = async () => {
        const res = await fetch(`${BASE_URL}/warehouses`, {
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
        console.log(`data.warehouses: ${data.warehouses}`)
        setWarehouses(data.warehouses);
    };

    const fetchDeliveries = async () => {
        const res = await fetch(`${BASE_URL}/delivery-orders`, {
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
        console.log(`data.delivery_orders: ${data.delivery_orders}`)
        setDeliveries(data.delivery_orders);
    };

    const setupDelivery = async () => {
        setLoading(true);
        try {
            await fetch(`${BASE_URL}/delivery-orders-ready`, {
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
            await fetchDeliveries();
        } catch (err) {
            setMessage("Failed to set up deliveries.");
        } finally {
            setLoading(false);
        }
    };

    const createWarehouse = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${BASE_URL}/warehouse`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(warehouseForm),
                credentials: 'include',
                mode: 'cors',
                referrerPolicy: 'no-referrer',
                origin: ORIGIN_URL,
            });
            setMessage("Warehouse created successfully.");
            setWarehouseForm(initialWarehouseForm);
            await fetchWarehouses();
        } catch {
            setMessage("Failed to create warehouse.");
        }
    };

    useEffect(() => {
        fetchDeliveries();
        fetchWarehouses();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Delivery Dashboard</h1>
            <button
                onClick={setupDelivery}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
                disabled={loading}
            >
                {loading ? "Setting up..." : "Setup Delivery for Today"}
            </button>

            {message && <div className="mb-4 text-sm text-gray-700">{message}</div>}

            {/* Delivery Orders Table */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Delivery Orders</h2>

                {deliveries.length === 0 ? (
                    <div className="text-gray-500 italic">No deliveries available.</div>
                ) : (
                    <table className="min-w-full border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">ID</th>
                                <th className="p-2 border">User</th>
                                <th className="p-2 border">Kitchen Order</th>
                                <th className="p-2 border">Date</th>
                                <th className="p-2 border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map((d) => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="p-2 border">{d.id}</td>
                                    <td className="p-2 border">{d.user_id}</td>
                                    <td className="p-2 border">{d.kitchen_order_id}</td>
                                    <td className="p-2 border">{d.delivery_date}</td>
                                    <td className="p-2 border capitalize">{d.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Warehouses Section */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Warehouses</h2>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                    {warehouses.map((wh) => (
                        <li key={wh.id}>
                            <strong>{wh.id}</strong>
                        </li>
                    ))}
                </ul>

                <form onSubmit={createWarehouse} className="space-y-4 max-w-3xl">
                    <h3 className="text-lg font-semibold">Add New Warehouse</h3>

                    {/* Warehouse Name */}
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        placeholder="Warehouse Name"
                        value={warehouseForm.name}
                        onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                        required
                    />

                    {/* Origin Address */}
                    <div>
                        <h4 className="font-semibold mt-4">Origin Address</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(warehouseForm.origin_address).map(([key, value]) => (
                                <input
                                    key={`origin-${key}`}
                                    type="text"
                                    className="border p-2 rounded"
                                    placeholder={key.replaceAll("_", " ")}
                                    value={value}
                                    onChange={(e) => updateAddressField("origin_address", key, e.target.value)}
                                    required={["name", "phone", "email", "address_line1", "city_locality", "state_province", "postal_code"].includes(key)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Return Address */}
                    <div>
                        <h4 className="font-semibold mt-4">Return Address</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(warehouseForm.return_address).map(([key, value]) => (
                                <input
                                    key={`return-${key}`}
                                    type="text"
                                    className="border p-2 rounded"
                                    placeholder={key.replaceAll("_", " ")}
                                    value={value}
                                    onChange={(e) => updateAddressField("return_address", key, e.target.value)}
                                    required={["name", "phone", "email", "address_line1", "city_locality", "state_province", "postal_code"].includes(key)}
                                />
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Create Warehouse
                    </button>
                </form>
            </div>
        </div>
    );
}
