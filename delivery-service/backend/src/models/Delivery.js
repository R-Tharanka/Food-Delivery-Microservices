import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  customerId: {
    type: String,
    required: true
  },
  // Store the human-readable address separately
  pickupAddressString: {
    type: String,
    required: true
  },
  // GeoJSON format for location (must be exactly this structure)
  pickupLocation: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  deliveryAddressString: {
    type: String,
    required: true
  },
  deliveryLocation: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  status: {
    type: String,
    enum: ["assigned", "Picked-up", "To be delivered","Delivered"],
    default: "assigned"
  }
}, { timestamps: true });

// Create the geospatial index on the proper GeoJSON field
deliverySchema.index({ "pickupLocation": "2dsphere" });

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;