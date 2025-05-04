import express from "express";
import { createDelivery, getDriverDeliveries ,getDelivery,updateDeliveryStatus,deleteDelivery,getDeliveryByOrderId} from "../controllers/deliveryController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/create", authMiddleware, createDelivery);
router.get("/", authMiddleware, getDriverDeliveries);
router.get("/:id", authMiddleware, getDelivery);
router.put("/:id/status", authMiddleware, updateDeliveryStatus);
router.delete("/:id", authMiddleware, deleteDelivery); 
router.get("/order/:orderId", authMiddleware, getDeliveryByOrderId);

export default router;
