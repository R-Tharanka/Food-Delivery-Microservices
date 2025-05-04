// src/pages/DriverSocketDashboard.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5003"); // Connect to backend WebSocket

export default function DriverSocketDashboard() {
  const [orderId, setOrderId] = useState("123"); // Default Order ID
  const [lat, setLat] = useState(6.9271);  // Starting lat (Colombo)
  const [lng, setLng] = useState(79.8612); // Starting lng (Colombo)
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let interval;
    if (sending) {
      interval = setInterval(() => {
        const newLat = lat + (Math.random() - 0.5) * 0.0005; // Random small move
        const newLng = lng + (Math.random() - 0.5) * 0.0005;

        socket.emit("location-update", {
          orderId,
          lat: newLat,
          lng: newLng
        });

        console.log("📍 Sending location:", newLat, newLng);
        setLat(newLat);
        setLng(newLng);
      }, 2000); // send every 2 sec
    }

    return () => clearInterval(interval);
  }, [sending, lat, lng, orderId]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>🛵 Driver Live Location Dashboard</h2>
      <input
        placeholder="Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        style={{ margin: "10px", padding: "8px" }}
      />
      <br />
      <button onClick={() => setSending(!sending)} style={{
        padding: "10px 20px",
        backgroundColor: sending ? "#f44336" : "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
      }}>
        {sending ? "🛑 Stop Sending" : "📡 Start Sending Location"}
      </button>
    </div>
  );
}
