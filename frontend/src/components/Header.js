import { useState } from "react";
import { motion } from "framer-motion";
import React from "react";
import "../styles/header.css";
import Sidebar from "./Sidebar";

function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <motion.header
        className="home-header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-left">
          <div className="hamburger-menu" onClick={toggleSidebar}>☰</div>
          <div className="logo">SkyDish</div>
        </div>
        <div className="header-right">
          <motion.button
            className="login-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Login
          </motion.button>
          <motion.button
            className="signup-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Signup
          </motion.button>
        </div>
      </motion.header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

export default Header;