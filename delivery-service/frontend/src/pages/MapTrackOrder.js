// src/pages/MapTrackOrder.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const pickupIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1483/1483336.png",
  iconSize: [35, 35],
});

const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
});

export default function MapTrackOrder() {
  const { orderId } = useParams();
  const [pickupLocation, setPickupLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const token = localStorage.getItem("driverToken");
        const res = await axios.get(`http://localhost:5003/api/delivery/order/${orderId}`, {
          headers: { Authorization: token }
        });

        const delivery = res.data.delivery;
        if (delivery) {
          setPickupLocation({
            lat: delivery.pickupLocation.coordinates[1], // ✅ latitude
            lng: delivery.pickupLocation.coordinates[0]  // ✅ longitude
          });
          setDeliveryLocation({
            lat: delivery.deliveryLocation.coordinates[1], // ✅ latitude
            lng: delivery.deliveryLocation.coordinates[0]  // ✅ longitude
          });
        }
      } catch (error) {
        console.error("Failed to fetch delivery for map:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchDelivery();
  }, [orderId]);

  if (loading) {
    return <p style={{ padding: "2rem", textAlign: "center" }}>Loading map... 🚚</p>;
  }

  if (!pickupLocation || !deliveryLocation) {
    return <p style={{ padding: "2rem", textAlign: "center" }}>Pickup or delivery location missing ❌</p>;
  }

  return (
    <div style={{ height: "100vh" }}>
      <MapContainer center={pickupLocation} zoom={14} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {/* Pickup Marker */}
        <Marker position={pickupLocation} icon={pickupIcon} />

        {/* Delivery Marker */}
        <Marker position={deliveryLocation} icon={deliveryIcon} />

        {/* Polyline connecting pickup and delivery */}
        <Polyline positions={[pickupLocation, deliveryLocation]} color="blue" weight={5} />
      </MapContainer>
    </div>
  );
}
