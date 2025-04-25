import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Spinner } from "react-bootstrap";
import { ArrowLeftCircle } from "react-bootstrap-icons"; // Back icon

function UpdateOrder({ addOrder }) {
  const [order, setOrder] = useState({
    customerId: "",
    restaurantId: "",
    items: [{ foodId: "", quantity: 1, price: 0 }],
    totalPrice: 0,
    deliveryAddress: "",
  });
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTI1NjRiOTU5MjliOGYyNDhkOGEzMCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc0NDM1MDQ1MSwiZXhwIjoxNzQ2OTQyNDUxfQ.C85afR3WOuprjtjU2Kp1zF6W0eOwbWLExHZ0c5-Z2iY";

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5005/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setOrder(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching order:", error);
          alert("Error fetching the order details.");
          setLoading(false);
        });
    } else {
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

    const totalPrice = order.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    const updatedOrder = { ...order, totalPrice };

    axios
      .patch(`http://localhost:5005/api/orders/${id}`, updatedOrder, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        addOrder(response.data);
        navigate("/orders");
      })
      .catch((error) => console.error("Error updating order:", error));
  };

  // Styles
  const formStyle = {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    width: "500px",
    margin: "auto",
    marginTop: "20px",
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
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    padding: "20px",
    flexDirection: "column",
  };

  const headingStyle = {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
  };

  const topRightButtonStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "10px",
  };

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
      <div style={topRightButtonStyle}>
        <Button
          variant="light"
          onClick={() => navigate("/orders")}
          style={{ border: "none", background: "none", fontSize: "24px" }}
        >
          <ArrowLeftCircle />
        </Button>
      </div>

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
            onChange={(e) =>
              setOrder({ ...order, restaurantId: e.target.value })
            }
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
            onChange={(e) =>
              setOrder({ ...order, deliveryAddress: e.target.value })
            }
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