// src/routes/admin.routes.ts
import express from "express";
import {
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  toggleCustomerStatus,
  getAllOrders,
  getOrderDetail,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/admin.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkAdmin } from "../middleware/checkAdmin.middleware"; 

const router = express.Router();

// Áp dụng middleware xác thực và kiểm tra admin cho tất cả routes
router.use(authenticateToken);
router.use(checkAdmin);

/* ================= CUSTOMERS ROUTES ================= */
router.get("/customers", getAllCustomers);
router.patch("/customers/:userId", updateCustomer);
router.delete("/customers/:userId", deleteCustomer);
router.patch("/customers/:userId/status", toggleCustomerStatus);

/* ================= ORDERS ROUTES ================= */
router.get("/orders", getAllOrders);
router.get("/orders/:orderId", getOrderDetail);
router.patch("/orders/:orderId/status", updateOrderStatus);
router.delete("/orders/:orderId", deleteOrder);

export default router;