const express = require("express");
const router = express.Router();
const Payment = require("../models/PaymentModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();

// Webhook endpoint (raw body is required)
router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const paymentIntent = event.data.object;
  const orderId = paymentIntent.metadata.orderId;

  try {
    const existingPayment = await Payment.findOne({ orderId });

    if (!existingPayment) {
      console.warn(`⚠️ Payment record for order ${orderId} not found.`);
      return res.status(404).json({ error: "Payment record not found" });
    }

    // Update payment status in database
    if (event.type === "payment_intent.succeeded" && existingPayment.status !== "Paid") {
      existingPayment.status = "Paid";
      await existingPayment.save();
      console.log(`✅ Payment for Order ${orderId} marked as Paid.`);
    } else if (event.type === "payment_intent.payment_failed" && existingPayment.status !== "Failed") {
      existingPayment.status = "Failed";
      await existingPayment.save();
      console.log(`❌ Payment for Order ${orderId} marked as Failed.`);
    } else {
      console.log(`ℹ️ Payment status for Order ${orderId} is already updated. Ignoring duplicate webhook.`);
    }
  } catch (err) {
    console.error("❌ Error updating payment status in DB:", err.message);
    return res.status(500).json({ error: "Database update failed" });
  }

  res.json({ received: true });
});

module.exports = router;
