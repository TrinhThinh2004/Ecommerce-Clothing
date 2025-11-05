import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";
import { formatVnd } from "../../utils/format";
import { ShoppingCart } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Hàm thêm sản phẩm vào giỏ hàng (localStorage)
 */
function addToCart(item: Product) {
  try {
    const raw = localStorage.getItem("cart");
    const cart: Array<{ id: number; qty: number; item: Product }> = raw
      ? JSON.parse(raw)
      : [];

    const idx = cart.findIndex((c) => c.id === item.product_id);
    if (idx >= 0) cart[idx].qty += 1;
    else cart.push({ id: item.product_id, qty: 1, item });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✅ Đã thêm sản phẩm vào giỏ hàng!");
  } catch {
    alert("❌ Không thể thêm vào giỏ. Vui lòng thử lại.");
  }
}

type Props = {
  item: Product;
};

export default function ProductCard({ item }: Props) {
  const navigate = useNavigate();

  // Xử lý khi nhấn ảnh sản phẩm
  const handleNavigateDetail = () => {
    navigate(`/san-pham/${item.product_id}`);
  };

  return (
    <article
      onClick={handleNavigateDetail}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Ảnh sản phẩm */}
      <div className="relative">
        <div className="overflow-hidden">
          <img
            src={`${API_URL}${item.image_url}`}
            alt={item.name}
            className="h-56 w-full object-cover transition-transform duration-300 sm:h-64 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Nút thêm vào giỏ */}
        <button
          className="absolute right-2 top-2 grid h-9 w-9 place-content-center rounded-full bg-white/95 text-neutral-800 shadow hover:bg-white"
          aria-label="Thêm vào giỏ hàng"
          onClick={(e) => {
            e.stopPropagation(); // Ngăn không mở trang chi tiết
            addToCart(item);
          }}
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>

      {/* Nội dung sản phẩm */}
      <div className="flex flex-1 flex-col p-3">
        {/* Tên sản phẩm */}
        <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-snug">
          {item.name}
        </h3>

        {/* Tag “Hàng mới”, “Giảm giá”... */}
        <div className="mt-1 min-h-[22px] flex items-start gap-1">
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
        </div>

        {/* Giá và nút chi tiết */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="text-[13px] font-semibold text-black">
            {formatVnd(Number(item.price))}
          </div>

          {/* Nút "Chi tiết" */}
          <Link
            to={`/san-pham/${item.product_id}`}
            onClick={(e) => e.stopPropagation()} // không bị trùng navigate
            className="rounded-md bg-black px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
}
