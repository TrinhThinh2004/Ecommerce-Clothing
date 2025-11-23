import { useEffect, useState } from "react";
import { Star, Check, X, Trash2, Eye, Filter } from "lucide-react";
import { toast } from "react-toastify";
import AdminLayout from "../_Components/AdminLayout";
import {
  fetchAllReviews,
  updateReviewStatus,
  deleteReviewAdmin,
  type Review,
} from "../../../api/review";

type FilterStatus = "all" | "pending" | "approved" | "rejected";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    applyFilter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, reviews]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchAllReviews();
      setReviews(data);
    } catch (err) {
      console.error("Error loading reviews:", err);
      toast.error("Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (filter === "all") {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter((r) => r.status === filter));
    }
  };

  const handleApprove = async (reviewId: number) => {
    try {
      const success = await updateReviewStatus(reviewId, "approved");
      if (success) {
        toast.success(" Đã duyệt đánh giá");
        loadReviews();
      }
    } catch (err) {
      console.error("Error approving review:", err);
      toast.error(" Không thể duyệt đánh giá");
    }
  };

  const handleReject = async (reviewId: number) => {
    try {
      const success = await updateReviewStatus(reviewId, "rejected");
      if (success) {
        toast.success(" Đã từ chối đánh giá");
        loadReviews();
      }
    } catch (err) {
      console.error("Error rejecting review:", err);
      toast.error(" Không thể từ chối đánh giá");
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;

    try {
      const success = await deleteReviewAdmin(reviewId);
      if (success) {
        toast.success(" Đã xóa đánh giá");
        loadReviews();
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error(" Không thể xóa đánh giá");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    const labels: Record<string, string> = {
      pending: "Chờ duyệt",
      approved: "Đã duyệt",
      rejected: "Đã từ chối",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  if (loading) {
    return (
      <AdminLayout title="Quản lý đánh giá">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-neutral-600">Đang tải...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Quản lý đánh giá">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Tổng đánh giá"
          value={stats.total}
          color="bg-blue-500"
        />
        <StatCard
          title="Chờ duyệt"
          value={stats.pending}
          color="bg-yellow-500"
        />
        <StatCard
          title="Đã duyệt"
          value={stats.approved}
          color="bg-green-500"
        />
        <StatCard
          title="Đã từ chối"
          value={stats.rejected}
          color="bg-red-500"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-neutral-600" />
          <span className="text-sm font-semibold text-neutral-700 mr-2">
            Lọc:
          </span>
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="Tất cả"
            count={stats.total}
          />
          <FilterButton
            active={filter === "pending"}
            onClick={() => setFilter("pending")}
            label="Chờ duyệt"
            count={stats.pending}
          />
          <FilterButton
            active={filter === "approved"}
            onClick={() => setFilter("approved")}
            label="Đã duyệt"
            count={stats.approved}
          />
          <FilterButton
            active={filter === "rejected"}
            onClick={() => setFilter("rejected")}
            label="Đã từ chối"
            count={stats.rejected}
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            <p>Không có đánh giá nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Người đánh giá
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Đánh giá
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Nội dung
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Ngày tạo
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredReviews.map((review) => (
                  <tr key={review.review_id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            review.product?.image_url
                              ? `http://localhost:5000${review.product.image_url}`
                              : "https://via.placeholder.com/40"
                          }
                          alt={review.product?.name}
                          className="w-10 h-10 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/40";
                          }}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {review.product?.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            ID: {review.product_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">
                          {review.user?.username}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {review.user?.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{review.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Xem
                      </button>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(review.status)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {new Date(review.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {review.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(review.review_id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Duyệt"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(review.review_id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Từ chối"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(review.review_id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold">Chi tiết đánh giá</h3>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Product Info */}
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <img
                  src={
                    selectedReview.product?.image_url
                      ? `http://localhost:5000${selectedReview.product.image_url}`
                      : "https://via.placeholder.com/60"
                  }
                  alt={selectedReview.product?.name}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/60";
                  }}
                />
                <div>
                  <p className="font-semibold">{selectedReview.product?.name}</p>
                  <p className="text-sm text-neutral-600">
                    ID: {selectedReview.product_id}
                  </p>
                </div>
              </div>

              {/* User & Rating */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Người đánh giá</p>
                  <p className="font-semibold">{selectedReview.user?.username}</p>
                  <p className="text-sm text-neutral-500">
                    {selectedReview.user?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Đánh giá</p>
                  <div className="flex items-center gap-2">
                    <StarRatingDisplay rating={selectedReview.rating} />
                    <span className="font-semibold text-lg">
                      {selectedReview.rating}/5
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment */}
              <div>
                <p className="text-sm text-neutral-600 mb-2">Nội dung đánh giá</p>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-800 leading-relaxed">
                    {selectedReview.comment}
                  </p>
                </div>
              </div>

              {/* Status & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Trạng thái</p>
                  {getStatusBadge(selectedReview.status)}
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Ngày tạo</p>
                  <p className="font-semibold">
                    {new Date(selectedReview.created_at).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {selectedReview.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleApprove(selectedReview.review_id);
                      setSelectedReview(null);
                    }}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Duyệt đánh giá
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedReview.review_id);
                      setSelectedReview(null);
                    }}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Từ chối
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// Helper Components
function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      <div className={`w-12 h-12 ${color} rounded-lg mb-3`}></div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-neutral-600">{title}</p>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
        active
          ? "bg-black text-white"
          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
      }`}
    >
      {label} ({count})
    </button>
  );
}

function StarRatingDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-neutral-300"
          }`}
        />
      ))}
    </div>
  );
}