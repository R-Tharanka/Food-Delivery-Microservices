import express from "express";
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    updateOrderDetails
} from "../controllers/orderController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only customers can place orders
router.post("/", protect, authorizeRoles("customer"), createOrder);

// Only restaurant admins & customers can view orders
router.get("/", protect, authorizeRoles("customer", "restaurant"), getOrders);
router.get("/:id", protect, authorizeRoles("customer", "restaurant"), getOrderById);

// Only authenticated customers can update their own orders
router.patch("/:id", protect, updateOrderDetails);

// Only restaurant admins can update order status
router.patch("/:id", protect, authorizeRoles("restaurant"), updateOrderStatus);

// Only customers can cancel orders
router.delete("/:id", protect, authorizeRoles("customer"), cancelOrder);

export default router;
