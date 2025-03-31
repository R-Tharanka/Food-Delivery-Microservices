// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";

import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactAndFeedback from "./pages/ContactAndFeedback";

// order management
import OrderHome from "./pages/orderManagement/OrderHome";
import Orders from "./pages/orderManagement/Orders";
import OrderForm from "./components/OrderForm";
import UpdateOrder from "./components/UpdateOrder";  // Import UpdateOrder page
import DeleteOrder from "./components/DeleteOrder";  // Import DeleteOrder page
import OrderDetails from "./components/OrderDetails";


function App() {
 const [orders, setOrders] = useState([]);

  const addOrder = (newOrder) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<ContactAndFeedback />} />

          <Route path="/orders" element={<OrderHome orders={OrderHome} />} />
         <Route path="/orders/new" element={<OrderForm addOrder={addOrder} />} />
         <Route path="/orders/edit/:id" element={<UpdateOrder addOrder={addOrder} />} />
        <Route path="/orders/delete/:id" element={<DeleteOrder />} /> 
        <Route path="/orders/details/:id" element={<OrderDetails />} />  
          
      </Routes>
    </Router>
  );
}

export default App;
