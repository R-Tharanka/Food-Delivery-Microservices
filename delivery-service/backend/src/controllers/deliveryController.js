import Delivery from "../models/Delivery.js";
import { geocodeAddress } from "../utils/geocode.js";

export const createDelivery = async (req, res) => {
  try {
    const { orderId, customerId, pickupAddress, deliveryAddress } = req.body;
    const driverId = req.driver;

    if (!orderId || !customerId || !pickupAddress || !deliveryAddress) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const pickupCoords = await geocodeAddress(pickupAddress);
    const deliveryCoords = await geocodeAddress(deliveryAddress);

    const delivery = await Delivery.create({
      driver: driverId,
      orderId,
      customerId,
      pickupAddressString: pickupAddress,
      pickupLocation: { type: "Point", coordinates: pickupCoords },
      deliveryAddressString: deliveryAddress,
      deliveryLocation: { type: "Point", coordinates: deliveryCoords },
      status: "assigned"
    });

    return res.status(201).json({
      success: true,
      message: "Delivery created successfully!",
      delivery: {
        _id: delivery._id,
        orderId: delivery.orderId,
        customerId: delivery.customerId,
        pickupAddress: delivery.pickupAddressString,
        deliveryAddress: delivery.deliveryAddressString,
        status: delivery.status,
        createdAt: delivery.createdAt
      }
    });

  } catch (error) {
    console.error("🚨 Create delivery error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDriverDeliveries = async (req, res) => {
  try {
    const driverId = req.driver;
    const deliveries = await Delivery.find({ driver: driverId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, deliveries });
  } catch (error) {
    console.error("🚨 Get deliveries error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch deliveries" });
  }
};

export const getDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) {
      return res.status(404).json({ success: false, message: "Delivery not found" });
    }

    res.json({
      success: true,
      delivery: {
        _id: delivery._id,
        orderId: delivery.orderId,
        customerId: delivery.customerId,
        pickupAddressString: delivery.pickupAddressString,
        deliveryAddressString: delivery.deliveryAddressString,
        status: delivery.status,
        createdAt: delivery.createdAt
      }
    });
  } catch (error) {
    console.error("🚨 Get delivery error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

// Update Delivery Status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const deliveryId = req.params.id;

    // ✅ Updated to include all valid statuses
    const validStatuses = ["To be delivered", "Picked-up", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ success: false, message: "Delivery not found" });
    }

    // Update status
    delivery.status = status;
    await delivery.save();

    res.json({
      success: true,
      message: `Delivery status updated to '${status}'`,
      delivery
    });

  } catch (error) {
    console.error("🚨 Update delivery status error:", error);
    res.status(500).json({ success: false, message: "Failed to update delivery status" });
  }
};

// New Controller to get Delivery by OrderID
export const getDeliveryByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const delivery = await Delivery.findOne({ orderId });

    if (!delivery) {
      return res.status(404).json({ success: false, message: "Delivery not found by order ID" });
    }

    res.json({
      success: true,
      delivery
    });
  } catch (error) {
    console.error("🚨 Get delivery by order ID error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// Delete Delivery
export const deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ success: false, message: "Delivery not found" });
    }

    if (delivery.status !== "Delivered") {
      return res.status(400).json({ 
        success: false, 
        message: "Only delivered deliveries can be deleted" 
      });
    }

    await Delivery.findByIdAndDelete(req.params.id); // ✅ Correct way!

    res.json({ 
      success: true, 
      message: "Delivery deleted successfully" 
    });

  } catch (error) {
    console.error("🚨 Delete delivery error:", error);
    res.status(500).json({ success: false, message: "Failed to delete delivery" });
  }
};



