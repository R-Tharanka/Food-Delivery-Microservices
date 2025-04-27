// src/pages/auth/AuthLogin.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/auth.css";

export default function AuthLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials(c => ({ ...c, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", credentials);
      localStorage.setItem("token", res.data.token);
      navigate("/customer/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-form-main-container">
      <Header />
      <div className="auth-form-container">
        <h2>Customer Login</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="📧 Email Address"
            onChange={handleChange}
            value={credentials.email}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="🔒 Password"
            onChange={handleChange}
            value={credentials.password}
            required
          />
          <button type="submit">Login</button>
        </form>

        <p className="auth-alt"> Don't have an account? <Link to="/auth/register">Sign up here</Link> </p>
      </div>
      <Footer />
    </div>
  );
}
