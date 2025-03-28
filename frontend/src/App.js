import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Orders from "./Pages/Orders";
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
        <Route path="/" element={<Home orders={orders} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/new" element={<OrderForm addOrder={addOrder} />} />
        <Route path="/orders/edit/:id" element={<UpdateOrder addOrder={addOrder} />} />
        <Route path="/orders/delete/:id" element={<DeleteOrder />} /> {/* Route for deleting order */}
        <Route path="/orders/details/:id" element={<OrderDetails />} />

      </Routes>
    </Router>
  );
}

export default App;
