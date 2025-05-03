import React from "react";
import "../styles/about.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <Header />
      <div className="about-container">
        <h1>About Us</h1>
        <p>Welcome to FoodieExpress! We are dedicated to delivering delicious food to your doorstep.</p>
      </div>
      <Footer />
    </>
  );
}

export default About;