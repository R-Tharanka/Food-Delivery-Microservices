import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";

function DeleteOrder() {
  const [order, setOrder] = useState(null);
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTI1NjRiOTU5MjliOGYyNDhkOGEzMCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc0MzM0NzcyNCwiZXhwIjoxNzQ1OTM5NzI0fQ.PCcd_lcXB-CyLk2Cib3xl-eH5OCQQ_g3oVl-mA-a86w";

  useEffect(() => {
    // Log the order ID and token to ensure they are correct
    console.log("Order ID:", id);
    console.log("Authorization token:", token);
   

    if (id) {
      // Fetch order to confirm details before deleting
      axios.get(`http://localhost:5000/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setOrder(response.data);
        })
        .catch((error) => {
          console.error("Error fetching order:", error);
          alert("Error fetching the order details.");
        });
    } else {
      console.error("ID is missing from the URL");
      alert("Order ID is missing.");
    }
  }, [id]);

  const handleDelete = () => {
    // Delete the order
    axios.delete(`http://localhost:5000/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
   
        navigate("/orders"); // Redirect to Home page after deletion
      })
      .catch((error) => {
        console.error("Error deleting order:", error);
        alert("Error deleting the order.");
      });
  };

  if (!order) return (
    <div className="container" style={loadingStyle}>
      <Spinner animation="border" />
      <p>Loading...</p>
    </div>
  );

  return (
    <div className="container" style={containerStyle}>
      <h2 style={headingStyle}>Delete Order</h2>
      <p style={textStyle}>Are you sure you want to delete the following order?</p>
      <ul style={orderDetailsStyle}>
        <li><strong>Customer ID:</strong> {order.customerId}</li>
        <li><strong>Restaurant ID:</strong> {order.restaurantId}</li>
        <li><strong>Delivery Address:</strong> {order.deliveryAddress}</li>
      </ul>
      <div style={buttonContainerStyle}>
        <Button variant="danger" onClick={handleDelete} style={deleteButtonStyle}>
          Delete Order
        </Button>
      </div>
    </div>
  );
}

// CSS Styles
const containerStyle = {
  padding: "30px",
  maxWidth: "600px",
  margin: "auto",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
};

const headingStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
  color: "#333",
};

const textStyle = {
  fontSize: "18px",
  marginBottom: "20px",
  color: "#555",
};

const orderDetailsStyle = {
  textAlign: "left",
  listStyleType: "none",
  padding: "0",
  marginBottom: "30px",
};

const buttonContainerStyle = {
  marginTop: "20px",
};

const deleteButtonStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "18px",
  backgroundColor: "#dc3545",
  borderColor: "#dc3545",
  color: "#fff",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

const loadingStyle = {
  textAlign: "center",
  paddingTop: "50px",
};

export default DeleteOrder;
