import React, { useContext } from "react";
import { useNavigate } from "react-router-dom"; // 🛣️ Import navigation hook
import { CartContext } from "../contexts/CartContext";
import { FaArrowLeft } from "react-icons/fa"; // ⬅️ Import Back arrow icon

function AddToCartPage() {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate(); // 🛣️ Create navigate function

  const handleProceed = () => {
    navigate("/orders/new"); // Navigate to OrderHome page
  };

  const handleBackToFoodList = () => {
    navigate("/customer/home"); // Navigate back to FoodItemList page
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#f0f2f5", minHeight: "100vh", position: "relative" }}>
      
      {/* Back Arrow Icon Button */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleBackToFoodList}
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
          <FaArrowLeft />
        </button>
      </div>

      <h2 style={{ 
        fontSize: "32px", 
        fontWeight: "bold", 
        marginBottom: "30px", 
        textAlign: "center",
        color: "#333"
      }}>
        🛒 Review Your Order
      </h2>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>
          Your cart is currently empty. Start adding some delicious items! 🍔🍟
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "25px",
            justifyContent: "center",
          }}
        >
          {cartItems.map((item, index) => (
            <div
              key={index}
              style={{
                width: "300px",
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                position: "relative",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.1)";
              }}
            >
              <img
                src={item.image || "https://placehold.co/300x200?text=Food+Image"}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: "16px" }}>
                <h5 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
                  {item.name}
                </h5>
                <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
                  {item.description}
                </p>
                <p style={{ fontSize: "16px", fontWeight: "bold", color: "#333", marginBottom: "6px" }}>
                  Rs. {item.price}
                </p>
                <p style={{ fontSize: "13px", color: "#999" }}>
                  Category: {item.category}
                </p>
              </div>

              {/* Thin Orange Remove Button */}
              <div
                title="Remove from cart"
                onClick={() => removeFromCart(item._id)}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  fontSize: "22px",
                  fontWeight: "400",
                  color: "orange",
                  cursor: "pointer",
                  border: "2px solid black",
                  borderRadius: "50%",
                  padding: "4px 8px",
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "34px",
                  height: "34px",
                  transition: "background-color 0.3s, transform 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffe8d6";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                ×
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 👉 Bottom-right Button */}
      {cartItems.length > 0 && (
        <button
          onClick={handleProceed}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            backgroundColor: "#ff7f50",
            color: "white",
            padding: "14px 24px",
            borderRadius: "8px",
            border: "none",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            transition: "background-color 0.3s, transform 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#ff5722";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ff7f50";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Proceed to Order 🛒
        </button>
      )}
    </div>
  );
}

export default AddToCartPage;
