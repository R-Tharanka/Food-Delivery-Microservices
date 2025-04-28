import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrashAlt,
  FaEye,
  FaShoppingCart,
  FaHome,
} from "react-icons/fa";
import axios from "axios";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTI1NjRiOTU5MjliOGYyNDhkOGEzMCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc0NDM1MDQ1MSwiZXhwIjoxNzQ2OTQyNDUxfQ.C85afR3WOuprjtjU2Kp1zF6W0eOwbWLExHZ0c5-Z2iY";

function OrderHome({ handleDelete, handleEdit }) {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status !== 200) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.data;
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders
    .filter((order) => order.status.toLowerCase() !== "canceled")
    .filter((order) =>
      order.restaurantId.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleBack = () => {
    navigate("/customer/home");
  };

  return (
    <div
      className="container"
      style={{ padding: "20px", backgroundColor: "#f8f9fa" }}
    >
      {/* Back Button */}
      <button
        onClick={handleBack}
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "#333",
          fontSize: "28px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FaHome />
      </button>

      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        All Orders
      </h1>

      {/* Search Bar */}
      <Form.Group style={{ marginBottom: "20px" }}>
        <Form.Control
          type="text"
          placeholder="Search by Restaurant ID"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            width: "400px",
          }}
        />
      </Form.Group>

      {/* Cart Button */}
      <Link to="/customer/cart">
        <button
          className="mb-3"
          style={{
            backgroundColor: "orange",
            borderColor: "orange",
            color: "white",
            fontSize: "16px",
            padding: "12px 20px",
            borderRadius: "4px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s ease, transform 0.3s ease",
            width: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "orange";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#ff9933";
            e.target.style.transform = "scale(1)";
          }}
        >
          <FaShoppingCart /> Cart
        </button>
      </Link>

      {/* Orders Table */}
      <Table
        bordered
        hover
        style={{
          width: "100%",
          marginTop: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
        }}
      >
        <thead
          style={{
            backgroundColor: "#333333", 
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          <tr>
            <th>Customer Name</th>
            <th>Restaurant Name</th>
            <th>Food</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Price</th>
            <th>Delivery Address</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody
          style={{
            backgroundColor: "#f9f9f9", // Light gray background
            textAlign: "center",
            fontSize: "16px",
          }}
        >
          {filteredOrders.map((order) => (
            <React.Fragment key={order._id}>
              {/* First Row with first item and row spans */}
              <tr style={{ backgroundColor: "#f9f9f9" }}>
                <td rowSpan={order.items.length}>{order.customerId}</td>
                <td rowSpan={order.items.length}>{order.restaurantId}</td>
                <td>{order.items[0].foodId}</td>
                <td>{order.items[0].quantity}</td>
                <td>{order.items[0].price}</td>
                <td rowSpan={order.items.length} style={{ verticalAlign: "middle" }}>
                  {order.totalPrice}
                </td>
                <td rowSpan={order.items.length} style={{ verticalAlign: "middle" }}>
                  {order.deliveryAddress}
                </td>
                <td rowSpan={order.items.length} style={{ verticalAlign: "middle" }}>
                  <Link to={`/orders/edit/${order._id}`}>
                    <FaEdit
                      style={{
                        color: "#ffc107",
                        cursor: "pointer",
                        marginRight: "10px",
                      }}
                    />
                  </Link>
                  <Link to={`/orders/delete/${order._id}`}>
                    <FaTrashAlt
                      style={{
                        color: "red",
                        cursor: "pointer",
                        marginRight: "10px",
                      }}
                    />
                  </Link>
                  <Link to={`/orders/details/${order._id}`}>
                    <FaEye
                      style={{
                        color: "#17a2b8",
                        cursor: "pointer",
                      }}
                    />
                  </Link>
                </td>
              </tr>

              {/* Remaining items */}
              {order.items.slice(1).map((item, index) => (
                <tr key={`${order._id}-${item.foodId}-${index}`}>
                  <td>{item.foodId}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default OrderHome;
