// src/pages/Checkout.js
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

// Load your Stripe publishable key from environment variables
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  // Create PaymentIntent on the backend
  const createPaymentIntent = async () => {
    try {
      const response = await axios.post("http://localhost:5004/api/payment/process", {
        orderId: "ORDER12345",
        userId: "USER67890",
        amount: 50, // Example amount in dollars (or your currency unit)
        currency: "usd", // Use the same currency as in your backend
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phone: "0771234567",
      });
      setClientSecret(response.data.clientSecret);
    } catch (err) {
      console.error("Error creating PaymentIntent", err);
      setError("Failed to create payment. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setLoading(true);
    setError(null);
    
    // Confirm the card payment
    const cardElement = elements.getElement(CardElement);
    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: "John Doe",
          email: "johndoe@example.com",
        },
      },
    });

    if (confirmError) {
      setError(confirmError.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment successful!");
      setLoading(false);
    }
  };

  // Create PaymentIntent when component mounts (or when user clicks a "Pay" button)
  React.useEffect(() => {
    createPaymentIntent();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Checkout</h2>
      <CardElement options={{ hidePostalCode: true }} />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {message && <div style={{ color: "green" }}>{message}</div>}
    </form>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
