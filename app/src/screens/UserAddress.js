import { useEffect, useState } from "react";
import { BASE_URL, ORIGIN_URL } from '../config';

function UserAddressPage({}) {
    const [address, setAddress] = useState(null);
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        address_line1: '',
        address_line2: '',
        city_locality: '',
        state_province: '',
        postal_code: '',
        country_code: 'US',
        address_residential_indicator: 'yes',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    const getAddress = async () => {
        try {
            const response = await fetch(`${BASE_URL}/user/${userId}/address`, {
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
            console.log("address", data.address);
            if (data.address != null) {
                console.log("address not null");
                setAddress(data.address);
                setForm(data.address);
            }
        } catch (error) {
            console.error("Failed to fetch address", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAddress();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`${BASE_URL}/user/${userId}/address`, {
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
            const data = await res.json();
            setAddress(data.address);
            alert('Address saved!');
        } catch (err) {
            alert('Failed to save address');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>User Address</h2>

            {loading ? (
                <p>Loading address...</p>
            ) : address ? (
                <div style={{ marginBottom: '1rem' }}>
                    <p><strong>Name:</strong> {address.name}</p>
                    <p><strong>Email:</strong> {address.email}</p>
                    <p><strong>Phone:</strong> {address.phone}</p>
                    <p><strong>Address:</strong> {address.address_line1}, {address.address_line2}</p>
                    <p><strong>City:</strong> {address.city_locality}</p>
                    <p><strong>State:</strong> {address.state_province}</p>
                    <p><strong>Postal Code:</strong> {address.postal_code}</p>
                    <p><strong>Country:</strong> {address.country_code}</p>
                </div>
            ) : (
                <p>No address found.</p>
            )}

            <h3>{address ? 'Update' : 'Set'} Address</h3>
            <form onSubmit={handleSubmit}>
                {[
                    'name', 'email', 'phone',
                    'address_line1', 'address_line2',
                    'city_locality', 'state_province',
                    'postal_code', 'country_code'
                ].map(field => (
                    <div key={field} style={{ marginBottom: '0.5rem' }}>
                        <label style={{ display: 'block' }}>{field.replace(/_/g, ' ')}:</label>
                        <input
                            type="text"
                            name={field}
                            value={form[field] || ''}
                            onChange={handleChange}
                            style={{ width: '300px' }}
                        />
                    </div>
                ))}

                <div style={{ marginBottom: '0.5rem' }}>
                    <label style={{ display: 'block' }}>Address Residential Indicator:</label>
                    <select
                        name="address_residential_indicator"
                        value={form.address_residential_indicator}
                        onChange={handleChange}
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Address'}
                </button>
            </form>
        </div>
    );
}

export default UserAddressPage;
