import Delivery from "../models/Delivery.js";
import Driver from "../models/Driver.js";

export const assignDriver = async (orderId) => {
  const availableDriver = await Driver.findOne({ available: true });

  if (!availableDriver) {
    return { message: "No drivers available" };
  }

  const delivery = await Delivery.findOneAndUpdate(
    { orderId },
    { driverId: availableDriver._id, status: "Assigned" },
    { new: true }
  );

  availableDriver.available = false;
  await availableDriver.save();

  return delivery;
};
