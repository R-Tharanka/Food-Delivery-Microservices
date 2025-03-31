// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactAndFeedback from "./pages/ContactAndFeedback";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<ContactAndFeedback />} />
      </Routes>
    </Router>
  );
}

export default App;
