const express = require("express");
const router = express.Router();
const Payment = require("../models/PaymentModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { sendSmsNotification } = require("../utils/twilioService"); // Import Twilio service
require("dotenv").config();

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  console.log("🔔 Webhook received");
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log("✅ Webhook event verified:", event.type);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  let paymentIntentId = null;
  if (event.type === "payment_intent.succeeded" || event.type === "payment_intent.payment_failed") {
    paymentIntentId = event.data.object.id;
  } else if (event.type === "charge.succeeded") {
    paymentIntentId = event.data.object.payment_intent;
  } else {
    console.log(`ℹ️ Unhandled event type: ${event.type}`);
    return res.json({ received: true });
  }

  try {
    let payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!payment) {
      console.warn(`⚠️ Payment record for PaymentIntent ${paymentIntentId} not found.`);
      return res.status(404).json({ error: "Payment record not found" });
    }
    console.log(`ℹ️ Found payment record for order ${payment.orderId}, current status: ${payment.status}`);

    // Update payment status and send SMS notification
    if ((event.type === "payment_intent.succeeded" || event.type === "charge.succeeded") && payment.status !== "Paid") {
      payment.status = "Paid";
      await payment.save();
      console.log(`✅ Payment for Order ${payment.orderId} updated to Paid.`);

      // Send SMS notification
      const customerPhone = payment.phone; // Corrected field name
      const message = `Your payment for Order ${payment.orderId} was successful! ✅`;
      await sendSmsNotification(customerPhone, message);
    } else if (event.type === "payment_intent.payment_failed" && payment.status !== "Failed") {
      payment.status = "Failed";
      await payment.save();
      console.log(`❌ Payment for Order ${payment.orderId} updated to Failed.`);

      // Send failure SMS
      const customerPhone = payment.phone; // Corrected field name
      const message = `Your payment for Order ${payment.orderId} failed. Please try again. ❌`;
      await sendSmsNotification(customerPhone, message);
    } else {
      console.log(`ℹ️ Payment for Order ${payment.orderId} already updated to ${payment.status}.`);
    }
  } catch (err) {
    console.error("❌ Error updating payment status in DB:", err.message);
    return res.status(500).json({ error: "Database update failed" });
  }
  
  res.json({ received: true });
});

module.exports = router;
