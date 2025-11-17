
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  X,
} from "lucide-react";
import { formatVnd } from "../../../utils/format";
import AdminLayout from "../_Components/AdminLayout";

/* ================= Types ================= */
type OrderStatus =
  | "pending" // Chờ xử lý
  | "processing" // Đang xử lý/đóng gói
  | "shipped" // Đã gửi
  | "delivered" // Đã giao
  | "canceled"; // Đã hủy

type PaymentMethod = "cod" | "momo" | "vnpay";

type OrderItem = {
  sku: string;
  name: string;
  image: string;
  qty: number;
  price: number;
  size?: string;
};

export type Order = {
  id: string; // VD: ORD1023
  customerName: string;
  phone: string;
  address: string;
  method: PaymentMethod; // mock thanh toán
  status: OrderStatus;
  items: OrderItem[];
  note?: string;
  createdAt: string; // ISO datetime
};

type DateRange = "7d" | "30d" | "all";

/* ================= Mocks & helpers ================= */
const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipped", label: "Đã gửi" },
  { value: "delivered", label: "Đã giao" },
  { value: "canceled", label: "Đã hủy" },
];

const METHODS: Record<PaymentMethod, string> = {
  cod: "COD",
  momo: "MoMo",
  vnpay: "VNPAY",
};

const IMG = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop",
];

const NAMES = [
  "Áo thun ICONDENIM ORGNLS",
  "Quần jean Grey Baggy",
  "Áo polo Braided Stripes",
  "Mũ Conqueror Bear",
];

function seedOrders(n = 48): Order[] {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const created = new Date(
      now.getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 28)
    ); // trong 28 ngày
    const itemCount = 1 + (i % 3);
    const items: OrderItem[] = Array.from({ length: itemCount }, (_, j) => {
      const pick = (i + j) % IMG.length;
      return {
        sku: `SKU-${1000 + i}-${j + 1}`,
        name: NAMES[(i + j) % NAMES.length],
        image: IMG[pick],
        qty: 1 + (j % 2),
        price: [299000, 549000, 359000, 249000][(i + j) % 4],
        size: ["S", "M", "L", "XL"][(i + j) % 4],
      };
    });

    const status = (
      [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "canceled",
      ] as OrderStatus[]
    )[i % 5];

    return {
      id: `ORD${1023 + i}`,
      customerName: `Khách ${i + 1}`,
      phone: `09${Math.floor(10000000 + Math.random() * 89999999)}`,
      address: `Số ${i + 10} Đường ABC, Q.${(i % 10) + 1}, TP.HCM`,
      method: (["cod", "momo", "vnpay"] as PaymentMethod[])[i % 3],
      status,
      items,
      note: i % 5 === 0 ? "Giao giờ hành chính" : undefined,
      createdAt: created.toISOString(),
    };
  });
}

function getTotal(o: Order) {
  return o.items.reduce((s, it) => s + it.price * it.qty, 0);
}

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem("admin_orders");
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return parsed as Order[];
    }
  } catch (err) {
    console.warn("[admin_orders] Lỗi đọc localStorage:", err);
  }
  const seeded = seedOrders();
  localStorage.setItem("admin_orders", JSON.stringify(seeded));
  return seeded;
}

function saveOrders(orders: Order[]) {
  localStorage.setItem("admin_orders", JSON.stringify(orders));
}

function withinRange(iso: string, range: DateRange) {
  if (range === "all") return true;
  const days = range === "7d" ? 7 : 30;
  const t = new Date(iso).getTime();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return t >= cutoff;
}

/* ================= Page ================= */
export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(() => loadOrders());

  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [range, setRange] = useState<DateRange>("7d");

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // drawer view
  const [openId, setOpenId] = useState<string | null>(null);

  // derived
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return orders
      .filter((o) => (status === "all" ? true : o.status === status))
      .filter((o) => withinRange(o.createdAt, range))
      .filter((o) => {
        if (!query) return true;
        return (
          o.id.toLowerCase().includes(query) ||
          o.customerName.toLowerCase().includes(query) ||
          o.phone.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [orders, status, range, q]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  // reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setPage(1);
  }, [q, status, range]);

  function updateStatus(id: string, next: OrderStatus) {
    setOrders((prev) => {
      const nextArr = prev.map((o) =>
        o.id === id ? { ...o, status: next } : o
      );
      saveOrders(nextArr);
      return nextArr;
    });
  }

  function removeOrder(id: string) {
    if (!confirm(`Xóa đơn ${id}? (demo)`)) return;
    setOrders((prev) => {
      const nextArr = prev.filter((o) => o.id !== id);
      saveOrders(nextArr);
      return nextArr;
    });
  }

  return (
    <AdminLayout title="Quản lý đơn hàng">
      {/* Filters */}
      <div className="rounded-xl border border-neutral-200 bg-white p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* search */}
          <div className="flex items-stretch overflow-hidden rounded-md border border-neutral-300">
            <span className="grid h-10 w-10 place-content-center text-neutral-500">
              <Search className="h-5 w-5" />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm ID / tên KH / SĐT…"
              className="h-10 w-64 min-w-0 flex-1 px-3 text-sm outline-none"
            />
          </div>

          {/* selects */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm">
              <Filter className="h-4 w-4 text-neutral-500" />
              Bộ lọc
            </span>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus | "all")}
              className="h-10 rounded-md border border-neutral-300 px-3 text-sm outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <select
              value={range}
              onChange={(e) => setRange(e.target.value as DateRange)}
              className="h-10 rounded-md border border-neutral-300 px-3 text-sm outline-none"
            >
              <option value="7d">7 ngày</option>
              <option value="30d">30 ngày</option>
              <option value="all">Toàn bộ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <section className="mt-4 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <Th>#Đơn</Th>
                <Th>Khách hàng</Th>
                <Th>Thanh toán</Th>
                <Th>Tổng</Th>
                <Th>Ngày tạo</Th>
                <Th>Trạng thái</Th>
                <Th className="text-right pr-3">Thao tác</Th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pageItems.map((o) => (
                <tr key={o.id} className="hover:bg-neutral-50/60">
                  <Td>
                    <div className="font-semibold">{o.id}</div>
                    <div className="text-xs text-neutral-500">
                      {o.items.length} SP
                    </div>
                  </Td>
                  <Td>
                    <div className="font-medium">{o.customerName}</div>
                    <div className="text-xs text-neutral-500">{o.phone}</div>
                  </Td>
                  <Td>{METHODS[o.method]}</Td>
                  <Td className="font-semibold">{formatVnd(getTotal(o))}</Td>
                  <Td>
                    {new Date(o.createdAt).toLocaleString("vi-VN", {
                      hour12: false,
                    })}
                  </Td>
                  <Td>
                    <StatusBadge value={o.status} />
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <StatusSelect
                        value={o.status}
                        onChange={(s) => updateStatus(o.id, s)}
                      />
                      <button
                        className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100"
                        title="Xem chi tiết"
                        onClick={() => setOpenId(o.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-md p-2 text-red-600 hover:bg-red-50"
                        title="Xóa"
                        onClick={() => removeOrder(o.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}

              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-600">
                    Không có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-3 py-2 text-sm">
          <div className="text-neutral-600">
            Hiển thị {pageItems.length} / {filtered.length} đơn
          </div>
          <div className="flex items-center gap-1">
            <button
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 disabled:opacity-40"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" /> Trước
            </button>
            <span className="px-2">
              {page} / {pageCount}
            </span>
            <button
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 disabled:opacity-40"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
            >
              Sau <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Drawer chi tiết */}
      <OrderDrawer
        order={orders.find((o) => o.id === openId) || null}
        onClose={() => setOpenId(null)}
      />
    </AdminLayout>
  );
}

/* ================= Table Subcomponents ================= */
function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`px-3 py-2 text-left text-xs font-semibold ${className}`}>
      {children}
    </th>
  );
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-3 py-3 align-top ${className}`}>{children}</td>;
}

function StatusBadge({ value }: { value: OrderStatus }) {
  const map: Record<OrderStatus, string> = {
    pending: "bg-amber-50 text-amber-700",
    processing: "bg-sky-50 text-sky-700",
    shipped: "bg-indigo-50 text-indigo-700",
    delivered: "bg-emerald-50 text-emerald-700",
    canceled: "bg-red-50 text-red-700",
  };
  const label = STATUSES.find((s) => s.value === value)?.label ?? value;
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${map[value]}`}
    >
      {label}
    </span>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: OrderStatus;
  onChange: (s: OrderStatus) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      className="rounded-md border border-neutral-300 px-2 py-1 text-xs outline-none hover:border-neutral-400"
      title="Đổi trạng thái"
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

/* ================= Drawer ================= */
function OrderDrawer({
  order,
  onClose,
}: {
  order: Order | null;
  onClose: () => void;
}) {
  return (
    <div
      className={[
        "fixed inset-0 z-50",
        order ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!order}
    >
      {/* overlay */}
      <div
        className={[
          "absolute inset-0 bg-black/40 transition-opacity",
          order ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      {/* panel */}
      <aside
        className={[
          "absolute right-0 top-0 h-full w-full max-w-lg translate-x-0 rounded-l-2xl bg-white shadow-xl transition-transform",
          order ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Chi tiết đơn hàng"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-extrabold">
            Chi tiết {order?.id ?? ""}
          </h3>
          <button
            onClick={onClose}
            className="rounded p-2 text-neutral-600 hover:bg-neutral-100"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {order ? (
          <div className="space-y-4 overflow-y-auto px-4 py-4">
            {/* Info */}
            <div className="rounded-lg border p-3">
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <Row label="Khách hàng" value={order.customerName} />
                <Row label="SĐT" value={order.phone} />
                <Row label="Địa chỉ" value={order.address} />
                <Row label="Thanh toán" value={METHODS[order.method]} />
                <Row
                  label="Ngày tạo"
                  value={new Date(order.createdAt).toLocaleString("vi-VN", {
                    hour12: false,
                  })}
                />
                <Row
                  label="Trạng thái"
                  value={<StatusBadge value={order.status} />}
                />
                {order.note ? <Row label="Ghi chú" value={order.note} /> : null}
              </div>
            </div>

            {/* Items */}
            <div className="rounded-lg border">
              <div className="border-b px-3 py-2 text-sm font-semibold">
                Sản phẩm ({order.items.length})
              </div>
              <ul className="divide-y">
                {order.items.map((it) => (
                  <li key={it.sku} className="flex items-center gap-3 p-3">
                    <div className="h-16 w-16 overflow-hidden rounded border">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">
                        {it.name}
                      </div>
                      <div className="text-xs text-neutral-600">
                        SKU: {it.sku}
                        {it.size ? ` • Size: ${it.size}` : ""}
                      </div>
                      <div className="mt-1 text-sm">
                        x{it.qty} • {formatVnd(it.price)}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      {formatVnd(it.price * it.qty)}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t px-3 py-2 text-sm">
                <span className="text-neutral-600">Tổng</span>
                <span className="font-semibold">
                  {formatVnd(getTotal(order))}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="min-w-28 text-neutral-500">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
