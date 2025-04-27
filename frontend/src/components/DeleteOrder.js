import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";

function DeleteOrder() {
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTI1NjRiOTU5MjliOGYyNDhkOGEzMCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc0NDM1MDQ1MSwiZXhwIjoxNzQ2OTQyNDUxfQ.C85afR3WOuprjtjU2Kp1zF6W0eOwbWLExHZ0c5-Z2iY";

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5005/api/orders/${id}`, {
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
    axios.delete(`http://localhost:5005/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        alert("Your order is Canceled"); // ✅ Show the alert after successful delete
        navigate("/orders");
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
    <div style={backgroundStyle}>
      
      {/* Back Button with FaArrowLeft */}
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <Button
          variant="light"
          onClick={() => navigate("/orders")}
          style={backButtonStyle}
        >
          <FaArrowLeft size={24} />
        </Button>
      </div>

      <div className="container" style={cardContainerStyle}>
        <h2 style={headingStyle}>Delete Order</h2>
        <p style={textStyle}>Are you sure you want to delete the following order?</p>
        <ul style={orderDetailsStyle}>
          <li><strong>Customer Name:</strong> {order.customerId}</li>
          <li><strong>Restaurant Name:</strong> {order.restaurantId}</li>
          <li><strong>Delivery Address:</strong> {order.deliveryAddress}</li>
        </ul>
        <div style={buttonContainerStyle}>
          <Button variant="danger" onClick={handleDelete} style={deleteButtonStyle}>
            Delete Order
          </Button>
        </div>
      </div>
    </div>
  );
}

// CSS Styles
const backgroundStyle = {
  backgroundColor: "#ffffff",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const cardContainerStyle = {
  padding: "30px",
  maxWidth: "600px",
  width: "100%",
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

const backButtonStyle = {
  border: "none",
  background: "none",
  cursor: "pointer",
};

export default DeleteOrder;
