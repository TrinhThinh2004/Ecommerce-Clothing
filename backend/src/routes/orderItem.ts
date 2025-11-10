import  Express  from "express";
import {
  getAllOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem,
} from "../controllers/orderItem.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Express.Router(); 
  // tất cả routes đều cần authenticate
  router.use(authenticateToken);
    // Lấy tất cả order items 
    router.get("/",authenticateToken, getAllOrderItems);

    // Lấy 1 order item theo ID
    router.get("/:id",authenticateToken ,getOrderItemById);
    // Cập nhật order item 
    router.patch("/:id",authenticateToken, updateOrderItem);

    // Xóa order item
    router.delete("/:id",authenticateToken, deleteOrderItem);
export default router;