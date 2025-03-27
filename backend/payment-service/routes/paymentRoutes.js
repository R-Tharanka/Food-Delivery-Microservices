const express = require("express");
const router = express.Router();
const Payment = require("../models/PaymentModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);  // Use Stripe secret key

require("dotenv").config(); // Ensure env variables are loaded

// Process Payment using Stripe
router.post("/process", async (req, res) => {
  try {
    const { orderId, userId, amount, currency, firstName, lastName, email, phone } = req.body;
    
    // Convert amount to the smallest currency unit (e.g., cents)
    const amountInCents = Math.round(parseFloat(amount) * 100);

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency || "usd",
      metadata: { orderId, userId },
      receipt_email: email,
    });

    // Store payment details in your DB
    const payment = new Payment({
      orderId,
      userId,
      amount, // Original amount in dollars (or your base unit)
      currency: currency || "usd",
      status: "Pending",
      stripePaymentIntentId: paymentIntent.id,
    });
    await payment.save();

    // Return the client secret to the frontend so they can complete the payment with Stripe Elements or similar
    res.json({ clientSecret: paymentIntent.client_secret, paymentId: payment._id });
  } catch (error) {
    console.error("Stripe Payment processing error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
