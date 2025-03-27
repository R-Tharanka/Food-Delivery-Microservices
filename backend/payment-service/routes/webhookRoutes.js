const express = require("express");
const router = express.Router();
const Payment = require("../models/PaymentModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

require("dotenv").config();

// Use express.raw middleware for the webhook endpoint
router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  
  try {
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event types you care about
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    await Payment.findOneAndUpdate({ orderId }, { status: "Paid" });
    console.log(`✅ Payment for Order ${orderId} succeeded.`);
  } else if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    await Payment.findOneAndUpdate({ orderId }, { status: "Failed" });
    console.log(`❌ Payment for Order ${orderId} failed.`);
  }
  
  res.json({ received: true });
});

module.exports = router;
