import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/home.css";

// Import images
import burgerImage from "../assets/images/burgers.jpg";
import pizzaImage from "../assets/images/pizzas.png";
import sushiImage from "../assets/images/sushi.jpg";
import dessertImage from "../assets/images/desserts.png";
import step1Icon from "../assets/images/sushi.jpg";
import step2Icon from "../assets/images/sushi.jpg";
import step3Icon from "../assets/images/sushi.jpg";
import step4Icon from "../assets/images/sushi.jpg";
import user1Image from "../assets/images/sushi.jpg";

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
          </div>
        </motion.div>

        {/* Featured Categories */}
        <section className="featured-categories">
          <h2>Popular Categories</h2>
          <div className="categories-grid">
            {[
              { name: 'Burgers', image: burgerImage },
              { name: 'Pizzas', image: pizzaImage },
              { name: 'Sushi', image: sushiImage },
              { name: 'Desserts', image: dessertImage }
            ].map((category, index) => (
              <motion.div 
                key={index} 
                className="category-card"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <img src={category.image} alt={category.name} />
                <h3>{category.name}</h3>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            {[
              { step: 'Browse Menu', icon: step1Icon },
              { step: 'Order', icon: step2Icon },
              { step: 'Track', icon: step3Icon },
              { step: 'Enjoy!', icon: step4Icon }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="step"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <img src={item.icon} alt={item.step} />
                <p>{item.step}</p>
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
              <img src={user1Image} alt="User 1" />
              <p>"Amazing service and delicious food! Highly recommend."</p>
              <div className="stars">★★★★★</div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
