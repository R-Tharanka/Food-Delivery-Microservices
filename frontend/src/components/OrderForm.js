import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Spinner } from "react-bootstrap";
import { BsPlusCircle, BsDashCircle, BsArrowLeftCircle } from "react-icons/bs";

function OrderForm({ addOrder }) {
  const [order, setOrder] = useState({
    customerId: "",
    restaurantId: "",
    items: [{ foodId: "", quantity: 1, price: 0 }],
    totalPrice: 0,
    deliveryAddress: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTI1NjRiOTU5MjliOGYyNDhkOGEzMCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc0NDM1MDQ1MSwiZXhwIjoxNzQ2OTQyNDUxfQ.C85afR3WOuprjtjU2Kp1zF6W0eOwbWLExHZ0c5-Z2iY"; // Replace your token here

  const validateField = (name, value) => {
    switch (name) {
      case "customerId":
      case "restaurantId":
      case "foodId":
        if (!/^[A-Za-z\s]+$/.test(value)) {
          return "Only letters allowed.";
        }
        break;
      case "quantity":
      case "price":
        if (!/^\d+$/.test(value) || parseInt(value) <= 0) {
          return "Must be a positive number.";
        }
        break;
      case "deliveryAddress":
        if (!value.trim()) {
          return "Delivery Address is required.";
        }
        if (value.trim().length < 10) {
          return "Address must be at least 10 characters long.";
        }
        if (!/^[A-Za-z0-9\s,.-]+$/.test(value)) {
          return "Address can only contain letters, numbers, commas, dots, and spaces.";
        }
        break;
      default:
        break;
    }
    return "";
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...order.items];
    newItems[index] = { ...newItems[index], [name]: value };
    setOrder({ ...order, items: newItems });

    const error = validateField(name, value);
    const newErrors = { ...errors };
    if (!newErrors.items) newErrors.items = [];
    newErrors.items[index] = {
      ...newErrors.items[index],
      [name]: error,
    };
    setErrors(newErrors);
  };

  const handleAddItem = () => {
    setOrder({
      ...order,
      items: [...order.items, { foodId: "", quantity: 1, price: 0 }],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = [...order.items];
    newItems.splice(index, 1);
    setOrder({ ...order, items: newItems });

    if (errors.items) {
      const newErrors = { ...errors };
      newErrors.items.splice(index, 1);
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let formValid = true;
    const newErrors = {};

    if (!/^[A-Za-z\s]+$/.test(order.customerId)) {
      newErrors.customerId = "Only letters allowed.";
      formValid = false;
    }

    if (!/^[A-Za-z\s]+$/.test(order.restaurantId)) {
      newErrors.restaurantId = "Only letters allowed.";
      formValid = false;
    }

    const deliveryAddressError = validateField("deliveryAddress", order.deliveryAddress);
    if (deliveryAddressError) {
      newErrors.deliveryAddress = deliveryAddressError;
      formValid = false;
    }

    newErrors.items = [];
    order.items.forEach((item, index) => {
      const itemErrors = {};
      if (!/^[A-Za-z\s]+$/.test(item.foodId)) {
        itemErrors.foodId = "Only letters allowed.";
        formValid = false;
      }
      if (!/^\d+$/.test(item.quantity) || parseInt(item.quantity) <= 0) {
        itemErrors.quantity = "Must be a positive number.";
        formValid = false;
      }
      if (!/^\d+$/.test(item.price) || parseInt(item.price) <= 0) {
        itemErrors.price = "Must be a positive number.";
        formValid = false;
      }
      newErrors.items[index] = itemErrors;
    });

    setErrors(newErrors);

    if (!formValid) {
      setLoading(false);
      return;
    }

    const totalPrice = order.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    const newOrder = { ...order, totalPrice };

    try {
      await axios.post("http://localhost:5005/api/orders", newOrder, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      addOrder(newOrder);
      localStorage.setItem(
        "orders",
        JSON.stringify([
          ...JSON.parse(localStorage.getItem("orders") || "[]"),
          newOrder,
        ])
      );

      alert("Your Order Is Successfully Created 🎉");
      navigate("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an error creating your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{
        padding: "20px",
        backgroundColor: "#f0f4f8",
        minHeight: "100vh",
      }}
    >
      {/* Back Button */}
      <Button
        variant="link"
        onClick={() => navigate(-1)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "16px",
          color: "#333",
          marginBottom: "20px",
          textDecoration: "none",
        }}
      >
        <BsArrowLeftCircle size={22} />
      </Button>

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "30px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Create New Order
        </h2>

        <Form onSubmit={handleSubmit}>
          {/* Customer Name */}
          <Form.Group style={{ marginBottom: "20px" }}>
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              value={order.customerId}
              onChange={(e) => {
                setOrder({ ...order, customerId: e.target.value });
                setErrors({
                  ...errors,
                  customerId: validateField("customerId", e.target.value),
                });
              }}
              required
            />
            {errors.customerId && (
              <div style={{ color: "red", fontSize: "14px" }}>
                {errors.customerId}
              </div>
            )}
          </Form.Group>

          {/* Restaurant Name */}
          <Form.Group style={{ marginBottom: "20px" }}>
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Control
              type="text"
              value={order.restaurantId}
              onChange={(e) => {
                setOrder({ ...order, restaurantId: e.target.value });
                setErrors({
                  ...errors,
                  restaurantId: validateField("restaurantId", e.target.value),
                });
              }}
              required
            />
            {errors.restaurantId && (
              <div style={{ color: "red", fontSize: "14px" }}>
                {errors.restaurantId}
              </div>
            )}
          </Form.Group>

          {/* Dynamic Items */}
          {order.items.map((item, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              {/* Title and Plus Icon */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <h5 style={{ margin: 0 }}>Item {index + 1}</h5>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {index === order.items.length - 1 && (
                    <BsPlusCircle
                      size={26}
                      style={{ cursor: "pointer", color: "#4CAF50" }}
                      onClick={handleAddItem}
                    />
                  )}
                  {order.items.length > 1 && (
                    <BsDashCircle
                      size={26}
                      style={{ cursor: "pointer", color: "#f44336" }}
                      onClick={() => handleRemoveItem(index)}
                    />
                  )}
                </div>
              </div>

              {/* Food Name */}
              <Form.Group style={{ marginBottom: "10px" }}>
                <Form.Label>Food</Form.Label>
                <Form.Control
                  type="text"
                  name="foodId"
                  value={item.foodId}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                />
                {errors.items && errors.items[index]?.foodId && (
                  <div style={{ color: "red", fontSize: "14px" }}>
                    {errors.items[index].foodId}
                  </div>
                )}
              </Form.Group>

              {/* Quantity */}
              <Form.Group style={{ marginBottom: "10px" }}>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                />
                {errors.items && errors.items[index]?.quantity && (
                  <div style={{ color: "red", fontSize: "14px" }}>
                    {errors.items[index].quantity}
                  </div>
                )}
              </Form.Group>

              {/* Price */}
              <Form.Group style={{ marginBottom: "10px" }}>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                />
                {errors.items && errors.items[index]?.price && (
                  <div style={{ color: "red", fontSize: "14px" }}>
                    {errors.items[index].price}
                  </div>
                )}
              </Form.Group>
            </div>
          ))}

          {/* Delivery Address */}
          <Form.Group style={{ marginBottom: "20px" }}>
            <Form.Label>Delivery Address</Form.Label>
            <Form.Control
              type="text"
              value={order.deliveryAddress}
              onChange={(e) => {
                setOrder({ ...order, deliveryAddress: e.target.value });
                setErrors({
                  ...errors,
                  deliveryAddress: validateField("deliveryAddress", e.target.value),
                });
              }}
              required
            />
            {errors.deliveryAddress && (
              <div style={{ color: "red", fontSize: "14px" }}>
                {errors.deliveryAddress}
              </div>
            )}
          </Form.Group>

          {/* Submit Button */}
          <Button
            variant="primary"
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              backgroundColor: "#dd7f32",
              borderColor: "#dd7f32",
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Creating Order...
              </>
            ) : (
              "Create Order"
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default OrderForm;
