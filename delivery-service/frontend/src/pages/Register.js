import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css"; // ✅ CSS import

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "947",
    vehicleType: "bike",
    vehicleNumber: "",
    location: { type: "Point", coordinates: [79.8612, 6.9271] }
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "vehicleNumber") {
      let formattedValue = value.toUpperCase();
      if (formattedValue.length > 7) return; // ✅ Max 7 chars (3 letters + 4 digits)
      setForm((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // ✨ Updated vehicle number regex: 2 or 3 uppercase letters + 4 digits
    if (!/^[A-Z]{2,3}[0-9]{4}$/.test(form.vehicleNumber)) {
      newErrors.vehicleNumber = "Vehicle Number must have 2 or 3 uppercase letters followed by 4 digits (e.g., AB1234 or ABC1234)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5003/api/auth/register", form);
      if (res.data?.success) {
        alert("✅ Registration successful! Redirecting to Login...");
        navigate("/login");
      } else {
        alert(res.data?.message || "Something went wrong");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>📝 Driver Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Phone (947...)" onChange={handleChange} required />

        <input
          name="vehicleNumber"
          placeholder="Vehicle Number (e.g., AB1234 or ABC1234)"
          value={form.vehicleNumber}
          onChange={handleChange}
          required
        />
        {errors.vehicleNumber && <div className="error-text">{errors.vehicleNumber}</div>}

        <select name="vehicleType" onChange={handleChange} required>
          <option value="bike">Bike</option>
          <option value="car">Tuck</option>
          
        </select>

        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p>Already have an account?</p>
      <button onClick={() => navigate("/login")}>Go to Login</button>
    </div>
  );
}
