import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Transit", "Delivered"],
      default: "Pending",
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    estimatedTime: {
      type: Number, // In minutes
      default: 30,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Delivery", deliverySchema);
