import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5003"); // Connect to backend WebSocket

export default function DriverSocketDashboard() {
  const [orderId, setOrderId] = useState("123"); // Hardcoded for now
  const [lat, setLat] = useState(6.9271);  // Colombo default lat
  const [lng, setLng] = useState(79.8612); // Colombo default lng
  const [sending, setSending] = useState(false);

  // Send location updates every 3 seconds
  useEffect(() => {
    let interval;
    if (sending) {
      interval = setInterval(() => {
        const newLat = lat + (Math.random() * 0.001); // Slight random movement
        const newLng = lng + (Math.random() * 0.001);

        socket.emit("location-update", {
          orderId,
          lat: newLat,
          lng: newLng
        });

        console.log("📍 Sending new location...", newLat, newLng);
        setLat(newLat);
        setLng(newLng);
      }, 3000);
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
      <button onClick={() => setSending(!sending)}>
        {sending ? "🛑 Stop Sending" : "📡 Start Sending Location"}
      </button>
    </div>
  );
}
