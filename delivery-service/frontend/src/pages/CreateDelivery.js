import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateDelivery.css"; 

export default function CreateDelivery() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    orderId: "",
    customerId: "",
    pickupAddress: "",
    deliveryAddress: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.orderId) newErrors.orderId = "Order ID is required";
    if (!form.customerId) newErrors.customerId = "Customer ID is required";
    if (!form.pickupAddress) newErrors.pickupAddress = "Pickup address is required";
    if (!form.deliveryAddress) newErrors.deliveryAddress = "Delivery address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("driverToken");
      const res = await axios.post("http://localhost:5003/api/delivery/create", form, {
        headers: { Authorization: token }
      });

      alert(res.data.message);
      navigate("/dashboard", { state: { newDelivery: res.data.delivery } });
    } catch (error) {
      console.error("❌ Create delivery error:", error);
      alert(error.response?.data?.message || "Error creating delivery");
    }
  };

  return (
    <div className="form-container">
      <h2>Create Delivery</h2>
      <form onSubmit={handleSubmit}>
        <input name="orderId" placeholder="Order ID" value={form.orderId} onChange={handleChange} required />
        {errors.orderId && <p>{errors.orderId}</p>}

        <input name="customerId" placeholder="Customer ID" value={form.customerId} onChange={handleChange} required />
        {errors.customerId && <p>{errors.customerId}</p>}

        <input name="pickupAddress" placeholder="Pickup Address" value={form.pickupAddress} onChange={handleChange} required />
        {errors.pickupAddress && <p>{errors.pickupAddress}</p>}

        <input name="deliveryAddress" placeholder="Delivery Address" value={form.deliveryAddress} onChange={handleChange} required />
        {errors.deliveryAddress && <p>{errors.deliveryAddress}</p>}

        <button type="submit">Create Delivery</button>
      </form>
    </div>
  );
}
