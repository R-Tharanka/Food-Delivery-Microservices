const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // Unique orderId
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "usd" },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  // We store the Stripe PaymentIntent client secret here.
  stripePaymentIntentId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
