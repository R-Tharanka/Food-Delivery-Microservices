import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import "./DriverDashboard.css";

const socket = io("http://localhost:5003");

export default function DriverDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem("driverToken");
      const res = await axios.get("http://localhost:5003/api/delivery", {
        headers: { Authorization: token }
      });
      setDeliveries(res.data.deliveries);
    } catch (error) {
      console.error("Failed to fetch deliveries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (deliveryId, newStatus) => {
    try {
      const token = localStorage.getItem("driverToken");
      const res = await axios.put(
        `http://localhost:5003/api/delivery/${deliveryId}/status`,
        { status: newStatus },
        { headers: { Authorization: token } }
      );
      alert(res.data.message);
      fetchDeliveries(); // Refresh list after update
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("driverToken");
    const driverId = localStorage.getItem("driverId");

    if (!token) {
      alert("❌ Please login first!");
      navigate("/login");
      return;
    }

    fetchDeliveries();

    if (driverId) {
      socket.emit("join-driver-room", driverId);
    }

    const handleNewDelivery = (deliveryData) => {
      setDeliveries(prev => [deliveryData, ...prev]);
      alert(`📢 New Delivery Assigned! Order ID: ${deliveryData.orderId}`);
    };

    socket.on("new-delivery", handleNewDelivery);

    if (location.state?.newDelivery) {
      handleNewDelivery(location.state.newDelivery);
    }

    return () => {
      socket.off("new-delivery", handleNewDelivery);
    };
  }, [navigate, location.state]);

  const handleLogout = () => {
    localStorage.removeItem("driverToken");
    localStorage.removeItem("driverId");
    alert("✅ Logged out successfully!");
    navigate("/login");
  };

  const handleViewDetails = (deliveryId) => {
    navigate(`/delivery/${deliveryId}`);
  };

  const handleDeleteDelivery = async (deliveryId) => {
    if (!window.confirm("Are you sure you want to delete this delivery?")) return;

    try {
      const token = localStorage.getItem("driverToken");
      await axios.delete(`http://localhost:5003/api/delivery/${deliveryId}`, {
        headers: { Authorization: token }
      });
      alert("✅ Delivery deleted successfully!");
      fetchDeliveries(); // Refresh list
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Failed to delete delivery");
    }
  };

  if (loading) return <div>Loading deliveries...</div>;

  return (
    <div>
      {/* Header Section */}
      <header className="dashboard-header">
        <h1> Welcome to the Driver Dashboard</h1>
      </header>

      {/* Main Content */}
      <div className="dashboard-container">
        <div className="dashboard-buttons">
          <button className="create-btn" onClick={() => navigate("/delivery")}>➕ Create Delivery</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        <h2 className="delivery-title">Your Deliveries</h2>

        {deliveries.length > 0 ? (
          <table className="delivery-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Pickup Address</th>
                <th>Delivery Address</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((d) => (
                <tr key={d._id}>
                  <td>{d.orderId}</td>
                  <td>{d.customerId}</td>
                  <td>{d.pickupAddressString}</td>
                  <td>{d.deliveryAddressString}</td>
                  <td>{d.status}</td>
                  <td>{new Date(d.createdAt).toLocaleString()}</td>
                  <td>
                    <button className="view-btn" onClick={() => handleViewDetails(d._id)}>
                      View
                    </button>

                    <button
                      onClick={() => navigate(`/map-track/${d.orderId}`)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "grey",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginTop: "5px",
                        marginLeft: "10px",
                        fontWeight: "bolder",
                        fontSize: "medium"
                      }}
                    >
                      📍Show Route
                    </button>

                    {d.status === "assigned" && (
                      <button
                        className="accept-btn"
                        onClick={() => handleUpdateStatus(d._id, "To be delivered")}
                        style={{
                          padding: "6px 10px",
                          backgroundColor: "green",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          marginTop: "5px",
                          marginLeft: "10px",
                          fontWeight: "bold",
                          fontSize: "small"
                        }}
                      >
                        📥 Accept
                      </button>
                    )}

                    {d.status === "Delivered" && (
                      <button className="delete-btn" onClick={() => handleDeleteDelivery(d._id)}>
                        🗑️ Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-deliveries">No deliveries found.</p>
        )}
      </div>
    </div>
  );
}
