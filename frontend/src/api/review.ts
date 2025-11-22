// src/api/reviews.ts
import axiosInstance from "./client";

/* ================= Types ================= */
export interface Review {
  review_id: number;
  product_id: number;
  user_id: number;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  user?: {
    user_id: number;
    username: string;
    email: string;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

const getToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

/* ================= PUBLIC API ================= */

/**
 * Lấy tất cả đánh giá đã được duyệt của một sản phẩm
 */
export const fetchProductReviews = async (
  productId: number
): Promise<Review[]> => {
  try {
    const res = await axiosInstance.get(
      `/api/v1/products/${productId}/reviews`
    );
    return res.data.data || [];
  } catch (err) {
    console.error("fetchProductReviews error:", err);
    return [];
  }
};

/**
 * Lấy thống kê đánh giá của sản phẩm
 */
export const fetchReviewStats = async (
  productId: number
): Promise<ReviewStats> => {
  try {
    const res = await axiosInstance.get(
      `/api/v1/products/${productId}/reviews/stats`
    );
    return res.data.data || {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  } catch (err) {
    console.error("fetchReviewStats error:", err);
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }
};

/**
 * Tạo đánh giá mới (yêu cầu đăng nhập)
 */
export const createReview = async (data: {
  product_id: number;
  rating: number;
  comment: string;
}): Promise<Review | null> => {
  try {
    const token = getToken();
    if (!token) throw new Error("Chưa đăng nhập");

    const res = await axiosInstance.post("/api/v1/reviews", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  } catch (err) {
    console.error("createReview error:", err);
    throw err;
  }
};

/**
 * Cập nhật đánh giá của mình
 */
export const updateReview = async (
  reviewId: number,
  data: {
    rating?: number;
    comment?: string;
  }
): Promise<Review | null> => {
  try {
    const token = getToken();
    if (!token) throw new Error("Chưa đăng nhập");

    const res = await axiosInstance.patch(`/api/v1/reviews/${reviewId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  } catch (err) {
    console.error("updateReview error:", err);
    throw err;
  }
};

/**
 * Xóa đánh giá của mình
 */
export const deleteReview = async (reviewId: number): Promise<boolean> => {
  try {
    const token = getToken();
    if (!token) throw new Error("Chưa đăng nhập");

    await axiosInstance.delete(`/api/v1/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (err) {
    console.error("deleteReview error:", err);
    return false;
  }
};

/**
 * Kiểm tra xem user đã đánh giá sản phẩm này chưa
 */
export const checkUserReview = async (
  productId: number
): Promise<Review | null> => {
  try {
    const token = getToken();
    if (!token) return null;

    const res = await axiosInstance.get(
      `/api/v1/reviews/check/${productId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data.data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null;
  }
};

/* ================= ADMIN API ================= */

/**
 * Lấy tất cả đánh giá (admin only)
 */
export const fetchAllReviews = async (): Promise<Review[]> => {
  try {
    const token = getToken();
    if (!token) throw new Error("Chưa đăng nhập");

    const res = await axiosInstance.get("/api/v1/admin/reviews", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data || [];
  } catch (err) {
    console.error("fetchAllReviews error:", err);
    throw err;
  }
};

/**
 * Cập nhật trạng thái đánh giá (admin only)
 */
export const updateReviewStatus = async (
  reviewId: number,
  status: "approved" | "rejected"
): Promise<boolean> => {
  try {
    const token = getToken();
    if (!token) throw new Error("Chưa đăng nhập");

    await axiosInstance.patch(
      `/api/v1/admin/reviews/${reviewId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return true;
  } catch (err) {
    console.error("updateReviewStatus error:", err);
    return false;
  }
};

/**
 * Xóa đánh giá (admin only)
 */
export const deleteReviewAdmin = async (reviewId: number): Promise<boolean> => {
  try {
    const token = getToken();
    if (!token) throw new Error("Chưa đăng nhập");

    await axiosInstance.delete(`/api/v1/admin/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (err) {
    console.error("deleteReviewAdmin error:", err);
    return false;
  }
};