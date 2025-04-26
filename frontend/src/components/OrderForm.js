import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Spinner } from "react-bootstrap";
import { BsPlusCircle, BsDashCircle, BsArrowLeftCircle } from "react-icons/bs"; // Import all needed icons

function OrderForm({ addOrder }) {
  const [order, setOrder] = useState({
    customerId: "",
    restaurantId: "",
    items: [{ foodId: "", quantity: 1, price: 0 }],
    totalPrice: 0,
    deliveryAddress: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTI1NjRiOTU5MjliOGYyNDhkOGEzMCIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc0NDM1MDQ1MSwiZXhwIjoxNzQ2OTQyNDUxfQ.C85afR3WOuprjtjU2Kp1zF6W0eOwbWLExHZ0c5-Z2iY";

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...order.items];
    newItems[index] = { ...newItems[index], [name]: value };
    setOrder({ ...order, items: newItems });
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const totalPrice = order.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    const newOrder = { ...order, totalPrice };

    try {
      await axios.post("http://localhost:5000/api/orders", newOrder, {
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
      {/* Back Icon Button Outside the Card */}
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
          {/* Customer ID */}
          <Form.Group
            style={{
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Form.Label
              style={{
                marginBottom: "8px",
                fontWeight: "500",
                fontSize: "15px",
                color: "#333",
              }}
            >
              Customer ID
            </Form.Label>
            <Form.Control
              type="text"
              value={order.customerId}
              onChange={(e) =>
                setOrder({ ...order, customerId: e.target.value })
              }
              required
              style={{
                padding: "12px",
                fontSize: "16px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </Form.Group>

          {/* Restaurant ID */}
          <Form.Group
            style={{
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Form.Label
              style={{
                marginBottom: "8px",
                fontWeight: "500",
                fontSize: "15px",
                color: "#333",
              }}
            >
              Restaurant ID
            </Form.Label>
            <Form.Control
              type="text"
              value={order.restaurantId}
              onChange={(e) =>
                setOrder({ ...order, restaurantId: e.target.value })
              }
              required
              style={{
                padding: "12px",
                fontSize: "16px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </Form.Group>

          {/* Dynamic Items List */}
          {order.items.map((item, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >
                <h5>Item {index + 1}</h5>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  {index === order.items.length - 1 && (
                    <BsPlusCircle
                      size={30}
                      style={{ cursor: "pointer", color: "#4CAF50" }}
                      onClick={handleAddItem}
                    />
                  )}
                  {order.items.length > 1 && (
                    <BsDashCircle
                      size={30}
                      style={{ cursor: "pointer", color: "#f44336" }}
                      onClick={() => handleRemoveItem(index)}
                    />
                  )}
                </div>
              </div>

              {/* Food ID */}
              <Form.Group
                style={{
                  marginBottom: "15px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Form.Label
                  style={{
                    marginBottom: "8px",
                    fontWeight: "500",
                    fontSize: "15px",
                    color: "#333",
                  }}
                >
                  Food ID
                </Form.Label>
                <Form.Control
                  type="text"
                  name="foodId"
                  value={item.foodId}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                  style={{
                    padding: "12px",
                    fontSize: "16px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </Form.Group>

              {/* Quantity */}
              <Form.Group
                style={{
                  marginBottom: "15px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Form.Label
                  style={{
                    marginBottom: "8px",
                    fontWeight: "500",
                    fontSize: "15px",
                    color: "#333",
                  }}
                >
                  Quantity
                </Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                  style={{
                    padding: "12px",
                    fontSize: "16px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </Form.Group>

              {/* Price */}
              <Form.Group
                style={{
                  marginBottom: "15px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Form.Label
                  style={{
                    marginBottom: "8px",
                    fontWeight: "500",
                    fontSize: "15px",
                    color: "#333",
                  }}
                >
                  Price
                </Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                  style={{
                    padding: "12px",
                    fontSize: "16px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </Form.Group>
            </div>
          ))}

          {/* Delivery Address */}
          <Form.Group
            style={{
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Form.Label
              style={{
                marginBottom: "8px",
                fontWeight: "500",
                fontSize: "15px",
                color: "#333",
              }}
            >
              Delivery Address
            </Form.Label>
            <Form.Control
              type="text"
              value={order.deliveryAddress}
              onChange={(e) =>
                setOrder({ ...order, deliveryAddress: e.target.value })
              }
              required
              style={{
                padding: "12px",
                fontSize: "16px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
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
              backgroundColor: "#dd7f32",
              borderColor: "#dd7f32",
              color: "#fff",
              borderRadius: "4px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#dd7f32")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "#f0a35f")
            }
            disabled={loading}
          >
            {loading ? (
              <Spinner
                animation="border"
                size="sm"
                style={{ marginRight: "10px" }}
              />
            ) : null}
            {loading ? "Creating Order..." : "Create Order"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default OrderForm;
