const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },      // Order Reference
  userId: { type: String, required: true },       // Customer making the payment
  amount: { type: Number, required: true },       // Payment amount (in your base currency, e.g., dollars)
  currency: { type: String, default: "usd" },       // Stripe default currency (change as needed)
  status: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  stripePaymentIntentId: { type: String },          // To store Stripe’s PaymentIntent ID
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
