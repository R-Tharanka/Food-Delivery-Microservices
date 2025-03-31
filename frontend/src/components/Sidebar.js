import React from "react";
import { motion } from "framer-motion";
import "../styles/sidebar.css";

function Sidebar({ isOpen, onClose, isLoggedIn }) {
  const closeSidebar = (e) => {
    if (e.target.className === "sidebar-overlay") {
      onClose();
    }
  };

  return (
    isOpen && (
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
                <img src="/path/to/profile-image.jpg" alt="Profile" className="profile-image" />
                <p className="profile-name">John Doe</p>
                <a href="/dashboard" className="profile-link">Dashboard</a>
              </div>
              <div className="sidebar-links">
                <a href="/orders">Orders</a>
                <a href="/wallet">Wallet</a>
                <a href="/restaurants">Restaurants</a>
              </div>
              <div className="sidebar-actions">
                <a href="/add-restaurant">Partner with Us</a>
                <a href="/signup-delivery">Join as Delivery Partner</a>
              </div>
              <button className="signout-button">Sign Out</button>
            </>
          ) : (
            <div className="sidebar-actions">
              <button className="login-button">Login</button>
              <button className="signup-button">Signup</button>
              <a href="/add-restaurant">Partner with Us</a>
              <a href="/signup-delivery">Join as Delivery Partner</a>
            </div>
          )}
        </motion.div>
      </div>
    )
  );
}

export default Sidebar;