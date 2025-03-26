const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    orderId: { type: String, required: true }, // Order Reference
    userId: { type: String, required: true },  // Customer making the payment
    amount: { type: Number, required: true },  // Payment amount
    currency: { type: String, default: "usd" },
    status: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
