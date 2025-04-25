const express = require("express");
const router = express.Router();
const Payment = require("../models/PaymentModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();
const { sendSmsNotification } = require("../utils/twilioService"); // Import Twilio service

router.post("/process", async (req, res) => {
  try {
    const { orderId, userId, amount, currency, email, phone } = req.body; // Use `phone` instead of `phoneNumber`

    // Validate required fields
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required." });
    }

    console.log(`⏳ Processing payment request for order ${orderId}`);

    // Check if a payment record already exists for this order.
    let payment = await Payment.findOne({ orderId });
    if (payment && payment.stripeClientSecret) {
      console.log("🔍 Existing Payment Found:", payment);
      if (payment.status === "Paid") {
        return res.status(200).json({
          message: "✅ This order has already been paid successfully.",
          paymentStatus: "Paid",
          disablePayment: true,
        });
      }
      // Return the existing client secret for a pending payment.
      return res.json({
        clientSecret: payment.stripeClientSecret,
        paymentId: payment._id,
        disablePayment: false,
      });
    }

    // Create a new PaymentIntent.
    const amountInCents = Math.round(parseFloat(amount) * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency || "usd",
      metadata: { orderId, userId },
      receipt_email: email,
    });
    console.log("✅ Created PaymentIntent:", paymentIntent);

    // Create a new Payment record.
    payment = new Payment({
      orderId,
      userId,
      amount,
      currency: currency || "usd",
      status: "Pending",
      stripePaymentIntentId: paymentIntent.id, // store only the id (without secret)
      stripeClientSecret: paymentIntent.client_secret, // store client secret for frontend
      phone, // Use `phone` to match the schema
      email,
    });
    await payment.save();
    console.log("💾 Stored Payment Record:", payment);

    // Send SMS notification
    // const message = `Your payment of $${orderId} has been processed successfully.`;
    // await sendSmsNotification(phone, message);

    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
      disablePayment: false,
    });
  } catch (error) {
    // If duplicate key error occurs, recover gracefully.
    if (error.code === 11000) {
      let existingPayment = await Payment.findOne({ orderId: req.body.orderId });
      if (existingPayment) {
        console.log("⚠️ Duplicate detected; returning existing payment:", existingPayment);
        if (existingPayment.status === "Paid") {
          return res.status(200).json({
            message: "✅ This order has already been paid successfully.",
            paymentStatus: "Paid",
            disablePayment: true,
          });
        }
        return res.json({
          clientSecret: existingPayment.stripeClientSecret,
          paymentId: existingPayment._id,
          disablePayment: false,
        });
      }
      return res.status(500).json({ error: "Duplicate key error but no payment record found." });
    }
    console.error("❌ Stripe Payment processing error:", error.message);
    res.status(500).json({ error: "❌ Payment processing failed. Please try again." });
  }
});

module.exports = router;
