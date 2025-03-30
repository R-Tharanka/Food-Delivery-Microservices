import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/home.css";

function Home() {
  return (
    <div className="home-container">
      <Header />

      <main className="home-main">
        {/* Hero Section */}
        <motion.div 
          className="hero-section"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">Get Your Favorite Food Delivered Fast & Fresh</h1>
          <p className="hero-subtitle">Delicious meals at your doorstep in minutes.</p>
          <div className="hero-buttons">
            <motion.a 
              href="/menu" 
              className="hero-button primary"
              whileHover={{ scale: 1.1 }}
            >
              Order Now
            </motion.a>
            <motion.a 
              href="/menu" 
              className="hero-button secondary"
              whileHover={{ scale: 1.1 }}
            >
              View Menu
            </motion.a>
          </div>
        </motion.div>

        {/* Featured Categories */}
        <section className="featured-categories">
          <h2>Popular Categories</h2>
          <div className="categories-grid">
            {['Burgers', 'Pizzas', 'Sushi', 'Desserts'].map((category, index) => (
              <motion.div 
                key={index} 
                className="category-card"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <img src={`/assets/images/${category.toLowerCase()}.jpg`} alt={category} />
                <h3>{category}</h3>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            {['Browse Menu', 'Order', 'Track', 'Enjoy!'].map((step, index) => (
              <motion.div 
                key={index} 
                className="step"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <img src={`/assets/icons/step-${index + 1}.png`} alt={step} />
                <p>{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials">
          <h2>What Our Customers Say</h2>
          <motion.div 
            className="testimonials-slider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Example testimonial */}
            <div className="testimonial">
              <img src="/assets/images/user1.jpg" alt="User 1" />
              <p>"Amazing service and delicious food! Highly recommend."</p>
              <div className="stars">★★★★★</div>
            </div>
          </motion.div>
        </section>

        {/* Call-to-Action Section */}
        <section className="cta-section">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            Order Now & Satisfy Your Cravings!
          </motion.h2>
          <motion.a 
            href="/menu" 
            className="cta-button"
            whileHover={{ scale: 1.1, brightness: 1.2 }}
          >
            Order Now
          </motion.a>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
