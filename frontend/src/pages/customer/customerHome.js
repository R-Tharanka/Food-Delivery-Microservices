import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomerHome() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5002/api/superadmin/restaurants', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setRestaurants(data);
        } else {
          setError(data.message || 'Failed to fetch restaurants');
        }
      } catch (err) {
        setError('Server error while fetching restaurants');
      }
    };

    fetchRestaurants();
  }, []);

  const handleCardClick = (restaurantId) => {
    navigate(`/customer/restaurant/${restaurantId}/foods`);
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#fff8f0", minHeight: "100vh" }}>
      <h2 style={{ 
        fontSize: "36px", 
        fontWeight: "bold", 
        marginBottom: "30px", 
        color: "#ff6b00", 
        textAlign: "center",
        textShadow: "1px 1px 2px black"
      }}>
        🍽️ Discover Outlets Near You
      </h2>

      {/* Search input */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
        <input
          type="text"
          placeholder="🔍 Find your favorite food spot..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "380px",
            padding: "14px 20px",
            fontSize: "16px",
            borderRadius: "999px",
            border: "1px solid #ddd",
            outline: "none",
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease-in-out",
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = "0 6px 18px rgba(0,0,0,0.2)";
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          }}
        />
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {/* Restaurant Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          padding: "0 20px",
        }}
      >
        {filteredRestaurants.length === 0 ? (
          <p style={{ textAlign: "center", color: "black", fontSize: "20px" }}>No restaurants found.</p>
        ) : (
          filteredRestaurants.map((rest) => (
            <div
              key={rest._id}
              onClick={() => handleCardClick(rest._id)}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)", // ✨ Soft realistic shadow
                cursor: "pointer",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
              }}
            >
              <img
                src={rest.imageURL || "https://via.placeholder.com/300x200?text=Restaurant+Image"}
                alt={rest.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: "16px" }}>
                <h5 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", marginBottom: "8px" }}>
                  {rest.name}
                </h5>
                <p style={{ margin: "6px 0", fontSize: "14px", color: "#666" }}>
                  📍 <strong style={{ color: "#444" }}>Location:</strong> {rest.location}
                </p>
                <p style={{ margin: "6px 0", fontSize: "14px", color: "#666" }}>
                  📞 <strong style={{ color: "#444" }}>Contact:</strong> {rest.contactNumber}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CustomerHome;
