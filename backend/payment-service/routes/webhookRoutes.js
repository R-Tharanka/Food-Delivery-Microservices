const express = require("express");
const router = express.Router();
const Payment = require("../models/PaymentModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { sendSmsNotification } = require("../utils/twilioService");
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

    console.log("🔍 Full webhook event data:", JSON.stringify(event, null, 2));

    // Extract orderId from metadata
    const orderId = event.data.object.metadata?.orderId;
    if (!orderId) {
        console.warn(`⚠️ Missing orderId in metadata for PaymentIntent ${paymentIntentId}`);
    }
    console.log(`🛠 Extracted orderId: ${orderId || "UNKNOWN_ORDER"}`);

    try {
        let payment = null;

        // If orderId exists, prioritize searching by it
        if (orderId) {
            payment = await Payment.findOne({ orderId });
        }
        // If no payment found, fallback to paymentIntentId
        if (!payment) {
            payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
        }

        if (!payment) {
            console.warn(`⚠️ No payment record found for orderId: ${orderId} or PaymentIntent: ${paymentIntentId}`);
            return res.status(404).json({ error: "Payment record not found" });
        }

        console.log(`ℹ️ Found payment record for order ${payment.orderId}, current status: ${payment.status}`);

        const customerPhone = payment.phone; // Ensure phone exists in the model
        if (!customerPhone) {
            console.warn(`⚠️ No phone number associated with Order ${payment.orderId}`);
        }

        // Update payment status and send SMS notification
        if ((event.type === "payment_intent.succeeded" || event.type === "charge.succeeded") && payment.status !== "Paid") {
            payment.status = "Paid";
            await payment.save();
            console.log(`✅ Payment for Order ${payment.orderId} updated to Paid.`);

            if (customerPhone) {
              //msg
                const message = `Your payment for Order ${payment.orderId} was successful!`;
                try {
                    await sendSmsNotification(customerPhone, message);
                } catch (smsError) {
                    console.error(`❌ Twilio SMS error: ${smsError.message}`);
                }
            }

        } else if (event.type === "payment_intent.payment_failed" && payment.status !== "Failed") {
            payment.status = "Failed";
            await payment.save();
            console.log(`❌ Payment for Order ${payment.orderId} updated to Failed.`);

            if (customerPhone) {
                const message = `Your payment for Order ${payment.orderId} failed. Please try again. ❌`;
                try {
                    await sendSmsNotification(customerPhone, message);
                } catch (smsError) {
                    console.error(`❌ Twilio SMS error: ${smsError.message}`);
                }
            }

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
