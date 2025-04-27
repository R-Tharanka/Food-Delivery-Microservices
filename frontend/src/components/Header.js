// src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";      // profile icon
import "../styles/header.css";
import Sidebar from "./Sidebar";

function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // On mount, check token presence
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const toggleSidebar = () => setSidebarOpen(open => !open);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setShowDropdown(false);
    navigate("/");  // redirect home
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
          <Link to="/" className="logo">SkyDish</Link>
        </div>

        <div className="header-right">
          {!isLoggedIn ? (
            <>
              <Link to="/auth/login">
                <motion.button className="login-button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  Login
                </motion.button>
              </Link>
              <Link to="/auth/register">
                <motion.button className="signup-button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  Signup
                </motion.button>
              </Link>
            </>
          ) : (
            <div className="profile-container" ref={dropdownRef}>
              {/* Profile Icon */}
              <FaUserCircle
                size={28}
                className="profile-icon"
                onClick={() => setShowDropdown(v => !v)}
              />

              {/* Dropdown Menu */}
              {showDropdown && (
                <motion.div
                  className="profile-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Link to="/customer/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    My Profile
                  </Link>
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    Logout
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} isLoggedIn={isLoggedIn}
        onLogout={handleLogout} />
    </>
  );
}

export default Header;
