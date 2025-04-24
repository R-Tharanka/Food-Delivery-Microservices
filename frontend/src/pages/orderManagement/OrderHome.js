import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";  // Import Table for displaying the order data and Form for search input
import { Link } from "react-router-dom";  // Import Link for navigation
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';  // Import icons for Edit, Delete, and Show Details
import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTI1NjRiOTU5MjliOGYyNDhkOGEzMCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc0NDM1MDQ1MSwiZXhwIjoxNzQ2OTQyNDUxfQ.C85afR3WOuprjtjU2Kp1zF6W0eOwbWLExHZ0c5-Z2iY";

function OrderHome({ handleDelete, handleEdit }) {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");  // State to store the search query

  // Load orders from localStorage when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response =  await axios.get("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
       //console.log(response)
       
      // should be if (response.status !== 200) {
       if (response.status!=200) {
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

  // Filter orders based on the search query (restaurant ID)
  const filteredOrders = orders
  .filter(order => order.status.toLowerCase() !== "canceled") 
  .filter((order) =>
    order.restaurantId.toLowerCase().includes(searchQuery.toLowerCase())
  );


  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container" style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Place Your Order</h1>

      {/* Search Bar */}
      <Form.Group style={{ marginBottom: "20px" }}>
        <Form.Control
          type="text"
          placeholder="Search by Restaurant ID"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            padding: "12px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
      </Form.Group>

      {/* Add New Order Button */}
      <Link to="/orders/new">
        <button
          className="mb-3"
          style={{
            backgroundColor: "#a3d8f4",
            borderColor: "#a3d8f4",
            fontSize: "16px",
            padding: "12px 20px",
            borderRadius: "4px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#7ec1e3"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#a3d8f4"}
        >
          Add New Order
        </button>
      </Link>

      {/* Orders Table */}
      <Table striped bordered hover style={{ width: "100%", marginTop: "20px", backgroundColor: "#ffffff", borderRadius: "8px" }}>
        <thead style={{ backgroundColor: "#a3d8f4", color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          <tr>
            <th>Customer ID</th>
            <th>Restaurant ID</th>
            <th>Food ID</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Price</th>
            <th>Delivery Address</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {filteredOrders.map((order) => (
            <React.Fragment key={order._id}>
              {/* Main Order Row (no Order ID shown) */}
              <tr style={{ backgroundColor: "#f9f9f9", fontSize: "16px" }}>
                <td rowSpan={order.items.length + 1}>{order.customerId}</td>
                <td rowSpan={order.items.length + 1}>{order.restaurantId}</td>
              </tr>

              {/* Map through the items array to display Food ID, Quantity, and Price */}
              {order.items.map((item, index) => (
                <tr key={`${order._id}-${item.foodId}-${index}`} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f2f2f2" }}>
                  <td>{item.foodId}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.deliveryAddress}</td>
                  {/* Options Column with Edit, Delete, and Show Details Icons */}
                  <td>
                    <Link to={`/orders/edit/${order._id}`} onClick={() => {}}>
                      <FaEdit style={{ color: "#ffc107", cursor: "pointer", marginRight: "10px" }} />
                    </Link>
                    <Link to={`/orders/delete/${order._id}`} onClick={() => {}}>
                      <FaTrashAlt />
                    </Link>

                    <Link to={`/orders/details/${order._id}`}>
                      <FaEye style={{ color: "#17a2b8", cursor: "pointer" }} />
                    </Link>
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

export default OrderHome;
