// src/pages/Search/Search.tsx
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import type { Product } from "../../types/product";
import ProductGrid from "../../components/Products/ProductGrid";
import { formatVnd } from "../../utils/format";

const PAGE_SIZE = 12;

/** ==== MOCK data (sau này thay bằng API) ==== */
type ProductWithCategory = Product & { category: string };

const baseImgs = [
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503342452485-86ff0a0d98ab?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop",
];
const NAMES = [
  "Áo Polo Nam ICONDENIM Braided Stripes",
  "Áo Polo Nam ICONDENIM Heroic",
  "Quần Jean Nam ICONDENIM Grey Baggy",
  "Mũ ICONDENIM Conqueror Bear",
  "Quần Short Nam RUNPOW Flash Move",
];
const PRICES = [399000, 359000, 549000, 249000, 299000];
const CATES = ["ao-thun", "so-mi", "ao-khoac", "quan-jeans", "quan-tay"];

const MOCK: ProductWithCategory[] = Array.from({ length: 48 }, (_, i) => {
  const idx = i % baseImgs.length;
  return {
    id: String(i + 1),
    product_id: i + 1,
    name: NAMES[idx] + ` #${i + 1}`,
    image: baseImgs[idx],
    price: PRICES[idx],
    isNew: i % 4 === 0,
    voucherText: i % 3 === 0 ? "Voucher 30K" : undefined,
    category: CATES[idx],
    stock_quantity: 100,
  };
});

/** ============================================ */

export default function Search() {
  const [params] = useSearchParams();

  const q = (params.get("q") ?? "").trim().toLowerCase();
  const category = params.get("category") ?? undefined;

  // Lọc theo q & category
  const filtered: ProductWithCategory[] = useMemo(() => {
    let arr = MOCK;
    if (q) {
      arr = arr.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          String(p.price).includes(q) ||
          formatVnd(p.price).toLowerCase().includes(q)
      );
    }
    if (category) {
      arr = arr.filter((p) => p.category === category);
    }
    return arr;
  }, [q, category]);

  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        {/* Header nhỏ của trang search */}
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold">Kết quả tìm kiếm</h1>
            <p className="mt-1 text-sm text-neutral-600">
              {q ? (
                <>
                  Từ khóa: <b>“{q}”</b> •{" "}
                </>
              ) : null}
              Tìm thấy <b>{filtered.length}</b> sản phẩm
              {category ? (
                <>
                  {" "}
                  trong mục <b>{category}</b>
                </>
              ) : null}
            </p>
          </div>
        </header>

        {/* Lưới sản phẩm + Phân trang + “Xem thêm” do ProductGrid lo */}
        <ProductGrid
          items={filtered} // ProductWithCategory vẫn là superset của Product
          pageSize={PAGE_SIZE}
          showSeeMore // hiện nút “Xem thêm”
          seeMoreText="Xem thêm"
        />
      </div>
    </div>
  );
}
