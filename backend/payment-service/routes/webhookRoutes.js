const express = require("express");
const router = express.Router();
const Payment = require("../models/PaymentModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { sendSmsNotification } = require("../utils/twilioService");
const { sendEmailNotification } = require("../utils/emailService"); // Import the email service
require("dotenv").config();

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
    console.log("Webhook received");
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
    } else {
        console.log(`Unhandled event type: ${event.type}`);
        return res.json({ received: true });
    }

    // Extract orderId from metadata
    const orderId = event.data.object.metadata?.orderId;
    if (!orderId) {
        console.warn(`⚠️ Missing orderId in metadata for PaymentIntent ${paymentIntentId}`);
    }
    console.log(`🛠 Extracted orderId: ${orderId || "UNKNOWN_ORDER"}`);

    try {
        let payment = null;

        if (orderId) {
            payment = await Payment.findOne({ orderId });
        }
        if (!payment) {
            payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
        }
        if (!payment) {
            console.warn(`⚠️ No payment record found for orderId: ${orderId} or PaymentIntent: ${paymentIntentId}`);
            return res.status(404).json({ error: "Payment record not found" });
        }
        console.log(`Found payment record for order ${payment.orderId}, current status: ${payment.status}`);

        const customerPhone = payment.phone;
        const customerEmail = payment.email; // Ensure your Payment model includes an email field (if not, add it)

        if (!customerPhone) {
            console.warn(`⚠️ No phone number associated with Order ${payment.orderId}`);
        }

        if (event.type === "payment_intent.succeeded" && payment.status !== "Paid") {
            payment.status = "Paid";
            await payment.save();
            console.log(`✅ Payment for Order ${payment.orderId} updated to Paid.`);

            // Send SMS notification (if phone exists)
            if (customerPhone) {
                const smsMessage = `Your payment for Order ${payment.orderId} was successful!`;
                try {
                    await sendSmsNotification(customerPhone, smsMessage);
                } catch (smsError) {
                    console.error(`❌ Twilio SMS error: ${smsError.message}`);
                }
            }

            // Send Email notification (if email exists)
            if (customerEmail) {
                const emailSubject = "Payment Confirmation for Your Order";
                const emailHtml = ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                                        <h2 style="color: #333;">Payment Confirmation</h2>

                                        <p style="color: #555; font-size: 16px;">Dear Customer,</p>

                                        <p style="color: #555; font-size: 16px;">
                                            We’re happy to let you know that your payment for <strong style="color: #333;">Order #${payment.orderId}</strong> was successfully processed.
                                        </p>

                                        <div style="margin: 24px 0; padding: 16px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 6px;">
                                            <p style="margin: 0; font-size: 16px;"><strong>Amount:</strong> $${payment.amount.toFixed(2)} ${payment.currency?.toUpperCase()}</p>
                                            <p style="margin: 0; font-size: 16px;"><strong>Status:</strong> ${payment.status}</p>
                                            <p style="margin: 0; font-size: 16px;"><strong>Date:</strong> ${new Date(payment.createdAt).toLocaleString()}</p>
                                        </div>

                                        <p style="color: #555; font-size: 16px;">Thank you for choosing our service. If you have any questions, feel free to reply to this email.</p>

                                        <p style="margin-top: 32px; color: #888; font-size: 14px;">— SkyDish Food Delivery Team</p>
                                    </div>
                                    `;
                const emailText = `Dear Customer, Your payment for Order ${payment.orderId} was successful! Thank you for your order.`;
                try {
                    await sendEmailNotification(customerEmail, emailSubject, emailHtml, emailText);
                } catch (emailError) {
                    console.error(`❌ Email sending error: ${emailError.message}`);
                }
            }
        } else if (event.type === "payment_intent.payment_failed" && payment.status !== "Failed") {
            payment.status = "Failed";
            await payment.save();
            console.log(`❌ Payment for Order ${payment.orderId} updated to Failed.`);

            if (customerPhone) {
                const smsMessage = `Your payment for Order ${payment.orderId} failed. Please try again. ❌`;
                try {
                    await sendSmsNotification(customerPhone, smsMessage);
                } catch (smsError) {
                    console.error(`❌ Twilio SMS error: ${smsError.message}`);
                }
            }

            if (customerEmail) {
                const emailSubject = "Payment Failure for Your Order";
                const emailHtml = `<p>Dear Customer,</p>
                           <p>Unfortunately, your payment for Order <strong>${payment.orderId}</strong> failed. Please try again.</p>`;
                const emailText = `Dear Customer, your payment for Order ${payment.orderId} failed. Please try again.`;
                try {
                    await sendEmailNotification(customerEmail, emailSubject, emailHtml, emailText);
                } catch (emailError) {
                    console.error(`❌ Email sending error: ${emailError.message}`);
                }
            }
        } else {
            console.log(`Payment for Order ${payment.orderId} already updated to ${payment.status}.`);
        }
    } catch (err) {
        console.error("❌ Error updating payment status in DB:", err.message);
        return res.status(500).json({ error: "Database update failed" });
    }

    res.json({ received: true });
});

module.exports = router;