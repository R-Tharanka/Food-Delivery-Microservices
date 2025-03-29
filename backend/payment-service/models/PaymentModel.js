const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },  // Enforce uniqueness for orderId
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "usd" },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  stripePaymentIntentId: { type: String, unique: true },  // Enforce uniqueness for the Stripe PaymentIntent ID
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
