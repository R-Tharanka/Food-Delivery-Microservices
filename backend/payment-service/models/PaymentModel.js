const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // Unique per order
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "usd" },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  // Save the PaymentIntent id (e.g. "pi_3R9OXlD3879aJGnP0xfO1oMm")
  stripePaymentIntentId: { type: String, unique: true, sparse: true },
  // Also save the client secret (e.g. "pi_3R9OXlD3879aJGnP0xfO1oMm_secret_...")
  stripeClientSecret: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update updatedAt on save.
PaymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Payment", PaymentSchema);
