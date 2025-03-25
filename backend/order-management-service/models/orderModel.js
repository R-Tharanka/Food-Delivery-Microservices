import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
        restaurantId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Restaurant" },
        items: [
            {
                foodId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "FoodItem" },
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
