// src/pages/Cart/Cart.tsx
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, CreditCard, Truck, Wallet } from "lucide-react";
import { formatVnd } from "../../utils/format";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  CartItem,
  mapCartItem,
  LocalCartItem,
} from "../../api/cart";
import axiosInstance from "../../api/client";

/* ====== Class CSS dùng chung cho input ====== */
const INPUT_CLS =
  "h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black";

export default function Cart() {
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Thông tin giao hàng
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [note, setNote] = useState("");

  // Thanh toán & voucher
  const [pay, setPay] = useState<"cod" | "vnpay" | "momo">("cod");
  const [voucher, setVoucher] = useState("");
  const [applied, setApplied] = useState<{ code?: string; amount: number }>({
    amount: 0,
  });

  /* ====== Lấy dữ liệu giỏ hàng từ API ====== */
  const loadCart = async () => {
    setLoading(true);
    try {
      const data: CartItem[] = await fetchCart();
      const mapped = data.map(mapCartItem);
      console.log("🛒 Giỏ hàng sau khi map:", mapped);
      setItems(mapped);
    } catch (err) {
      console.error("Lỗi khi tải giỏ hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ====== Tự động load khi mở trang + reload khi event cartUpdated ====== */
  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      console.log("🔄 Nhận sự kiện cập nhật giỏ hàng, tải lại...");
      loadCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  /* ====== Tính toán giá trị giỏ hàng ====== */
  const subTotal = useMemo(
    () => items.reduce((s, it) => s + it.item.price * it.qty, 0),
    [items]
  );
  const ship = useMemo(
    () => (subTotal >= 299000 || applied.code === "FREESHIP" ? 0 : 30000),
    [subTotal, applied]
  );
  const discount = applied.amount;
  const grand = Math.max(0, subTotal + ship - discount);

  /* ====== Thay đổi số lượng sản phẩm ====== */
  const changeQty = async (cart_id: number, delta: number) => {
    const target = items.find((it) => it.cart_id === cart_id);
    if (!target) return;

    const newQty = Math.max(1, target.qty + delta);

    // Cập nhật tạm thời trên UI (optimistic update)
    setItems((prev) =>
      prev.map((it) => (it.cart_id === cart_id ? { ...it, qty: newQty } : it))
    );

    try {
      const apiItem = await updateCartItem(cart_id, newQty);
      if (!apiItem) {
        console.warn("Cập nhật số lượng thất bại:", cart_id);
        loadCart(); // Hoàn tác
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
      loadCart();
    }
  };

  /* ====== Xóa sản phẩm khỏi giỏ ====== */
  const removeItemHandler = async (cart_id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      return;
    }

    // Xóa tạm thời trên UI
    setItems((prev) => prev.filter((it) => it.cart_id !== cart_id));

    try {
      const success = await removeCartItem(cart_id);
      if (!success) {
        console.warn("Xóa sản phẩm thất bại:", cart_id);
        loadCart(); // Hoàn tác
      } else {
        // Cập nhật lại toàn bộ app (vd: icon giỏ hàng)
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      loadCart();
    }
  };

  /* ====== Áp dụng mã giảm giá ====== */
  const applyVoucher = () => {
    const code = voucher.trim().toUpperCase();
    if (!code) {
      setApplied({ amount: 0 });
      return;
    }

    if (code === "SEP30") {
      setApplied({ code, amount: 30000 });
      alert("✅ Đã áp dụng mã giảm 30.000₫");
    } else if (code === "FREESHIP") {
      setApplied({ code, amount: 0 });
      alert("✅ Đã áp dụng mã miễn phí vận chuyển");
    } else {
      setApplied({ amount: 0 });
      alert("❌ Mã không hợp lệ. Thử mã: SEP30 hoặc FREESHIP");
    }
  };

  /* ====== Xử lý đặt hàng ====== */
  const placeOrder = async () => {
    if (!items.length) {
      alert("⚠️ Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.");
      return;
    }

    if (!name || !phone || !address || !city) {
      alert("⚠️ Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      alert("⚠️ Số điện thoại không hợp lệ (phải có 10 số).");
      return;
    }

    try {
      const res = await axiosInstance.post("/api/v1/orders", {
        full_name: name,
        phone,
        address,
        city,
        district,
        ward,
        note,
        payment_method: pay,
        voucher_code: applied.code ?? "",
        items: items.map((it) => ({
          product_id: it.product_id,
          quantity: it.qty,
          size: it.size,
          price_snapshot: it.item.price,
        })),
      });

      if (res.data.success) {
        alert(`🎉 Đặt hàng thành công!\nTổng thanh toán: ${formatVnd(grand)}`);
        setItems([]);
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/");
      } else {
        alert("❌ Đặt hàng thất bại: " + res.data.message);
      }
    } catch (err) {
      console.error("Lỗi khi đặt hàng:", err);
      alert("❌ Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
    }
  };

  /* ====== Giao diện khi đang tải ====== */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-neutral-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  /* ====== Giao diện chính ====== */
  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100 pb-28">
      <div className="mx-auto w-full max-w-6xl px-3 py-6 lg:px-0">
        <h1 className="mb-4 text-2xl font-extrabold">Giỏ hàng</h1>
        <div className="grid gap-6 lg:grid-cols-[1fr,0.9fr]">
          {/* BÊN TRÁI: Thông tin người nhận & thanh toán */}
          <section className="space-y-4">
            <Card title="Thông tin giao hàng">
              <div className="grid gap-3">
                <input
                  placeholder="Họ và tên *"
                  className={INPUT_CLS}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  placeholder="Số điện thoại *"
                  className={INPUT_CLS}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <input
                  placeholder="Địa chỉ *"
                  className={INPUT_CLS}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <div className="grid gap-3 sm:grid-cols-3">
                  <input
                    placeholder="Tỉnh/Thành phố *"
                    className={INPUT_CLS}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <input
                    placeholder="Quận/Huyện"
                    className={INPUT_CLS}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                  <input
                    placeholder="Phường/Xã"
                    className={INPUT_CLS}
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                  />
                </div>
                <input
                  placeholder="Ghi chú cho đơn hàng (nếu có)"
                  className={INPUT_CLS}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </Card>

            <Card title="Phương thức thanh toán">
              <div className="space-y-3">
                <PayRow
                  checked={pay === "cod"}
                  onChange={() => setPay("cod")}
                  title="Thanh toán khi nhận hàng (COD)"
                  icon={<Truck className="h-5 w-5" />}
                />
                <PayRow
                  checked={pay === "vnpay"}
                  onChange={() => setPay("vnpay")}
                  title="Ví điện tử VNPAY"
                  icon={<CreditCard className="h-5 w-5" />}
                />
                <PayRow
                  checked={pay === "momo"}
                  onChange={() => setPay("momo")}
                  title="Thanh toán qua MoMo"
                  icon={<Wallet className="h-5 w-5" />}
                />
              </div>
            </Card>
          </section>

          {/* BÊN PHẢI: Danh sách sản phẩm + tóm tắt đơn hàng */}
          <section className="space-y-4">
            <Card>
              {items.length === 0 ? (
                <EmptyCart />
              ) : (
                <ul className="divide-y">
                  {items.map((it) => {
                    // Xử lý URL hình ảnh
                    const imageUrl = it.item.image
                      ? it.item.image.startsWith("http")
                        ? it.item.image
                        : `http://localhost:5000${
                            it.item.image.startsWith("/") ? "" : "/"
                          }${it.item.image}`
                      : "https://via.placeholder.com/80x80?text=No+Image";

                    return (
                      <li
                        key={it.cart_id}
                        className="flex items-center gap-3 py-3"
                      >
                        <Link
                          to={`/san-pham/${it.product_id}`}
                          className="block h-20 w-20 shrink-0 overflow-hidden rounded-lg border"
                        >
                          <img
                            src={imageUrl}
                            alt={it.item.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/80x80?text=No+Image";
                            }}
                          />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/san-pham/${it.product_id}`}
                            className="line-clamp-2 font-semibold hover:underline"
                          >
                            {it.item.name}
                          </Link>
                          <div className="mt-1 text-sm text-neutral-600">
                            Size: {it.size ?? "-"} • Giá:{" "}
                            {formatVnd(it.item.price)}
                          </div>
                          <div className="mt-2 flex items-center gap-3">
                            <Qty
                              qty={it.qty}
                              onDec={() => changeQty(it.cart_id, -1)}
                              onInc={() => changeQty(it.cart_id, +1)}
                            />
                            <button
                              onClick={() => removeItemHandler(it.cart_id)}
                              className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100"
                              title="Xóa sản phẩm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="font-semibold">
                          {formatVnd(it.item.price * it.qty)}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            <Card title="Mã giảm giá">
              <div className="flex gap-2">
                <input
                  placeholder="Nhập mã giảm giá (VD: SEP30, FREESHIP)"
                  className={`${INPUT_CLS} flex-1`}
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                />
                <button
                  onClick={applyVoucher}
                  className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
                >
                  Áp dụng
                </button>
              </div>
              {applied.code && (
                <p className="mt-2 text-sm text-emerald-700">
                  ✅ Đã áp dụng mã <b>{applied.code}</b>
                </p>
              )}
            </Card>

            <Card title="Tóm tắt đơn hàng">
              <div className="space-y-2 text-sm">
                <Row label="Tạm tính" value={formatVnd(subTotal)} />
                <Row
                  label="Phí vận chuyển"
                  value={ship === 0 ? "Miễn phí" : formatVnd(ship)}
                />
                <Row
                  label="Giảm giá"
                  value={discount ? `- ${formatVnd(discount)}` : formatVnd(0)}
                />
                <hr className="my-2" />
                <Row big label="Tổng cộng" value={formatVnd(grand)} />
              </div>
            </Card>
          </section>
        </div>
      </div>

      {/* THANH ĐẶT HÀNG DƯỚI CÙNG */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 lg:px-0">
          <div className="text-sm text-neutral-600">
            {items.length
              ? `${items.length} sản phẩm • ${formatVnd(grand)}`
              : "Giỏ hàng đang trống"}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-neutral-50"
            >
              Tiếp tục mua sắm
            </Link>
            <button
              onClick={placeOrder}
              disabled={!items.length}
              className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====== COMPONENT PHỤ ====== */
function Card({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      {title && <div className="border-b px-4 py-3 font-semibold">{title}</div>}
      <div className="space-y-3 p-4">{children}</div>
    </section>
  );
}

/* ====== Component tăng giảm số lượng ====== */
function Qty({
  qty,
  onDec,
  onInc,
}: {
  qty: number;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="flex items-center rounded-md border border-neutral-300">
      <button
        className="grid h-8 w-8 place-content-center hover:bg-neutral-50 disabled:opacity-50"
        onClick={onDec}
        disabled={qty <= 1}
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        value={qty}
        readOnly
        className="h-8 w-12 border-x border-neutral-300 text-center outline-none"
      />
      <button
        className="grid h-8 w-8 place-content-center hover:bg-neutral-50"
        onClick={onInc}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function PayRow({
  checked,
  onChange,
  title,
  icon,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  icon: ReactNode;
}) {
  return (
    <label
      className={`block cursor-pointer rounded-lg border p-3 transition ${
        checked
          ? "border-black ring-1 ring-black/30"
          : "border-neutral-200 hover:border-neutral-300"
      }`}
    >
      <div className="flex items-center gap-2">
        <input
          type="radio"
          className="accent-black"
          checked={checked}
          onChange={onChange}
        />
        <span className="text-neutral-700">{icon}</span>
        <span className="font-semibold">{title}</span>
      </div>
    </label>
  );
}

function Row({
  label,
  value,
  big,
}: {
  label: string;
  value: string;
  big?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-neutral-600 ${big ? "text-base font-semibold" : ""}`}
      >
        {label}
      </span>
      <span className={`font-semibold ${big ? "text-base" : ""}`}>{value}</span>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="grid h-24 w-24 place-content-center rounded-full bg-amber-50">
        <span className="text-3xl">🛒</span>
      </div>
      <h3 className="text-lg font-semibold">
        Hiện giỏ hàng của bạn không có sản phẩm nào!
      </h3>
      <p className="text-sm text-neutral-600">
        Về trang cửa hàng để chọn mua sản phẩm bạn nhé.
      </p>
      <Link
        to="/"
        className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
      >
        Mua sắm ngay
      </Link>
    </div>
  );
}
