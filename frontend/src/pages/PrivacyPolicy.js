import React from "react";
import "../styles/privacy.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="privacy-container">
        <h1>Privacy Policy</h1>
        <p>Your privacy is important to us. We ensure that your data is protected and used responsibly.</p>
      </div>
      <Footer />
    </>
  );
}

export default PrivacyPolicy;