import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import axios from "axios";
import "../../styles/checkout.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [cardType, setCardType] = useState("");
  const [disablePayment, setDisablePayment] = useState(false);

  const API_BASE_URL = "http://localhost:5004";

  // Example order data – in production this comes dynamically from your Order Service.
  const orderData = {
    orderId: "ORDER00000023",
    userId: "USER67890",
    amount: 48,
    currency: "usd",
    firstName: "John",
    lastName: "Doe",
    email: "tharankaruchira18@gmail.com",
    phone: "+94752504856", // Ensure phone is included
  };

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/payment/process`, orderData);
      console.log("Response from payment API:", response.data);
      
      if (response.data.paymentStatus === "Paid" || response.data.disablePayment) {
        setMessage("✅ This order has already been paid successfully.");
        setDisablePayment(true);
        return;
      }
      
      if (response.data.clientSecret) {
        setClientSecret(response.data.clientSecret);
      } else {
        setError("⚠️ No valid payment secret found.");
      }
    } catch (err) {
      console.error("Error creating PaymentIntent", err.response?.data || err.message);
      setError("❌ Failed to create payment. Please try again.");
    }
  };

  const handleCardChange = (event) => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
    if (event.brand) {
      setCardType(event.brand);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) {
      setError("⚠️ Payment secret is missing.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage("");

    const cardElement = elements.getElement(CardNumberElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: `${orderData.firstName} ${orderData.lastName}`,
        email: orderData.email,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    console.log("Using Client Secret:", clientSecret);
    if (!clientSecret.includes("_secret_")) {
      setError("⚠️ Invalid payment secret format.");
      setLoading(false);
      return;
    }

    try {
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setError(confirmError.message);
      } else if (paymentIntent.status === "succeeded") {
        setMessage("✅ Payment Successful!");
        setDisablePayment(true);
      } else {
        setError("❌ Payment failed. Please try again.");
      }
    } catch (err) {
      setError("❌ An unexpected error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Secure Payment</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="input-group">
          <label>Card Number</label>
          <CardNumberElement className="stripe-input" onChange={handleCardChange} />
          {cardType && <span className={`card-icon ${cardType}`}></span>}
        </div>
        <div className="input-group">
          <label>Expiry Date</label>
          <CardExpiryElement className="stripe-input" onChange={handleCardChange} />
        </div>
        <div className="input-group">
          <label>CVC</label>
          <CardCvcElement className="stripe-input" onChange={handleCardChange} />
        </div>
        <button type="submit" disabled={!stripe || loading || disablePayment} className="checkout-btn">
          {loading ? <span className="spinner"></span> : "Pay"}
        </button>
        {error && <div className="checkout-error">{error}</div>}
        {message && <div className="checkout-success">{message}</div>}
      </form>
    </div>
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
