import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Spinner } from "react-bootstrap";

function UpdateOrder({ addOrder }) {
  const [order, setOrder] = useState({
    customerId: "",
    restaurantId: "",
    items: [{ foodId: "", quantity: 1, price: 0 }],
    totalPrice: 0,
    deliveryAddress: "",
  });
  const [loading, setLoading] = useState(true); // Track loading state
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();

  // Hardcoded token for testing purposes
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTI1NjRiOTU5MjliOGYyNDhkOGEzMCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc0MzA1OTkwOCwiZXhwIjoxNzQ1NjUxOTA4fQ.nHlIxPjdshWbMRihrny66MzbZI7HcOkrhNGNtKM3Rlk";

  useEffect(() => {
    if (id) {
      console.log("Fetching data for order ID:", id); // Debug log

      axios
        .get(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Fetched order:", response.data); // Debug log
          setOrder(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching order:", error);
          alert("Error fetching the order details.");
          setLoading(false);
        });
    } else {
      console.error("ID is missing from the URL");
      alert("Order ID is missing.");
      setLoading(false);
    }
  }, [id]);

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...order.items];
    newItems[index] = { ...newItems[index], [name]: value };
    setOrder({ ...order, items: newItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Recalculate total price
    const totalPrice = order.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    const updatedOrder = { ...order, totalPrice };

    // Send a request to update the existing order
    axios
      .patch(`http://localhost:5000/api/orders/${id}`, updatedOrder, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        addOrder(response.data); // Add updated order to the state
        navigate("/orders"); // Navigate to Home page after updating the order
      })
      .catch((error) => console.error("Error updating order:", error));
  };

  // CSS Styles
  const formStyle = {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    width: "500px",
    margin: "auto",
    marginTop: "50px",
  };

  const formGroupStyle = {
    marginBottom: "15px",
  };

  const formControlStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
  };

  const loadingStyle = {
    textAlign: "center",
    paddingTop: "50px",
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",  // Ensures the content is centered horizontally
    alignItems: "center",      // Ensures the content is centered vertically
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    padding: "20px",
    flexDirection: "column",   // Stack elements vertically
  };

  const headingStyle = {
    textAlign: "center", // Ensures the title is centered
    marginBottom: "30px", // Adds space below the title
    fontSize: "28px", // Adjusts the size of the title
    fontWeight: "bold", // Makes the title bold
    color: "#333", // Dark color for readability
  };

  // Show spinner if data is loading
  if (loading) {
    return (
      <div className="container" style={loadingStyle}>
        <Spinner animation="border" />
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="container" style={containerStyle}>
      <h2 style={headingStyle}>Edit Order</h2>
      <Form onSubmit={handleSubmit} style={formStyle}>
        <Form.Group style={formGroupStyle}>
          <Form.Label>Customer ID</Form.Label>
          <Form.Control
            type="text"
            value={order.customerId}
            onChange={(e) => setOrder({ ...order, customerId: e.target.value })}
            required
            style={formControlStyle}
          />
        </Form.Group>

        <Form.Group style={formGroupStyle}>
          <Form.Label>Restaurant ID</Form.Label>
          <Form.Control
            type="text"
            value={order.restaurantId}
            onChange={(e) => setOrder({ ...order, restaurantId: e.target.value })}
            required
            style={formControlStyle}
          />
        </Form.Group>

        {order.items.map((item, index) => (
          <div key={index}>
            <Form.Group style={formGroupStyle}>
              <Form.Label>Food ID</Form.Label>
              <Form.Control
                type="text"
                name="foodId"
                value={item.foodId}
                onChange={(e) => handleItemChange(index, e)}
                required
                style={formControlStyle}
              />
            </Form.Group>
            <Form.Group style={formGroupStyle}>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                required
                style={formControlStyle}
              />
            </Form.Group>
            <Form.Group style={formGroupStyle}>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={item.price}
                onChange={(e) => handleItemChange(index, e)}
                required
                style={formControlStyle}
              />
            </Form.Group>
          </div>
        ))}

        <Form.Group style={formGroupStyle}>
          <Form.Label>Delivery Address</Form.Label>
          <Form.Control
            type="text"
            value={order.deliveryAddress}
            onChange={(e) => setOrder({ ...order, deliveryAddress: e.target.value })}
            required
            style={formControlStyle}
          />
        </Form.Group>

        <Button type="submit" style={buttonStyle}>
          Update Order
        </Button>
      </Form>
    </div>
  );
}

export default UpdateOrder;
