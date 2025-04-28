import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5003");

export default function DriverSimulator() {
  const [isMoving, setIsMoving] = useState(false);
  const [location, setLocation] = useState({ lat: 6.9271, lng: 79.8612 });
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    let interval;
    if (isMoving && orderId) {
      interval = setInterval(() => {
        const randomMoveLat = (Math.random() - 0.5) * 0.0005;
        const randomMoveLng = (Math.random() - 0.5) * 0.0005;
        const newLat = location.lat + randomMoveLat;
        const newLng = location.lng + randomMoveLng;
        const newLocation = { lat: newLat, lng: newLng };
        setLocation(newLocation);

        socket.emit(`location-${orderId}`, {
          lat: newLat,
          lng: newLng,
        });

        console.log("🚚 Emitting to channel: location-" + orderId, newLocation);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isMoving, location, orderId]);

  const toggleMovement = () => {
    if (!orderId) {
      alert("Please enter a valid Order ID first!");
      return;
    }
    setIsMoving(prev => !prev);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>🚛 Driver Simulator</h2>
      <input
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Enter Order ID"
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
        {isMoving ? "🛑 Stop Moving" : "🚀 Start Moving"}
      </button>
    </div>
  );
}
