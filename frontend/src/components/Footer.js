import React from "react";
import "../styles/footer.css";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

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
          <a href="/about">About</a>
          <a href="/faq">FAQ</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
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