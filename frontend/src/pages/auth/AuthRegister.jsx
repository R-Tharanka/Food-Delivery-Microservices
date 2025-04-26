import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AuthRegister() {
  const [form, setForm] = useState({
    firstName: "", lastName: "",
    email: "", phone: "",
    password: "", location: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:4000/api/auth/register/customer", form);
      // Store JWT
      localStorage.setItem("token", res.data.token);
      // Redirect to a protected page (e.g. customer profile)
      navigate("/customer/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Register as Customer</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="firstName"  placeholder="First Name" onChange={handleChange} required/>
        <input name="lastName"   placeholder="Last Name"  onChange={handleChange} required/>
        <input name="email"      type="email" placeholder="Email" onChange={handleChange} required/>
        <input name="phone"      placeholder="Phone" onChange={handleChange} required/>
        <input name="password"   type="password" placeholder="Password" onChange={handleChange} required/>
        <input name="location"   placeholder="Location" onChange={handleChange}/>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
