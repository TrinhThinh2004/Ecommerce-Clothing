// backend/src/routes/cart.ts
import { Router } from "express";
import {
  getCartByUser,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cart.controller";
import { authenticateToken } from "../middleware/auth.middleware"; // Import middleware

const router = Router();

// ⭐ Tất cả routes đều cần authenticate
router.use(authenticateToken);

// Lấy giỏ hàng của user hiện tại (từ token)
router.get("/", getCartByUser); // ⭐ Đổi từ /:userId → /

// Thêm sản phẩm vào giỏ
router.post("/", addToCart);

// Cập nhật số lượng
router.patch("/:id", updateCartItem); // ⭐ Đổi PUT → PATCH cho đúng convention

// Xóa sản phẩm khỏi giỏ
router.delete("/:id", removeCartItem);

export default router;