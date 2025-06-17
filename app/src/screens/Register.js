import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.detail || "Registration failed");
        return;
      }

      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="first_name" placeholder="First Name" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="last_name" placeholder="Last Name" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border rounded" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
