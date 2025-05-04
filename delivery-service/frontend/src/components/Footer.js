import React from "react";
import '../styles/footer.css';

import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <motion.footer
      className="home-footer"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="footer-row">
        <div className="footer-column">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <a href="/faq">FAQ</a>
          <a href="/contact">Contact and Feedback</a>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
        <div className="footer-column">
          <a href="#"><FaFacebook /> Facebook</a>
          <a href="#"><FaTwitter /> Twitter</a>
          <a href="#"><FaInstagram /> Instagram</a>
        </div>
        <div className="footer-column">
          <p>Subscribe to our newsletter:</p>
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
      </div>
      <div className="footer-row">
        <p>&copy; 2023 FoodieExpress. All rights reserved.</p>
      </div>
    </motion.footer>
  );
}

export default Footer;