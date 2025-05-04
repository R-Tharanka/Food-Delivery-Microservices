import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DeliveryDetails.css";

export default function DeliveryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDelivery();
  }, [id]);

  const fetchDelivery = async () => {
    try {
      const token = localStorage.getItem("driverToken");
      const res = await axios.get(`http://localhost:5003/api/delivery/${id}`, {
        headers: { Authorization: token }
      });
      setDelivery(res.data.delivery);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching delivery details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem("driverToken");
      const res = await axios.put(
        `http://localhost:5003/api/delivery/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: token } }
      );
      alert(res.data.message);
      fetchDelivery(); // Refresh after update
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) return <div className="loading">Loading delivery details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!delivery) return <div className="loading">No delivery found</div>;

  return (
    <div className="details-container">
      <h2>📦 Delivery Details</h2>

      <div className="details-card">
        <p><strong>Delivery ID:</strong> {delivery._id}</p>
        <p><strong>Order ID:</strong> {delivery.orderId}</p>
        <p><strong>Customer ID:</strong> {delivery.customerId}</p>
        <p><strong>Pickup Address:</strong> {delivery.pickupAddressString}</p>
        <p><strong>Delivery Address:</strong> {delivery.deliveryAddressString}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`status ${delivery.status}`}>{delivery.status}</span>
        </p>
        <p><strong>Created At:</strong> {new Date(delivery.createdAt).toLocaleString()}</p>
      </div>

      <div className="buttons">
        {delivery.status === "assigned" && (
          <button className="accept-btn" onClick={() => handleUpdateStatus("To be delivered")}>
            📥 Accept Delivery
          </button>
        )}

        {delivery.status === "To be delivered" && (
          <button className="picked-up-btn" onClick={() => handleUpdateStatus("Picked-up")}>
            🚚 Mark as Picked-Up
          </button>
        )}

        {delivery.status === "Picked-up" && (
          <button className="delivered-btn" onClick={() => handleUpdateStatus("Delivered")}>
            ✅ Mark as Delivered
          </button>
        )}
      </div>

      <div className="buttons">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ⬅️ Back to Dashboard
        </button>
      </div>
    </div>
  );
}
