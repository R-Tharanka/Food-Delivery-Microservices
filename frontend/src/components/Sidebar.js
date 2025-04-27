// src/components/Sidebar.jsx
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";
import "../styles/sidebar.css";

function Sidebar({ isOpen, onClose, isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const closeSidebar = (e) => {
    if (e.target.className === "sidebar-overlay") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sidebar-overlay" onClick={closeSidebar}>
      <motion.div
        className="sidebar"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        transition={{ duration: 0.5 }}
      >
        {isLoggedIn ? (
          <>
            <div className="sidebar-profile">
              {/* If you have a profile image URL in state, use it. Otherwise placeholder */}
              <img
                src="/path/to/profile-image.jpg"
                alt="Profile"
                className="profile-image"
              />
              <p className="profile-name">John Doe</p>
              <Link to="/customer/profile" className="profile-link" onClick={onClose}>
                Dashboard
              </Link>
            </div>

            <div className="sidebar-links">
              <Link to="/orders" onClick={onClose}>Orders</Link>
              <Link to="/wallet" onClick={onClose}>Wallet</Link>
              <Link to="/restaurants" onClick={onClose}>Restaurants</Link>
            </div>

            <div className="sidebar-actions">
              <Link to="/add-restaurant" onClick={onClose}>Partner with Us</Link>
              <Link to="/signup-delivery" onClick={onClose}>Join as Delivery Partner</Link>
            </div>

            <button
              className="side_bar-signout-button"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <div className="sidebar-actions">
            <Link to="/auth/login">
              <button className="side_bar-login-button" onClick={onClose}>
                Login
              </button>
            </Link>
            <Link to="/auth/register">
              <button className="side_bar-signup-button" onClick={onClose}>
                Signup
              </button>
            </Link>
            <Link to="/add-restaurant" onClick={onClose}>
              Partner with Us
            </Link>
            <Link to="/signup-delivery" onClick={onClose}>
              Join as Delivery Partner
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Sidebar;
