import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css"; // 

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Form Data: ", form);

    try {
      const res = await axios.post("http://localhost:5003/api/auth/login", form);

      if (res.data?.success) {
        const { token, data } = res.data;
        localStorage.setItem("driverToken", token);
        localStorage.setItem("driverId", data.id);

        alert("✅ Login successful! Redirecting to dashboard...");
        navigate("/dashboard");
      } else {
        console.error("Login failed: ", res.data?.message || "Unknown error");
        alert(res.data?.message || "Login failed");
      }
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data || err.message);
      if (err.response) {
        console.error("Server error details:", err.response?.data?.errors);
        alert(err.response?.data?.errors?.[0] || "Login error");
      } else {
        alert("Network or other error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Driver Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
