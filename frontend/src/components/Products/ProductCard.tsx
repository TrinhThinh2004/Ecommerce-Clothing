// src/components/Products/ProductCard.tsx
import { Link } from "react-router-dom";
import { formatVnd } from "../../utils/format";
import { ShoppingCart, Package } from "lucide-react";
import type { Product } from "../../types/product";

interface Props {
  item: Product;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProductCard({ item }: Props) {
  const imageUrl = 
    item.image_url && item.image_url.startsWith("http")
      ? item.image_url
      : `${API_BASE_URL}${item.image_url || ""}`;

  const isOutOfStock = item.stock_quantity <= 0;
  const isLowStock = item.stock_quantity > 0 && item.stock_quantity <= 5;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-lg">
      {/* Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-2 right-2 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
          HẾT HÀNG
        </div>
      )}
      {isLowStock && !isOutOfStock && (
        <div className="absolute top-2 right-2 z-10 rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
          SẮP HẾT
        </div>
      )}

      <Link to={`/san-pham/${item.product_id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <img
            src={imageUrl}
            alt={item.name}
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 ${
              isOutOfStock ? "opacity-50 grayscale" : ""
            }`}
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/400x400?text=No+Image";
            }}
          />

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="text-center">
                <Package className="mx-auto h-12 w-12 text-white mb-2" />
                <p className="text-white font-bold text-lg">Tạm hết hàng</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 font-semibold text-neutral-800 transition-colors group-hover:text-black">
            {item.name}
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-black">
                {formatVnd(item.price)}
              </p>

              <div className="mt-1 flex items-center gap-1 text-xs">
                {isOutOfStock ? (
                  <span className="text-red-600 font-semibold">Hết hàng</span>
                ) : isLowStock ? (
                  <span className="text-yellow-600 font-semibold">
                    Chỉ còn {item.stock_quantity} sản phẩm
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold">
                    Còn hàng ({item.stock_quantity})
                  </span>
                )}
              </div>
            </div>

            {!isOutOfStock && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Quick add:", item.product_id);
                }}
                className="rounded-full bg-black p-2 text-white opacity-0 transition-all hover:bg-neutral-800 group-hover:opacity-100"
                title="Thêm vào giỏ"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
