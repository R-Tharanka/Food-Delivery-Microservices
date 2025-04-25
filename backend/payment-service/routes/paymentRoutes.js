const express = require("express");
const router = express.Router();
const Payment = require("../models/PaymentModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();

// Process Payment using Stripe
router.post("/process", async (req, res) => {
  try {
    const { orderId, userId, amount, currency, firstName, lastName, email, phone } = req.body;

    // Check if payment for this order already exists
    let existingPayment = await Payment.findOne({ orderId });

    if (existingPayment) {
      if (existingPayment.status === "Pending") {
        // If a pending payment exists, return its clientSecret
        return res.json({ clientSecret: existingPayment.stripePaymentIntentId, paymentId: existingPayment._id });
      } else {
        return res.status(400).json({ error: "Payment for this order has already been processed." });
      }
    }

    // Convert amount to the smallest currency unit (e.g., cents)
    const amountInCents = Math.round(parseFloat(amount) * 100);

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency || "usd",
      metadata: { orderId, userId },
      receipt_email: email,
    });

    // Store payment details in the database
    const payment = new Payment({
      orderId,
      userId,
      amount,
      currency: currency || "usd",
      status: "Pending",
      stripePaymentIntentId: paymentIntent.client_secret, // Store client_secret instead of paymentIntent.id
    });
    await payment.save();

    // Return the client secret to the frontend for completion
    res.json({ clientSecret: paymentIntent.client_secret, paymentId: payment._id });
  } catch (error) {
    console.error("Stripe Payment processing error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
