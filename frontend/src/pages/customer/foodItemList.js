import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../contexts/CartContext";

function FoodItemList() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [foods, setFoods] = useState([]);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const fetchRestaurantFoods = async () => {
      try {
        const res = await axios.get(`http://localhost:5002/api/food-items/restaurant/${restaurantId}`);
        setFoods(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load food items.");
      }
    };

    fetchRestaurantFoods();
  }, [restaurantId]);

  const toggleFavorite = (foodId) => {
    setFavorites((prev) => ({
      ...prev,
      [foodId]: !prev[foodId],
    }));
  };

  const handleAddToCart = (food) => {
    addToCart(food);
    navigate('/customer/cart');
  };

  return (
    <div style={{ 
      padding: "30px", 
      background: "linear-gradient(to bottom right, #f0f4f8, #d9e2ec)", 
      minHeight: "100vh" 
    }}>
      <h2 style={{ 
        fontSize: "32px", 
        fontWeight: "bold", 
        marginBottom: "30px", 
        textAlign: "center", 
        color: "#333",
      }}>
        🍔 Foods from Selected Restaurant
      </h2>

      {error && <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>{error}</p>}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          justifyContent: "center",
        }}
      >
        {foods.length === 0 ? (
          <p style={{ fontSize: "20px", color: "#333" }}>No food items available for this restaurant.</p>
        ) : (
          foods.map((food) => (
            <div
              key={food._id}
              style={{
                position: "relative",
                width: "280px",
                background: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
              }}
            >
              <img
                src={food.image || "https://placehold.co/300x180?text=Food+Image"}
                alt={food.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: "16px" }}>
                <h5 style={{ fontSize: "18px", fontWeight: "600", color: "#222", marginBottom: "8px" }}>
                  {food.name}
                </h5>
                <p style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
                  {food.description}
                </p>
                <p style={{ fontWeight: "bold", fontSize: "16px", color: "#000" }}>
                  Rs. {food.price}
                </p>
                <p style={{ fontStyle: "italic", fontSize: "13px", color: "#777" }}>
                  Category: {food.category}
                </p>
              </div>

              {/* Favorite Button */}
              <div
                title={favorites[food._id] ? "Remove from favorite" : "Add to favorite"}
                onClick={() => toggleFavorite(food._id)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  fontSize: "22px",
                  color: favorites[food._id] ? "red" : "#aaa",
                  cursor: "pointer",
                  transition: "color 0.3s",
                  backgroundColor: "#ffffffcc",
                  borderRadius: "50%",
                  padding: "6px",
                }}
              >
                {favorites[food._id] ? "❤️" : "🤍"}
              </div>

              {/* Add to Cart Button */}
              <div
                title="Add to cart"
                onClick={() => handleAddToCart(food)}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  fontSize: "24px",
                  backgroundColor: "#ff6600",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ff8533")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff6600")}
              >
                +
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FoodItemList;
