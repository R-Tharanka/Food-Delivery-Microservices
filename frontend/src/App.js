// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// common components
import Home from "./pages/Home";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactAndFeedback from "./pages/ContactAndFeedback";

// auth components
import AuthLogin from "./pages/auth/AuthLogin";
import AuthRegister from "./pages/auth/AuthRegister";
import CustomerProfile from "./pages/auth/CustomerProfile";

// payment management
import Checkout from "./pages/payment/Checkout";

// order management
import OrderHome from "./pages/orderManagement/OrderHome";
import Orders from "./pages/orderManagement/Orders";
import OrderForm from "./components/OrderForm";
import UpdateOrder from "./components/UpdateOrder";  // Import UpdateOrder page
import DeleteOrder from "./components/DeleteOrder";  // Import DeleteOrder page
import OrderDetails from "./components/OrderDetails";

// resturant management
import SuperAdminRegister from './pages/restaurant/components/SuperAdminRegister';
import SuperAdminLogin from './pages/restaurant/components/SuperAdminLogin';
import SuperAdminDashboard from './pages/restaurant/pages/SuperAdminDashboard';
import RestaurantRegister from './pages/restaurant/components/RestaurantRegister';
import RestaurantLogin from './pages/restaurant/components/RestaurantLogin';
import RestaurantDashboard from './pages/restaurant/pages/RestaurantDashboard';
import IndexPage from './pages/restaurant/components/IndexPage';

// delivery management


function App() {
  const [orders, setOrders] = useState([]);

  const addOrder = (newOrder) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  return (
    <Router>
      <Routes>
        // common routes
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<ContactAndFeedback />} />

        // auth routes
        <Route path="/auth/login" element={<AuthLogin />} />
+       <Route path="/auth/register" element={<AuthRegister />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />

        // payment management
        <Route path="/checkout" element={<Checkout />} />

        // order management
        <Route path="/orders" element={<OrderHome orders={OrderHome} />} />
        <Route path="/orders/new" element={<OrderForm addOrder={addOrder} />} />
        <Route path="/orders/edit/:id" element={<UpdateOrder addOrder={addOrder} />} />
        <Route path="/orders/delete/:id" element={<DeleteOrder />} />
        <Route path="/orders/details/:id" element={<OrderDetails />} />

        // restaurant management
        <Route path="/superadmin/register" element={<SuperAdminRegister />} />
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/restaurant/register" element={<RestaurantRegister />} />
        <Route path="/restaurant/login" element={<RestaurantLogin />} />
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        <Route path="/restaurant/home" element={<IndexPage />} />

        // delivery management

      </Routes>
    </Router>
  );
}

export default App;
