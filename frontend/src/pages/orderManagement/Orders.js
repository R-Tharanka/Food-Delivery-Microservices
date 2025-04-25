import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Table } from "react-bootstrap";  // Bootstrap components

function Orders() {
  const [orders, setOrders] = useState([]);

  // Fetch orders from the backend when the component mounts
  useEffect(() => {
    axios.get("http://localhost:5005/api/orders")
      .then((response) => setOrders(response.data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  // Handle delete order
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5005/api/orders/${id}`)
      .then(() => setOrders(orders.filter(order => order._id !== id)))
      .catch((error) => console.error("Error deleting order:", error));
  };

  return (
    <div className="container">
      <h2 className="my-4">Orders</h2>
      <Link to="/orders/new">
        <Button variant="success" className="mb-3">
          Add New Order
        </Button>
      </Link>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Restaurant ID</th>
            <th>Food ID</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Price</th>
            <th>Delivery Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order._id}>
              {/* Main Order Row (no Order ID shown) */}
              <tr style={{ backgroundColor: "#f9f9f9", fontSize: "16px" }}>
                <td rowSpan={order.items.length + 1}>{order.customerId}</td>
                <td rowSpan={order.items.length + 1}>{order.restaurantId}</td>
              </tr>
              {/* Map through the items array to display Food ID, Quantity, and Price */}
              {order.items.map((item, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f2f2f2" }}>
                  <td>{item.foodId}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.deliveryAddress}</td>
                  {/* Options Column with Edit and Delete Icons */}
                  <td>
                    <Link to={`/orders/edit/${order._id}`}>
                      <Button variant="warning" className="mr-2">
                        Edit
                      </Button>
                    </Link>
                    <Button variant="danger" onClick={() => handleDelete(order._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Orders;
