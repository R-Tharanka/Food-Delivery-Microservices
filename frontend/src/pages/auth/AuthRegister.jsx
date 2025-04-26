// src/pages/auth/AuthRegister.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/auth.css";

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
      const res = await axios.post("http://localhost:5001/api/auth/register/customer", form);
      localStorage.setItem("token", res.data.token);
      navigate("/customer/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-form-main-container">
      <Header />
      <div className="auth-form-container">
        <h2>Create Your Account</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input name="firstName" placeholder="First Name" onChange={handleChange} value={form.firstName} required />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} value={form.lastName} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} value={form.email} required />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} value={form.phone} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} value={form.password} required />
          <input name="location" placeholder="Location" onChange={handleChange} value={form.location} />
          <button type="submit">Sign Up</button>
        </form>

        <p className="auth-alt"> Already have an account? <Link to="/auth/login">Login here</Link> </p>

      </div>
      <Footer />
    </div>
  );
}
