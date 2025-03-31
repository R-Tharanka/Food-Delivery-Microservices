import express from "express";
import { assignDriver } from "../services/deliveryService.js";

const router = express.Router();

router.post("/assign/:orderId", async (req, res) => {
  try {
    const result = await assignDriver(req.params.orderId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error assigning driver", error });
  }
});

export default router;
