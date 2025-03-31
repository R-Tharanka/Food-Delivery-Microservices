import React from "react";
import "../styles/contactFeedback.css";
import { FaUser, FaEnvelope, FaCommentDots, FaStar } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ContactAndFeedback() {
  return (
    <div className="contact-feedback-page">
      <Header />
      <section className="contact-feedback-hero-section">
        <h1>We'd Love to Hear From You</h1>
        <p>Contact us for any inquiries or share your valuable feedback to help us improve.</p>
      </section>

      <div className="contact-feedback-content-container">
        <section className="contact-feedback-section">
          <h2>Contact Us</h2>
          <form>
            <div className="contact-feedback-form-group">
              <label htmlFor="name" className="contact-feedback-label"><FaUser /> Name:</label>
              <input type="text" id="name" name="name" placeholder="Your Name" required className="contact-feedback-input" />
            </div>

            <div className="contact-feedback-form-group">
              <label htmlFor="email" className="contact-feedback-label"><FaEnvelope /> Email:</label>
              <input type="email" id="email" name="email" placeholder="Your Email" required className="contact-feedback-input" />
            </div>

            <div className="contact-feedback-form-group">
              <label htmlFor="message" className="contact-feedback-label"><FaCommentDots /> Message:</label>
              <textarea id="message" name="message" placeholder="Your Message" required className="contact-feedback-textarea"></textarea>
            </div>

            <button type="submit" className="contact-feedback-button">Send Message</button>
          </form>
        </section>

        <section className="feedback-section">
          <h2>Feedback</h2>
          <form>
            <div className="contact-feedback-form-group">
              <label htmlFor="rating" className="contact-feedback-label"><FaStar /> Rate Us:</label>
              <select id="rating" name="rating" required className="contact-feedback-select">
                <option value="">Select Rating</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>

            <div className="contact-feedback-form-group">
              <label htmlFor="feedback" className="contact-feedback-label"><FaCommentDots /> Your Feedback:</label>
              <textarea id="feedback" name="feedback" placeholder="Your Feedback" required className="contact-feedback-textarea"></textarea>
            </div>

            <button type="submit" className="contact-feedback-button">Submit Feedback</button>
          </form>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default ContactAndFeedback;