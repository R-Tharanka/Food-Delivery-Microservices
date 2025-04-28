// src/pages/TrackOrder.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// WebSocket connection
const socket = io("http://localhost:5003");

export default function TrackOrder({ orderId }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    socket.on(`location-${orderId}`, (data) => {
      console.log("🌎 Updated Location:", data);
      setLocation(data);
    });

    return () => socket.off(`location-${orderId}`);
  }, [orderId]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>📍 Tracking Order: {orderId}</h2>
      {location ? (
        <>
          <p><strong>Latitude:</strong> {location.lat.toFixed(6)}</p>
          <p><strong>Longitude:</strong> {location.lng.toFixed(6)}</p>
          <p>🛰️ Live location update received!</p>
        </>
      ) : (
        <p>Waiting for location data... 🕒</p>
      )}
    </div>
  );
}
