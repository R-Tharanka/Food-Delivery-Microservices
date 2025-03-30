const express = require("express");
const axios = require("axios");
const router = express.Router();
const Payment = require("../models/PaymentModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();

router.post("/process", async (req, res) => {
  try {
    const { orderId, userId, amount, currency, email } = req.body;

    // Atomically find a payment record or create one with stripePaymentIntentId set to null.
    let payment = await Payment.findOneAndUpdate(
      { orderId },
      {
        $setOnInsert: {
          orderId,
          userId,
          amount,
          currency: currency || "usd",
          status: "Pending",
          stripePaymentIntentId: null,
        },
      },
      { new: true, upsert: true }
    );

    // If the payment record already has a client secret, then a PaymentIntent was already created.
    if (payment.stripePaymentIntentId) {
      console.log("Existing Payment Found:", payment);
      if (payment.status === "Paid") {
        return res.status(200).json({
          message: "✅ This order has already been paid successfully.",
          paymentStatus: "Paid",
          disablePayment: true,
        });
      } else {
        // Pending payment: return the existing client secret.
        return res.json({
          clientSecret: payment.stripePaymentIntentId,
          paymentId: payment._id,
          disablePayment: false,
        });
      }
    }

    // Otherwise, no PaymentIntent exists—create a new one.
    const amountInCents = Math.round(parseFloat(amount) * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency || "usd",
      metadata: { orderId, userId },
      receipt_email: email,
    });
    console.log("Created PaymentIntent:", paymentIntent);

    // Update the payment record with the PaymentIntent client secret.
    payment.stripePaymentIntentId = paymentIntent.client_secret;
    await payment.save();
    console.log("Stored Client Secret:", payment.stripePaymentIntentId);

    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
      disablePayment: false,
    });
  } catch (error) {
    console.error("❌ Stripe Payment processing error:", error.message);
    res.status(500).json({ error: "❌ Payment processing failed. Please try again." });
  }
});

module.exports = router;
