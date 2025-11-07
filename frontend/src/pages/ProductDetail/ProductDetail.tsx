import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  Star,
} from "lucide-react";
import type { Product } from "../../types/product";
import { formatVnd } from "../../utils/format";
import SizeGuideModal from "../../components/Modals/SizeGuideModal";

/* ----------------- MOCK đánh giá mẫu ------------------ */
type Review = {
  id: string;
  user: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: string;
};

const REVIEWS: Review[] = [
  {
    id: "r1",
    user: "Nguyễn Minh",
    rating: 5,
    comment: "Áo đẹp, chất dày vừa, form chuẩn. Sẽ ủng hộ tiếp!",
    createdAt: "2025-08-02T12:30:00Z",
  },
  {
    id: "r2",
    user: "Trần Bảo",
    rating: 4,
    comment: "Màu đẹp, mặc thoải mái. Góp ý: giao nhanh hơn chút là perfect.",
    createdAt: "2025-08-01T09:05:00Z",
  },
  {
    id: "r3",
    user: "Lê Hồng",
    rating: 5,
    comment: "Đúng mô tả, form regular dễ phối đồ.",
    createdAt: "2025-07-29T15:10:00Z",
  },
];

/* ----------------- Helpers ------------------ */
function avgRating(list: Review[]): number {
  if (!list.length) return 0;
  const sum = list.reduce((s, r) => s + r.rating, 0);
  return Math.round((sum / list.length) * 10) / 10;
}

function countByStar(list: Review[]): Record<1 | 2 | 3 | 4 | 5, number> {
  return {
    5: list.filter((r) => r.rating === 5).length,
    4: list.filter((r) => r.rating === 4).length,
    3: list.filter((r) => r.rating === 3).length,
    2: list.filter((r) => r.rating === 2).length,
    1: list.filter((r) => r.rating === 1).length,
  };
}

function formatDateVN(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function addToCartLS(item: Product, qty: number, size?: string) {
  const raw = localStorage.getItem("cart");
  const cart: {
    product_id: number;
    qty: number;
    item: Product;
    size?: string;
  }[] = raw ? JSON.parse(raw) : [];

  const idx = cart.findIndex(
    (c) => c.product_id === item.product_id && c.size === size
  );
  if (idx >= 0) cart[idx].qty += qty;
  else cart.push({ product_id: item.product_id, qty, item, size });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("🛒 Đã thêm vào giỏ!");
}

/* ----------------- MAIN COMPONENT ------------------ */
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [size, setSize] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/products/${id}`);
        const data = await res.json();
        setProduct(data?.data || data);
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const requireLogin = (callback: () => void) => {
    const user = localStorage.getItem("user");
    if (!user) {
      if (
        window.confirm(
          "⚠️ Bạn cần đăng nhập để tiếp tục. Bạn có muốn chuyển đến trang đăng nhập không?"
        )
      ) {
        navigate("/");
      }
      return;
    }
    callback();
  };

  const mainImg = product?.image_url;
  const imageUrl = mainImg?.startsWith("http")
    ? mainImg
    : `http://localhost:5000${mainImg || ""}`;

  if (loading)
    return (
      <div className="py-20 text-center text-neutral-600">Đang tải...</div>
    );

  if (!product)
    return (
      <div className="py-20 text-center text-red-600">
        Không tìm thấy sản phẩm
      </div>
    );

  /* ---------------- Render ---------------- */
  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100">
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

            {/* SIZE */}
            <div className="mt-4">
              <div className="text-sm font-medium">
                Kích thước:
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
                      "min-w-10 rounded border px-3 py-1.5 text-sm",
                      size === s
                        ? "border-black bg-black text-white"
                        : "border-neutral-300 bg-white hover:border-neutral-500",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* QTY + BUTTONS */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-md border border-neutral-300">
                <button
                  className="grid h-9 w-9 place-content-center hover:bg-neutral-50"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="h-9 w-14 border-x border-neutral-300 text-center outline-none"
                />
                <button
                  className="grid h-9 w-9 place-content-center hover:bg-neutral-50"
                  onClick={() => setQty((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* NÚT THÊM VÀO GIỎ */}
              <button
                className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 font-semibold text-white transition hover:bg-sky-600"
                onClick={() =>
                  requireLogin(() => {
                    addToCartLS(product, qty, size); // ✅ chỉ thêm vào giỏ
                  })
                }
              >
                <ShoppingCart className="h-4 w-4" />
                Thêm vào giỏ
              </button>

              {/* NÚT MUA NGAY */}
              <button
                className="rounded-md border border-black px-4 py-2 font-semibold hover:bg-black hover:text-white"
                onClick={() =>
                  requireLogin(() => {
                    addToCartLS(product, qty, size); // ✅ thêm sản phẩm
                    navigate("/gio-hang"); // ✅ chuyển sang trang giỏ hàng
                  })
                }
              >
                Mua ngay
              </button>
            </div>

            {/* Store info */}
            <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-neutral-600">
              <span className="inline-flex items-center gap-2">
                <Truck className="h-4 w-4" /> Miễn phí vận chuyển đơn từ 299K
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Bảo hành trong 30 ngày
              </span>
            </div>
          </section>
        </div>

        {/* ----------------- TABS ----------------- */}
        <Tabs className="mt-6">
          <Tab title="MÔ TẢ">
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
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
            <ImgPanel
              src="https://file.hstatic.net/1000253775/file/doitra_2.jpg"
              alt="Chính sách đổi hàng"
            />
          </Tab>
        </Tabs>

        {/* ----------------- REVIEWS ----------------- */}
        <section className="mt-6 rounded-xl border border-neutral-200 bg-white p-5">
          <div className="grid gap-6 md:grid-cols-[260px,1fr]">
            <div>
              <h3 className="text-2xl font-extrabold">ĐÁNH GIÁ SẢN PHẨM</h3>
              <div className="mt-4 flex items-center gap-3">
                <div className="text-[44px] font-extrabold leading-none">
                  {avgRating(REVIEWS)}
                </div>
                <div>
                  <StarRow
                    stars={Math.round(avgRating(REVIEWS)) as 1 | 2 | 3 | 4 | 5}
                  />
                  <div className="text-sm font-semibold text-neutral-700">
                    {REVIEWS.length} đánh giá
                  </div>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm">
                {([5, 4, 3, 2, 1] as const).map((s) => {
                  const count = countByStar(REVIEWS)[s];
                  const percent = Math.round((count / REVIEWS.length) * 100);
                  return (
                    <li key={s} className="flex items-center gap-2">
                      <div className="w-8 text-right">{s}★</div>
                      <div className="relative h-2 flex-1 rounded bg-neutral-200">
                        <div
                          className="absolute left-0 top-0 h-2 rounded bg-yellow-400"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="w-10 text-right tabular-nums">
                        {count}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <ul className="space-y-4">
                {REVIEWS.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-lg border border-neutral-200 p-4"
                  >
                    <div className="flex justify-between">
                      <div className="font-semibold">{r.user}</div>
                      <div className="text-xs text-neutral-500">
                        {formatDateVN(r.createdAt)}
                      </div>
                    </div>
                    <div className="mt-1">
                      <StarRow stars={r.rating} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-neutral-800">
                      {r.comment}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* SIZE GUIDE MODAL */}
      <SizeGuideModal
        open={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        title={`Bảng size ${product.name}`}
        src="https://cdn.hstatic.net/products/1000253775/polo-regular_e5cb6669ccc243d09ba2d0ae4fdb6143_master.png"
      />
    </div>
  );
}

/* ---------------- COMPONENT PHỤ ---------------- */
import type { ReactNode, ReactElement } from "react";

type TabProps = { title: string; children: ReactNode };

function Tabs({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const items = (
    Array.isArray(children) ? children : [children]
  ) as ReactElement<TabProps>[];
  const [idx, setIdx] = useState(0);
  return (
    <div className={className}>
      <div className="flex gap-2">
        {items.map((c, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={[
              "rounded-t-lg border px-3 py-2 text-sm font-semibold",
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

function Tab({ children }: TabProps) {
  return <div className="p-5">{children}</div>;
}

function ImgPanel({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="p-5">
      <img
        src={src}
        alt={alt}
        className="mx-auto w-full max-w-4xl rounded-lg border"
      />
    </div>
  );
}

function StarRow({ stars }: { stars: number }) {
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < stars ? "text-yellow-400 fill-yellow-400" : "text-neutral-300"
          }`}
        />
      ))}
    </div>
  );
}
