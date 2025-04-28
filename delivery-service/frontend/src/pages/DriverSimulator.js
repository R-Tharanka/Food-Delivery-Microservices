// src/pages/DriverSimulator.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5003");

export default function DriverSimulator() {
  const [isMoving, setIsMoving] = useState(false);
  const [location, setLocation] = useState({ lat: 6.9271, lng: 79.8612 }); // Colombo
  const [orderId, setOrderId] = useState("ORDER123"); // Default Order ID

  useEffect(() => {
    let interval;
    if (isMoving) {
      interval = setInterval(() => {
        const randomMoveLat = (Math.random() - 0.5) * 0.001; 
        const randomMoveLng = (Math.random() - 0.5) * 0.001;

        const newLat = location.lat + randomMoveLat;
        const newLng = location.lng + randomMoveLng;

        const newLocation = { lat: newLat, lng: newLng };
        setLocation(newLocation);

        socket.emit("location-update", {
          orderId,
          ...newLocation,
        });

        console.log("📡 Sending location:", newLocation);
      }, 2000); // every 2 seconds
    }

    return () => clearInterval(interval);
  }, [isMoving, location, orderId]);

  const toggleMovement = () => setIsMoving(prev => !prev);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>🚚 Driver Simulator</h2>
      <input
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Order ID"
        style={{ padding: "8px", marginBottom: "1rem" }}
      />
      <br />
      <button 
        onClick={toggleMovement}
        style={{
          padding: "10px 20px",
          backgroundColor: isMoving ? "#f44336" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        {isMoving ? "🛑 Stop Moving" : "📡 Start Moving"}
      </button>
    </div>
  );
}
