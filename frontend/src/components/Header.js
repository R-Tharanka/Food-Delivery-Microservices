import { motion } from "framer-motion";
import React, { useState } from "react";
import "../styles/header.css";

function Header() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <motion.header
      className="home-header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="logo">FoodieExpress</div>
      <nav className="nav-links">
        <a href="/">Home</a>
        <a href="/menu">Menu</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/order" className="order-now">Order Now</a>
      </nav>
      <div className="header-actions">
        <motion.div
          className="cart-icon"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span>🛒</span>
          <span className="cart-count">{cartCount}</span>
        </motion.div>
        <motion.button
          className="login-signup"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Login / Signup
        </motion.button>
      </div>
    </motion.header>
  );
}

export default Header;