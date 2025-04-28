import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Spinner } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa"; 

function UpdateOrder({ addOrder }) {
  const [order, setOrder] = useState({
    customerId: "",
    restaurantId: "",
    items: [{ foodId: "", quantity: 1, price: 0 }],
    totalPrice: 0,
    deliveryAddress: "",
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
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

  const validate = () => {
    const newErrors = {};

    const onlyLetters = /^[A-Za-z\s]+$/;
    const addressRegex = /^[A-Za-z0-9\s,\.]+$/;

    if (!order.customerId.trim() || !onlyLetters.test(order.customerId)) {
      newErrors.customerId = "Customer name must contain only letters.";
    }

    if (!order.restaurantId.trim() || !onlyLetters.test(order.restaurantId)) {
      newErrors.restaurantId = "Restaurant name must contain only letters.";
    }

    order.items.forEach((item, index) => {
      if (!item.foodId.trim() || !onlyLetters.test(item.foodId)) {
        newErrors[`foodId_${index}`] = "Food name must contain only letters.";
      }
      if (Number(item.quantity) <= 0) {
        newErrors[`quantity_${index}`] = "Quantity must be a positive number.";
      }
      if (Number(item.price) <= 0) {
        newErrors[`price_${index}`] = "Price must be a positive number.";
      }
    });

    if (!order.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "Delivery address must not be empty.";
    } else if (order.deliveryAddress.trim().length < 10) {
      newErrors.deliveryAddress = "Delivery address must be at least 10 characters.";
    } else if (!addressRegex.test(order.deliveryAddress)) {
      newErrors.deliveryAddress =
        "Delivery address can only contain letters, numbers, commas, dots, and spaces.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...order.items];
    newItems[index] = { ...newItems[index], [name]: value };
    setOrder({ ...order, items: newItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

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
        alert("Your Order Is Successfully Updated!");
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
    marginBottom: "5px",
  };

  const errorStyle = {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  };

  const buttonStyle = {
    backgroundColor: "#dd7f32",
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

  if (loading) {
    return (
      <div className="container" style={loadingStyle}>
        <Spinner animation="border" />
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ ...containerStyle, position: "relative" }}>
      {/* Back Button */}
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <Button
          variant="light"
          onClick={() => navigate("/orders")}
          style={{ border: "none", background: "none", fontSize: "30px" }}
        >
          <FaArrowLeft />
        </Button>
      </div>

      <h2 style={headingStyle}>Edit Order</h2>

      <Form onSubmit={handleSubmit} style={formStyle}>
        <Form.Group style={formGroupStyle}>
          <Form.Label>Customer Name</Form.Label>
          <Form.Control
            type="text"
            value={order.customerId}
            onChange={(e) => setOrder({ ...order, customerId: e.target.value })}
            required
            style={formControlStyle}
          />
          {errors.customerId && <div style={errorStyle}>{errors.customerId}</div>}
        </Form.Group>

        <Form.Group style={formGroupStyle}>
          <Form.Label>Restaurant Name</Form.Label>
          <Form.Control
            type="text"
            value={order.restaurantId}
            onChange={(e) =>
              setOrder({ ...order, restaurantId: e.target.value })
            }
            required
            style={formControlStyle}
          />
          {errors.restaurantId && <div style={errorStyle}>{errors.restaurantId}</div>}
        </Form.Group>

        {order.items.map((item, index) => (
          <div key={index}>
            <Form.Group style={formGroupStyle}>
              <Form.Label>Food</Form.Label>
              <Form.Control
                type="text"
                name="foodId"
                value={item.foodId}
                onChange={(e) => handleItemChange(index, e)}
                required
                style={formControlStyle}
              />
              {errors[`foodId_${index}`] && <div style={errorStyle}>{errors[`foodId_${index}`]}</div>}
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
              {errors[`quantity_${index}`] && <div style={errorStyle}>{errors[`quantity_${index}`]}</div>}
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
              {errors[`price_${index}`] && <div style={errorStyle}>{errors[`price_${index}`]}</div>}
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
          {errors.deliveryAddress && <div style={errorStyle}>{errors.deliveryAddress}</div>}
        </Form.Group>

        <Button type="submit" style={buttonStyle}>
          Update Order
        </Button>
      </Form>
    </div>
  );
}

export default UpdateOrder;
