import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/login"; 
import DriverDashboard from "./pages/DriverDashboard";
import CreateDelivery from "./pages/CreateDelivery";
import DeliveryDetails from "./pages/DeliveryDetails";
import DriverSocketDashboard from "./pages/DriverSocketDashboard";
import DriverSimulator from "./pages/DriverSimulator";
import MapTrackOrder from "./pages/MapTrackOrder";
import Home from "./pages/Home";

import { useParams } from "react-router-dom"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup-delivery" element={<Register />} /> {/* New Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DriverDashboard />} />
        <Route path="/delivery" element={<CreateDelivery />} />
        <Route path="/delivery/:id" element={<DeliveryDetails />} />
        <Route path="/driver-socket" element={<DriverSocketDashboard />} />
        <Route path="/driver-simulator" element={<DriverSimulator />} />
        <Route path="/map-track/:orderId" element={<MapTrackOrderWrapper />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Wrapper for useParams
function MapTrackOrderWrapper() {
  const { orderId } = useParams();
  return <MapTrackOrder orderId={orderId} />;
}

export default App;
