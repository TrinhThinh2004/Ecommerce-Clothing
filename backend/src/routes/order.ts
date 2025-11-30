import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  
} from "../controllers/order.controller";
import { authenticateToken } from "../middleware/auth.middleware"; 

const router = express.Router();

router.post("/", authenticateToken, createOrder);
router.get("/", authenticateToken, getAllOrders);

router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;
