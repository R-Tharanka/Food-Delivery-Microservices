
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/login"; 
import DriverDashboard from "./pages/DriverDashboard";
import CreateDelivery from "./pages/CreateDelivery";
import DeliveryDetails from "./pages/DeliveryDetails";
import DriverSocketDashboard from "./pages/DriverSocketDashboard";
import DriverSimulator from "./pages/DriverSimulator";
import MapTrackOrder from "./pages/MapTrackOrder";

import { useParams } from "react-router-dom"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DriverDashboard />} />
        <Route path="/delivery" element={<CreateDelivery />} />
        <Route path="/delivery/:id" element={<DeliveryDetails />} />
        <Route path="/driver-socket" element={<DriverSocketDashboard />} />
        <Route path="/driver-simulator" element={<DriverSimulator />} />
        
        {/* Fix here - expect orderId parameter */}
        <Route path="/map-track/:orderId" element={<MapTrackOrderWrapper />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Small wrapper to pass orderId properly
function MapTrackOrderWrapper() {
  const { orderId } = useParams();
  return <MapTrackOrder orderId={orderId} />;
}

export default App;
