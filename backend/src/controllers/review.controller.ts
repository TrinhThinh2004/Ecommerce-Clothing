import { Request, Response } from "express";
import Review from "../models/Review";
import User from "../models/User";
import Product from "../models/Product";

// PUBLIC: Get approved reviews for a product
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.findAll({
      where: { product_id: productId, status: "approved" },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Không thể tải đánh giá",
      error: error.message,
    });
  }
};

// PUBLIC: Get review statistics
export const getReviewStats = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.findAll({
      where: { product_id: productId, status: "approved" },
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Không thể tải thống kê",
      error: error.message,
    });
  }
};

// USER: Create a review
export const createReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.user_id;
    const { product_id, rating, comment } = req.body;

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

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      where: { user_id: userId, product_id },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đánh giá sản phẩm này rồi",
      });
    }

    // Create review
    const newReview = await Review.create({
      product_id,
      user_id: userId,
      rating,
      comment,
      status: "pending",
    });

    const reviewWithUser = await Review.findByPk(newReview.review_id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Đã gửi đánh giá. Đang chờ duyệt!",
      data: reviewWithUser,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Không thể tạo đánh giá",
      error: error.message,
    });
  }
};

// USER: Check if user has reviewed a product
export const checkUserReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.user_id;
    const { productId } = req.params;

    const review = await Review.findOne({
      where: { user_id: userId, product_id: productId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username"],
        },
      ],
    });

    res.json({ success: true, data: review });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Không thể kiểm tra đánh giá",
      error: error.message,
    });
  }
};

// USER: Update own review
export const updateReview = async (req: Request, res: Response) => {
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

    if (review.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền chỉnh sửa đánh giá này",
      });
    }

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

    review.status = "pending";
    await review.save();

    const updatedReview = await Review.findByPk(reviewId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "username"],
        },
      ],
    });

    res.json({
      success: true,
      message: "Đã cập nhật đánh giá",
      data: updatedReview,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật đánh giá",
      error: error.message,
    });
  }
};

// USER: Delete own review
export const deleteReview = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Không thể xóa đánh giá",
      error: error.message,
    });
  }
};

// ADMIN: Get all reviews
export const getAllReviews = async (req: Request, res: Response) => {
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

    res.json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Không thể tải danh sách đánh giá",
      error: error.message,
    });
  }
};

// ADMIN: Update review status
export const updateReviewStatus = async (req: Request, res: Response) => {
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
        {
          model: Product,
          as: "product",
          attributes: ["product_id", "name", "image_url"],
        },
      ],
    });

    res.json({
      success: true,
      message: `Đã ${status === "approved" ? "duyệt" : "từ chối"} đánh giá`,
      data: updatedReview,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật trạng thái",
      error: error.message,
    });
  }
};

// ADMIN: Delete review
export const deleteReviewAdmin = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Không thể xóa đánh giá",
      error: error.message,
    });
  }
};
