// backend/src/routes/cart.ts
import { Router } from "express";
import {
  getCartByUser,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller";
import { authenticateToken } from "../middleware/auth.middleware"; // Import middleware

const router = Router();

// routes đều cần authenticate
router.use(authenticateToken);

// Lấy giỏ hàng của user hiện tại (từ token)
router.get("/", getCartByUser); // 
// Thêm sản phẩm vào giỏ
router.post("/", addToCart);

// Cập nhật số lượng
router.patch("/:id", updateCartItem); 

// Xóa sản phẩm khỏi giỏ
router.delete("/:id", removeCartItem);
router.delete("/",  clearCart);
export default router;