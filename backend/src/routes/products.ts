import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
} from "../controllers/products.controller";
import upload from "../middleware/upload.middleware";

const router = Router();

// ✅ Route để lấy tất cả sản phẩm (chuẩn RESTful)
router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/:id", getProductById);
router.post("/", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
