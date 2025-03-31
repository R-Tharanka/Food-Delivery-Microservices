import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Spinner } from "react-bootstrap";

function OrderForm({ addOrder }) {
  const [order, setOrder] = useState({
    customerId: "",
    restaurantId: "",
    items: [{ foodId: "", quantity: 1, price: 0 }],
    totalPrice: 0,
    deliveryAddress: "",
  });

  const [loading, setLoading] = useState(false); // State to track loading status
  const navigate = useNavigate(); // useNavigate hook for navigation

  // Hardcoded token for testing purposes
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTI1NjRiOTU5MjliOGYyNDhkOGEzMCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc0MzM0NzcyNCwiZXhwIjoxNzQ1OTM5NzI0fQ.PCcd_lcXB-CyLk2Cib3xl-eH5OCQQ_g3oVl-mA-a86w";

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...order.items];
    newItems[index] = { ...newItems[index], [name]: value };
    setOrder({ ...order, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner

    const totalPrice = order.items.reduce(
      (total, item) => total + item.quantity * item.price, 0
    );

    const newOrder = { ...order, totalPrice };

    try {
      await axios.post("http://localhost:5000/api/orders", newOrder, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      // Optimistically add the new order to the state and persist it in localStorage
      addOrder(newOrder);
      localStorage.setItem("orders", JSON.stringify([...JSON.parse(localStorage.getItem("orders") || "[]"), newOrder])); // Save to localStorage
      navigate("/orders"); // Navigate to Home page after creating the order
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an error creating your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f4f8", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "600px", padding: "30px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Create New Order</h2>
        <Form onSubmit={handleSubmit}>
          {/* Customer ID */}
          <Form.Group style={{ marginBottom: "20px" }}>
            <Form.Label>Customer ID</Form.Label>
            <Form.Control
              type="text"
              value={order.customerId}
              onChange={(e) => setOrder({ ...order, customerId: e.target.value })}
              required
              style={{ padding: "12px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </Form.Group>

          {/* Restaurant ID */}
          <Form.Group style={{ marginBottom: "20px" }}>
            <Form.Label>Restaurant ID</Form.Label>
            <Form.Control
              type="text"
              value={order.restaurantId}
              onChange={(e) => setOrder({ ...order, restaurantId: e.target.value })}
              required
              style={{ padding: "12px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </Form.Group>

          {/* Dynamically render food items */}
          {order.items.map((item, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <Form.Group style={{ marginBottom: "15px" }}>
                <Form.Label>Food ID</Form.Label>
                <Form.Control
                  type="text"
                  name="foodId"
                  value={item.foodId}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                  style={{ padding: "12px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
              </Form.Group>

              <Form.Group style={{ marginBottom: "15px" }}>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                  style={{ padding: "12px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
              </Form.Group>

              <Form.Group style={{ marginBottom: "15px" }}>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                  style={{ padding: "12px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
              </Form.Group>
            </div>
          ))}

          {/* Delivery Address */}
          <Form.Group style={{ marginBottom: "20px" }}>
            <Form.Label>Delivery Address</Form.Label>
            <Form.Control
              type="text"
              value={order.deliveryAddress}
              onChange={(e) => setOrder({ ...order, deliveryAddress: e.target.value })}
              required
              style={{ padding: "12px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </Form.Group>

          {/* Submit Button */}
          <Button
            variant="primary"
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              backgroundColor: "#a3d8f4",  // Light blue color
              borderColor: "#a3d8f4",      // Ensure border matches button color
              color: "#fff",               // Text color white for contrast
              borderRadius: "4px",         // Slightly rounded corners
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",  // Subtle shadow for depth
              transition: "background-color 0.3s ease", // Smooth transition for hover
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#7ec1e3"} // Slightly darker on hover
            onMouseOut={(e) => e.target.style.backgroundColor = "#a3d8f4"} // Reverts back to light blue
            disabled={loading}  // Disable button while loading
          >
            {loading ? (
              <Spinner animation="border" size="sm" style={{ marginRight: "10px" }} />
            ) : null}
            {loading ? "Creating Order..." : "Create Order"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default OrderForm;
