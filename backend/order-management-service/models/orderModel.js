import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        customerId: { type: String, required: true }, // Change to String to allow manual input
        restaurantId: { type: String, required: true }, // Change to String for manual input
        items: [
            {
                foodId: { type: String, required: true }, // Change to String for manual input
                quantity: { type: Number, required: true },
                price: { type: Number, required: true }
            }
        ],
        totalPrice: { type: Number, required: true },
        paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Canceled"],
            default: "Pending"
        },
        deliveryAddress: { type: String, required: true }
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;