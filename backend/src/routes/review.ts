import { Router } from "express";
import {
  getProductReviews,
  getReviewStats,
  createReview,
  checkUserReview,
  updateReview,
  deleteReview,
  getAllReviews,
  updateReviewStatus,
  deleteReviewAdmin,
} from "../controllers/review.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkAdmin } from "../middleware/checkAdmin.middleware";

const router = Router();

// ===== PUBLIC ROUTES =====
router.get("/products/:productId/reviews", getProductReviews);
router.get("/products/:productId/reviews/stats", getReviewStats);

// ===== USER ROUTES (Authenticated) =====
router.post("/reviews", authenticateToken, createReview);
router.get("/reviews/check/:productId", authenticateToken, checkUserReview);
router.patch("/reviews/:reviewId", authenticateToken, updateReview);
router.delete("/reviews/:reviewId", authenticateToken, deleteReview);

// ===== ADMIN ROUTES =====
router.get("/admin/reviews", authenticateToken, checkAdmin, getAllReviews);
router.patch("/admin/reviews/:reviewId/status", authenticateToken, checkAdmin, updateReviewStatus);
router.delete("/admin/reviews/:reviewId", authenticateToken, checkAdmin, deleteReviewAdmin);

export default router;