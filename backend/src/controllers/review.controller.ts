// src/routes/reviews.ts
import { Router, Request, Response } from "express";
import Review from "../models/Review";
import User from "../models/User";
import Product from "../models/Product";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkAdmin } from "../middleware/checkAdmin.middleware";
import { Op } from "sequelize";

const router = Router();

// =====================================================
// PUBLIC ROUTES - Không cần đăng nhập
// =====================================================

/**
 * GET /api/v1/products/:productId/reviews
 * Lấy tất cả reviews đã duyệt của một sản phẩm
 */
router.get("/products/:productId/reviews", async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.findAll({
      where: {
        product_id: productId,
        status: "approved",
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tải đánh giá",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/v1/products/:productId/reviews/stats
 * Lấy thống kê đánh giá của sản phẩm
 */
router.get("/products/:productId/reviews/stats", async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.findAll({
      where: {
        product_id: productId,
        status: "approved",
      },
      attributes: ["rating"],
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    const ratingDistribution = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    res.json({
      success: true,
      data: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error("Error fetching review stats:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tải thống kê đánh giá",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// =====================================================
// PROTECTED ROUTES - Cần đăng nhập
// =====================================================

/**
 * POST /api/v1/reviews
 * Tạo đánh giá mới
 */
router.post("/reviews", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.user_id;
    const { product_id, rating, comment } = req.body;

    // Validate input
    if (!product_id || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Đánh giá phải từ 1 đến 5 sao",
      });
    }

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    // Kiểm tra user đã review chưa
    const existingReview = await Review.findOne({
      where: {
        user_id: userId,
        product_id,
      },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đánh giá sản phẩm này rồi",
      });
    }

    // Tạo review mới
    const newReview = await Review.create({
      product_id,
      user_id: userId,
      rating,
      comment,
      status: "pending",
    });

    // Load user data
    const reviewWithUser = await Review.findByPk(newReview.review_id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username", "email"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Đã gửi đánh giá. Đang chờ duyệt!",
      data: reviewWithUser,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tạo đánh giá",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/v1/reviews/check/:productId
 * Kiểm tra user đã review sản phẩm này chưa
 */
router.get("/reviews/check/:productId", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.user_id;
    const { productId } = req.params;

    const review = await Review.findOne({
      where: {
        user_id: userId,
        product_id: productId,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username", "email"],
        },
      ],
    });

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Error checking user review:", error);
    res.status(500).json({
      success: false,
      message: "Không thể kiểm tra đánh giá",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * PATCH /api/v1/reviews/:reviewId
 * Cập nhật đánh giá của mình
 */
router.patch("/reviews/:reviewId", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.user_id;
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá",
      });
    }

    // Kiểm tra quyền sở hữu
    if (review.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền chỉnh sửa đánh giá này",
      });
    }

    // Update
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Đánh giá phải từ 1 đến 5 sao",
        });
      }
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    // Reset status về pending khi sửa
    review.status = "pending";
    await review.save();

    const updatedReview = await Review.findByPk(reviewId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username", "email"],
        },
      ],
    });

    res.json({
      success: true,
      message: "Đã cập nhật đánh giá",
      data: updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật đánh giá",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * DELETE /api/v1/reviews/:reviewId
 * Xóa đánh giá của mình
 */
router.delete("/reviews/:reviewId", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.user_id;
    const { reviewId } = req.params;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá",
      });
    }

    // Kiểm tra quyền sở hữu
    if (review.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa đánh giá này",
      });
    }

    await review.destroy();

    res.json({
      success: true,
      message: "Đã xóa đánh giá",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Không thể xóa đánh giá",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// =====================================================
// ADMIN ROUTES - Cần quyền admin
// =====================================================

/**
 * GET /api/v1/admin/reviews
 * Lấy tất cả đánh giá (admin only)
 */
router.get("/admin/reviews", authenticateToken, checkAdmin, async (req: Request, res: Response) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username", "email"],
        },
        {
          model: Product,
          as: "product",
          attributes: ["product_id", "name", "image_url"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tải danh sách đánh giá",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * PATCH /api/v1/admin/reviews/:reviewId/status
 * Cập nhật trạng thái đánh giá (admin only)
 */
router.patch(
  "/admin/reviews/:reviewId/status",
  authenticateToken,
  checkAdmin,
  async (req: Request, res: Response) => {
    try {
      const { reviewId } = req.params;
      const { status } = req.body;

      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Trạng thái không hợp lệ",
        });
      }

      const review = await Review.findByPk(reviewId);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đánh giá",
        });
      }

      review.status = status;
      await review.save();

      const updatedReview = await Review.findByPk(reviewId, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["user_id", "username", "email"],
          },
        ],
      });

      res.json({
        success: true,
        message: `Đã ${status === "approved" ? "duyệt" : "từ chối"} đánh giá`,
        data: updatedReview,
      });
    } catch (error) {
      console.error("Error updating review status:", error);
      res.status(500).json({
        success: false,
        message: "Không thể cập nhật trạng thái",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

/**
 * DELETE /api/v1/admin/reviews/:reviewId
 * Xóa đánh giá (admin only)
 */
router.delete(
  "/admin/reviews/:reviewId",
  authenticateToken,
  checkAdmin,
  async (req: Request, res: Response) => {
    try {
      const { reviewId } = req.params;

      const review = await Review.findByPk(reviewId);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đánh giá",
        });
      }

      await review.destroy();

      res.json({
        success: true,
        message: "Đã xóa đánh giá",
      });
    } catch (error) {
      console.error("Error deleting review (admin):", error);
      res.status(500).json({
        success: false,
        message: "Không thể xóa đánh giá",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export default router;