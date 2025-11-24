import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";
import { formatVnd } from "../../utils/format";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { addToCart as addToCartAPI } from "../../api/cart";

const API_URL = import.meta.env.VITE_API_URL;

type Props = {
  item: Product;
};

export default function ProductCard({ item }: Props) {
  const navigate = useNavigate();

  // Kiểm tra còn hàng không
  const isOutOfStock = item.stock_quantity === 0;

  // Xử lý khi nhấn vào card (trừ các nút)
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('button') && !target.closest('a')) {
      navigate(`/san-pham/${item.product_id}`);
    }
  };

  // Xử lý thêm vào giỏ hàng - Kiểm tra tồn kho trước
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Kiểm tra hết hàng
    if (isOutOfStock) {
      toast.error(" Sản phẩm đã hết hàng!");
      return;
    }

    // Kiểm tra đăng nhập
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.warning(" Vui lòng đăng nhập để thêm vào giỏ!");
      setTimeout(() => navigate("/dang-nhap"), 1000);
      return;
    }

    try {
      // Gọi API thêm vào giỏ (mặc định size M, qty 1)
      const result = await addToCartAPI(item.product_id, 1, "M");

      if (result) {
        toast.success(` Đã thêm "${item.name}" vào giỏ!`);
        // Dispatch event để cập nhật số lượng giỏ hàng
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        toast.error(" Không thể thêm vào giỏ. Vui lòng thử lại!");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      // Xử lý lỗi hết hàng từ API
      if (error.response?.status === 400) {
        toast.error(" Sản phẩm đã hết hàng hoặc không đủ số lượng!");
      } else {
        toast.error(" Có lỗi xảy ra. Vui lòng thử lại!");
      }
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md relative"
    >
      {/* Badge hết hàng */}
      {isOutOfStock && (
        <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-[2px] grid place-items-center">
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
            HẾT HÀNG
          </div>
        </div>
      )}

      {/* Ảnh sản phẩm */}
      <div className="relative">
        <div className="overflow-hidden">
          <img
            src={`${API_URL}${item.image_url}`}
            alt={item.name}
            className={`h-56 w-full object-cover transition-transform duration-300 sm:h-64 group-hover:scale-105 ${
              isOutOfStock ? "grayscale" : ""
            }`}
            loading="lazy"
          />
        </div>

        {/* Nút thêm vào giỏ */}
        {!isOutOfStock && (
          <button
            className="absolute right-2 top-2 grid h-9 w-9 place-content-center rounded-full bg-white/95 text-neutral-800 shadow hover:bg-white transition-transform hover:scale-110"
            aria-label="Thêm vào giỏ hàng"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nội dung sản phẩm */}
      <div className="flex flex-1 flex-col p-3">
        {/* Tên sản phẩm */}
        <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-snug">
          {item.name}
        </h3>

        {/* Tag "Hàng mới", "Giảm giá", "Hết hàng"... */}
        <div className="mt-1 min-h-[22px] flex items-start gap-1">
          {isOutOfStock ? (
            <span className="inline-block rounded bg-red-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-red-700 whitespace-nowrap">
              Hết hàng
            </span>
          ) : (
            <>
              {item.stock_quantity <= 5 && (
                <span className="inline-block rounded bg-orange-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-orange-700 whitespace-nowrap">
                  Chỉ còn {item.stock_quantity}
                </span>
              )}
              {item.isNew && (
                <span className="inline-block rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-neutral-800 whitespace-nowrap">
                  Hàng Mới
                </span>
              )}
              {item.voucherText && (
                <span className="inline-block rounded bg-amber-400 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-black whitespace-nowrap">
                  {item.voucherText}
                </span>
              )}
            </>
          )}
        </div>

        {/* Giá và nút chi tiết */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className={`text-[13px] font-semibold ${isOutOfStock ? "text-neutral-400" : "text-black"}`}>
            {formatVnd(Number(item.price))}
          </div>

          {/* Nút "Chi tiết" */}
          <Link
            to={`/san-pham/${item.product_id}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded-md bg-black px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
}