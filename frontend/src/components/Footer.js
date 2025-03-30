import React from "react";
import "../styles/footer.css";
import { motion } from "framer-motion";

function Footer() {
  return (
    <motion.footer
      className="home-footer"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="quick-links">
        <a href="/about">About</a>
        <a href="/faq">FAQ</a>
        <a href="/contact">Contact</a>
        <a href="/privacy">Privacy Policy</a>
      </div>
      <div className="social-links">
        <a href="#">Facebook</a>
        <a href="#">Twitter</a>
        <a href="#">Instagram</a>
      </div>
      <div className="newsletter">
        <p>Subscribe to our newsletter:</p>
        <input type="email" placeholder="Enter your email" />
        <button>Subscribe</button>
      </div>
      <p>&copy; 2023 FoodieExpress. All rights reserved.</p>
    </motion.footer>
  );
}

export default Footer;