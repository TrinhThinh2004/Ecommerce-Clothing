
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  Star,
  XCircle,
  Edit,
  Trash2,
  Send,
} from "lucide-react";
import { addToCart as addToCartAPI, fetchCart } from "../../api/cart";
import type { Product } from "../../types/product";
import { formatVnd } from "../../utils/format";
import { toast } from "react-toastify";
import {
  fetchProductReviews,
  fetchReviewStats,
  createReview,
  checkUserReview,
  updateReview,
  deleteReview,
  type Review,
  type ReviewStats,
} from "../../api/review";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Product state
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [reservedQty, setReservedQty] = useState(0);

  // Review state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (id) {
      fetchProduct();
      loadReviews();
      checkUserHasReviewed();
      loadReservedQty();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const handleCartUpdate = () => {
      loadReservedQty();
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  useEffect(() => {
    if (!product) return;
    const available = Math.max(0, product.stock_quantity - reservedQty);
    if (available <= 0) {
      setQty(1);
      return;
    }
    setQty((prev) => Math.min(prev, available));
  }, [product?.stock_quantity, reservedQty]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/products/${id}`);
      const data = await res.json();
      setProduct(data?.data || data);
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
      toast.error("Không thể tải thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const loadReservedQty = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setReservedQty(0);
        return;
      }
      const cartItems = await fetchCart();
      const current = cartItems.find(
        (item) => item.product?.product_id === Number(id)
      );
      setReservedQty(current ? current.quantity : 0);
    } catch (err) {
      console.error("Error loading reserved quantity:", err);
      setReservedQty(0);
    }
  };

  const loadReviews = async () => {
    try {
      const [reviewsData, statsData] = await Promise.all([
        fetchProductReviews(Number(id)),
        fetchReviewStats(Number(id)),
      ]);
      setReviews(reviewsData);
      setStats(statsData);
    } catch (err) {
      console.error("Error loading reviews:", err);
    }
  };

  const checkUserHasReviewed = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const review = await checkUserReview(Number(id));
      setUserReview(review);
    } catch (err) {
      console.error("Error checking user review:", err);
    }
  };

  const requireLogin = (callback: () => void) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      if (
        window.confirm(
          " Bạn cần đăng nhập để tiếp tục. Bạn có muốn chuyển đến trang đăng nhập không?"
        )
      ) {
        navigate("/dang-nhap");
      }
      return false;
    }
    callback();
    return true;
  };

  const addToCart = async (buyNow: boolean = false) => {
    if (!size) {
      toast.error(" Vui lòng chọn kích thước!");
      return;
    }

    if (!product) {
      toast.error("Không tìm thấy sản phẩm!");
      return;
    }

    const availableStock = Math.max(0, product.stock_quantity - reservedQty);

    if (availableStock <= 0) {
      toast.error("Sản phẩm đã hết hàng.");
      return;
    }

    if (qty > availableStock) {
      toast.warning(`Chỉ còn ${availableStock} sản phẩm trong kho.`);
      setQty(Math.max(1, availableStock));
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error(" Vui lòng đăng nhập để thêm vào giỏ!");
      setTimeout(() => navigate("/dang-nhap"), 1000);
      return;
    }

    try {
      const result = await addToCartAPI(product.product_id, qty, size);

      if (result) {
        toast.success(` Đã thêm sản phẩm vào giỏ!`);
        setReservedQty((prev) => prev + qty);
        window.dispatchEvent(new Event("cartUpdated"));

        if (buyNow) {
          setTimeout(() => {
            navigate("/gio-hang");
          }, 500);
        }
      } else {
        toast.error(" Không thể thêm vào giỏ. Vui lòng thử lại!");
      }
    } catch (error: unknown) {
      console.error("Error adding to cart:", error);
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message ??
            "Có lỗi xảy ra. Vui lòng thử lại!")
          : "Có lỗi xảy ra. Vui lòng thử lại!";
      toast.error(message);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.warning(" Vui lòng đăng nhập để đánh giá");
      navigate("/dang-nhap");
      return;
    }

    if (!comment.trim()) {
      toast.error(" Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      if (userReview) {
        await updateReview(userReview.review_id, { rating, comment });
        toast.success(" Đã cập nhật đánh giá của bạn!");
      } else {
        await createReview({
          product_id: Number(id),
          rating,
          comment,
        });
        toast.success(" Đã gửi đánh giá! Đang chờ duyệt.");
      }

      setShowReviewForm(false);
      setComment("");
      setRating(5);
      loadReviews();
      checkUserHasReviewed();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error submitting review:", err);
      toast.error(err.response?.data?.message || " Không thể gửi đánh giá");
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;

    try {
      await deleteReview(userReview.review_id);
      toast.success(" Đã xóa đánh giá");
      setUserReview(null);
      loadReviews();
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error(" Không thể xóa đánh giá");
    }
  };

  const handleEditReview = () => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment);
      setShowReviewForm(true);
    }
  };

  const mainImg = product?.image_url;
  const imageUrl = mainImg?.startsWith("http")
    ? mainImg
    : `http://localhost:5000${mainImg || ""}`;
  const stockQuantity = product?.stock_quantity ?? 0;
  const availableStock = Math.max(0, stockQuantity - reservedQty);
  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock > 0 && availableStock <= 5;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-neutral-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-600">
          Không tìm thấy sản phẩm
        </h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-neutral-800"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100 min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-3 py-6 lg:px-0">
        <div className="grid gap-5 md:grid-cols-2">
          {/* LEFT: IMAGE */}
          <section className="rounded-xl border border-neutral-200 bg-white p-3">
            <div className="overflow-hidden rounded-lg bg-white">
              <div className="h-[360px] md:h-[480px] grid place-items-center">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/400x400?text=No+Image";
                  }}
                />
              </div>
            </div>
          </section>

          {/* RIGHT: INFO */}
          <section className="rounded-xl border border-neutral-200 bg-white p-5">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="mt-1 text-sm text-neutral-500">
              <span>Loại: {product.category || "Khác"}</span>
            </div>
            <div className="mt-3 text-2xl font-bold text-black">
              {formatVnd(Number(product.price))}
            </div>
            <div className="mt-1 text-sm font-semibold">
              {isOutOfStock ? (
                <span className="text-red-600">Sản phẩm tạm hết hàng</span>
              ) : isLowStock ? (
                <span className="text-amber-600">⚠️ Chỉ còn {availableStock} sản phẩm</span>
              ) : (
                <span className="text-emerald-600">✓ Còn {availableStock} sản phẩm</span>
              )}
            </div>

            {/* SIZE */}
            <div className="mt-4">
              <div className="text-sm font-medium">
                Kích thước: <span className="text-red-500">*</span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="ml-2 text-xs text-sky-600 hover:underline"
                >
                  Hướng dẫn chọn size
                </button>
              </div>
              <div className="mt-2 flex gap-2">
                {["S", "M", "L", "XL"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={[
                      "min-w-10 rounded border px-3 py-1.5 text-sm font-medium transition-all",
                      size === s
                        ? "border-black bg-black text-white shadow-md scale-105"
                        : "border-neutral-300 bg-white hover:border-neutral-500 hover:shadow",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!size && (
                <p className="mt-1 text-xs text-red-500">
                  * Bạn chưa chọn kích thước
                </p>
              )}
            </div>

            {/* QTY */}
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Số lượng:</div>
              <div className="flex items-center rounded-md border border-neutral-300 w-fit">
                <button
                  className="grid h-9 w-9 place-content-center hover:bg-neutral-100 transition-colors disabled:opacity-50"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    const maxAllowed = availableStock > 0 ? availableStock : 1;
                    setQty(Math.max(1, Math.min(val, maxAllowed)));
                  }}
                  className="h-9 w-14 border-x border-neutral-300 text-center outline-none"
                />
                <button
                  className="grid h-9 w-9 place-content-center hover:bg-neutral-100 transition-colors disabled:opacity-50"
                  onClick={() =>
                    setQty((q) => (availableStock > 0 ? Math.min(availableStock, q + 1) : q))
                  }
                  disabled={isOutOfStock || qty >= availableStock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {isOutOfStock && (
                <p className="mt-2 text-sm text-red-600">
                  Sản phẩm đã hết hàng. Vui lòng quay lại sau hoặc chọn sản phẩm khác.
                </p>
              )}
            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-6 py-3 font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
                onClick={() => requireLogin(() => addToCart(false))}
                disabled={!size || isOutOfStock}
              >
                <ShoppingCart className="h-5 w-5" />
                Thêm vào giỏ
              </button>

              <button
                className="rounded-md border-2 border-black px-6 py-3 font-semibold hover:bg-black hover:text-white transition disabled:opacity-50"
                onClick={() => requireLogin(() => addToCart(true))}
                disabled={!size || isOutOfStock}
              >
                Mua ngay
              </button>
            </div>

            {/* Store info */}
            <div className="mt-6 flex flex-col gap-3 text-sm text-neutral-600 border-t pt-4">
              <span className="inline-flex items-center gap-2">
                <Truck className="h-4 w-4" /> Miễn phí vận chuyển đơn từ 299K
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Bảo hành trong 30 ngày
              </span>
            </div>
          </section>
        </div>

        {/* TABS */}
        <Tabs className="mt-6">
          <Tab title="MÔ TẢ">
            <div className="p-5">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="mt-2 text-sm text-neutral-700 leading-6">
                {product.description ||
                  "Chưa có mô tả chi tiết cho sản phẩm này."}
              </p>
            </div>
          </Tab>

          <Tab title="CHÍNH SÁCH GIAO HÀNG">
            <ImgPanel
              src="https://file.hstatic.net/1000253775/file/cs_giaohanh.jpg"
              alt="Chính sách giao hàng"
            />
          </Tab>

          <Tab title="CHÍNH SÁCH ĐỔI HÀNG">
            <ImgPanel
              src="https://file.hstatic.net/1000253775/file/doitra_1.jpg"
              alt="Chính sách đổi hàng"
            />
          </Tab>
        </Tabs>

        <section className="mt-6 rounded-xl border border-neutral-200 bg-white p-6">
          <div className="grid gap-6 md:grid-cols-[280px,1fr]">
            {/* Left: Stats */}
            <div>
              <h3 className="text-2xl font-extrabold mb-4">ĐÁNH GIÁ SẢN PHẨM</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-5xl font-extrabold">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div>
                  <StarRating rating={Math.round(stats.averageRating)} />
                  <div className="text-sm font-semibold text-neutral-700 mt-1">
                    {stats.totalReviews} đánh giá
                  </div>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {([5, 4, 3, 2, 1] as const).map((star) => {
                  const count = stats.ratingDistribution[star];
                  const percent = stats.totalReviews
                    ? Math.round((count / stats.totalReviews) * 100)
                    : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <div className="w-8 text-right">{star}★</div>
                      <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="w-10 text-right tabular-nums">{count}</div>
                    </div>
                  );
                })}
              </div>

              {/* Write Review Button */}
              {userReview ? (
                <div className="mt-6 space-y-2">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-700">
                      ✓ Bạn đã đánh giá sản phẩm này
                    </p>
                    {userReview.status === "pending" && (
                      <p className="text-xs text-green-600 mt-1">
                        (Đang chờ duyệt)
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditReview}
                      className="flex-1 px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Sửa
                    </button>
                    <button
                      onClick={handleDeleteReview}
                      className="flex-1 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    const token = localStorage.getItem("accessToken");
                    if (!token) {
                      toast.warning("⚠️ Vui lòng đăng nhập để đánh giá");
                      navigate("/dang-nhap");
                      return;
                    }
                    setShowReviewForm(!showReviewForm);
                  }}
                  className="w-full mt-6 px-4 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 font-semibold"
                >
                  Viết đánh giá
                </button>
              )}
            </div>

            {/* Right: Reviews List */}
            <div className="space-y-6">
              {/* Review Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleSubmitReview}
                  className="p-4 border-2 border-black rounded-lg bg-amber-50"
                >
                  <h4 className="font-bold mb-3">
                    {userReview ? "Sửa đánh giá" : "Viết đánh giá của bạn"}
                  </h4>

                  {/* Star Selection */}
                  <div className="mb-3">
                    <label className="text-sm font-semibold mb-2 block">
                      Đánh giá của bạn:
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-neutral-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black"
                    rows={4}
                    required
                  />

                  <div className="flex gap-2 mt-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800 font-semibold flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {userReview ? "Cập nhật" : "Gửi đánh giá"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false);
                        setComment("");
                        setRating(5);
                      }}
                      className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 font-semibold"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  <Star className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                  <p className="font-semibold">Chưa có đánh giá nào</p>
                  <p className="text-sm mt-2">
                    Hãy là người đầu tiên đánh giá sản phẩm này!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.review_id}
                      className="p-4 border border-neutral-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.user?.username}</p>
                          <StarRating rating={review.rating} />
                        </div>
                        <time className="text-xs text-neutral-500">
                          {new Date(review.created_at).toLocaleDateString("vi-VN")}
                        </time>
                      </div>
                      <p className="text-sm text-neutral-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* SIZE GUIDE MODAL */}
      {showSizeGuide && (
        <SizeGuideModal
          onClose={() => setShowSizeGuide(false)}
          title={`Bảng size ${product.name}`}
        />
      )}
    </div>
  );
}

/* ---------------- SUB COMPONENTS ---------------- */
type TabElement = React.ReactElement<{
  title: string;
  children: React.ReactNode;
}>;

function Tabs({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  const items = (
    Array.isArray(children) ? children : [children]
  ) as TabElement[];

  return (
    <div className={className}>
      <div className="flex gap-2">
        {items.map((c, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={[
              "rounded-t-lg border px-4 py-2 text-sm font-semibold transition-colors",
              i === idx
                ? "border-neutral-200 border-b-white bg-white"
                : "border-transparent bg-neutral-100 hover:bg-neutral-200",
            ].join(" ")}
          >
            {c.props.title}
          </button>
        ))}
      </div>
      <div className="rounded-b-xl border border-neutral-200 bg-white">
        {items[idx]}
      </div>
    </div>
  );
}

function Tab({ children }: { title: string; children: React.ReactNode }) {
  return <>{children}</>;
}

function ImgPanel({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="p-5">
      <img
        src={src}
        alt={alt}
        className="mx-auto w-full max-w-4xl rounded-lg border"
        onError={(e) => {
          e.currentTarget.src =
            "https://via.placeholder.com/800x600?text=Image+Not+Found";
        }}
      />
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-neutral-300"
          }`}
        />
      ))}
    </div>
  );
}

function SizeGuideModal({
  onClose,
  title,
}: {
  onClose: () => void;
  title: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-white rounded-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-black"
        >
          <XCircle className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <img
          src="https://cdn.hstatic.net/products/1000253775/polo-regular_e5cb6669ccc243d09ba2d0ae4fdb6143_master.png"
          alt="Size guide"
          className="w-full rounded-lg"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/800x600?text=Size+Guide";
          }}
        />
      </div>
    </div>
  );
}