import express from "express"
import {
    addOrderItems,
    getMyOrders,
    getOrderByID,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
    getAllOrders,
    deleteOrder
} from '../controllers/orderControllers.js';
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addOrderItems);
router.get("/", protect, admin, getOrders);

router.get("/mine", protect, getMyOrders);
router.get("/all", protect, admin, getAllOrders)
router.get("/:id", protect, getOrderByID);
router.put("/:id/pay", protect, updateOrderToPaid);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered)
router.delete("/:id", protect, admin, deleteOrder)

export default router;