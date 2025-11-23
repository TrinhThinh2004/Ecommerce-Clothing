// src/pages/Admin/AdminOrders.tsx
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
import {
  fetchAllOrders,
  fetchOrderDetail,
  updateOrderStatus as apiUpdateOrderStatus,
  deleteOrder as apiDeleteOrder,
  type AdminOrder,
} from "../../../api/admin";
import { toast } from "react-toastify";

type OrderStatus = AdminOrder["status"];
type PaymentMethod = AdminOrder["payment_method"];
type DateRange = "7d" | "30d" | "all";

const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

const METHODS: Record<PaymentMethod, string> = {
  cod: "COD",
  momo: "MoMo",
  vnpay: "VNPAY",
};

const PAYMENT_STATUS_LABELS: Record<AdminOrder["payment_status"], string> = {
  pending: "Chưa thanh toán",
  paid: "Đã thanh toán",
  failed: "Thanh toán thất bại",
};

function withinRange(iso: string, range: DateRange) {
  if (range === "all") return true;
  const days = range === "7d" ? 7 : 30;
  const t = new Date(iso).getTime();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return t >= cutoff;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [range, setRange] = useState<DateRange>("7d");

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // drawer view
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Load orders
  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Load order detail when drawer opens
  useEffect(() => {
    if (openId) {
      setLoadingDetail(true);
      fetchOrderDetail(openId)
        .then((data) => {
          setSelectedOrder(data);
        })
        .catch((err) => {
          console.error("Error loading order detail:", err);
          toast.error("Không thể tải chi tiết đơn hàng");
        })
        .finally(() => {
          setLoadingDetail(false);
        });
    } else {
      setSelectedOrder(null);
    }
  }, [openId]);

  // derived
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return orders
      .filter((o) => (status === "all" ? true : o.status === status))
      .filter((o) => withinRange(o.created_at, range))
      .filter((o) => {
        if (!query) return true;
        return (
          String(o.order_id).includes(query) ||
          o.full_name.toLowerCase().includes(query) ||
          o.phone.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
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

  async function updateStatus(id: number, next: OrderStatus) {
    try {
      await apiUpdateOrderStatus(id, next);
      toast.success("Đã cập nhật trạng thái đơn hàng");
      await loadOrders();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Không thể cập nhật trạng thái");
    }
  }

  async function removeOrder(id: number) {
    if (!window.confirm(`Xóa đơn #${id}?`)) return;
    try {
      await apiDeleteOrder(id);
      toast.success("Đã xóa đơn hàng");
      await loadOrders();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Không thể xóa đơn hàng");
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Quản lý đơn hàng">
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
          <table className="min-w-[920px] w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <Th>#Đơn</Th>
                <Th>Khách hàng</Th>
                <Th>Thanh toán</Th>
                <Th>Tổng</Th>
                <Th>Ngày tạo</Th>
                <Th>Trạng thái</Th>
                <Th>TT thanh toán</Th>
                <Th className="text-right pr-3">Thao tác</Th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pageItems.map((o) => (
                <tr key={o.order_id} className="hover:bg-neutral-50/60">
                  <Td>
                    <div className="font-semibold">#{o.order_id}</div>
                    <div className="text-xs text-neutral-500">
                      {o.items?.length || 0} SP
                    </div>
                  </Td>
                  <Td>
                    <div className="font-medium">{o.full_name}</div>
                    <div className="text-xs text-neutral-500">{o.phone}</div>
                  </Td>
                  <Td>{METHODS[o.payment_method]}</Td>
                  <Td className="font-semibold">{formatVnd(o.total_price)}</Td>
                  <Td>
                    {new Date(o.created_at).toLocaleString("vi-VN", {
                      hour12: false,
                    })}
                  </Td>
                  <Td>
                    <StatusBadge value={o.status} />
                  </Td>
                  <Td>
                    <PaymentStatusBadge value={o.payment_status} />
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <StatusSelect
                        value={o.status}
                        onChange={(s) => updateStatus(o.order_id, s)}
                      />
                      <button
                        className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100"
                        title="Xem chi tiết"
                        onClick={() => setOpenId(o.order_id)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-md p-2 text-red-600 hover:bg-red-50"
                        title="Xóa"
                        onClick={() => removeOrder(o.order_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}

              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-neutral-600">
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
        order={selectedOrder}
        loading={loadingDetail}
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
    shipping: "bg-indigo-50 text-indigo-700",
    completed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-700",
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

function PaymentStatusBadge({ value }: { value: AdminOrder["payment_status"] }) {
  const map: Record<AdminOrder["payment_status"], string> = {
    pending: "bg-amber-50 text-amber-700",
    paid: "bg-emerald-50 text-emerald-700",
    failed: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${map[value]}`}
    >
      {PAYMENT_STATUS_LABELS[value]}
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
  loading,
  onClose,
}: {
  order: AdminOrder | null;
  loading: boolean;
  onClose: () => void;
}) {
  const isOpen = order !== null || loading;

  return (
    <div
      className={[
        "fixed inset-0 z-50",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!isOpen}
    >
      {/* overlay */}
      <div
        className={[
          "absolute inset-0 bg-black/40 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      {/* panel */}
      <aside
        className={[
          "absolute right-0 top-0 h-full w-full max-w-lg translate-x-0 rounded-l-2xl bg-white shadow-xl transition-transform",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Chi tiết đơn hàng"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-extrabold">
            Chi tiết #{order?.order_id ?? ""}
          </h3>
          <button
            onClick={onClose}
            className="rounded p-2 text-neutral-600 hover:bg-neutral-100"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : order ? (
          <div className="space-y-4 overflow-y-auto px-4 py-4 h-[calc(100vh-80px)]">
            {/* Info */}
            <div className="rounded-lg border p-3">
              <div className="grid gap-2 text-sm">
                <Row label="Khách hàng" value={order.full_name} />
                <Row label="SĐT" value={order.phone} />
                <Row label="Email" value={order.user?.email || "-"} />
                <Row
                  label="Địa chỉ"
                  value={`${order.address}, ${order.ward ? order.ward + ", " : ""}${
                    order.district ? order.district + ", " : ""
                  }${order.city}`}
                />
                <Row label="Thanh toán" value={METHODS[order.payment_method]} />
                <Row
                  label="TT thanh toán"
                  value={<PaymentStatusBadge value={order.payment_status} />}
                />
                <Row
                  label="Ngày tạo"
                  value={new Date(order.created_at).toLocaleString("vi-VN", {
                    hour12: false,
                  })}
                />
                <Row label="Trạng thái" value={<StatusBadge value={order.status} />} />
                {order.note ? <Row label="Ghi chú" value={order.note} /> : null}
                {order.voucher_code ? (
                  <Row label="Mã giảm giá" value={order.voucher_code} />
                ) : null}
              </div>
            </div>

            {/* Items */}
            <div className="rounded-lg border">
              <div className="border-b px-3 py-2 text-sm font-semibold">
                Sản phẩm ({order.items?.length || 0})
              </div>
              <ul className="divide-y">
                {order.items?.map((it) => (
                  <li key={it.order_item_id} className="flex items-center gap-3 p-3">
                    <div className="h-16 w-16 overflow-hidden rounded border">
                      <img
                        src={it.product?.image || "/no-image.svg"}
                        alt={it.product?.name || "Product"}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/no-image.svg";
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">
                        {it.product?.name || `Product #${it.product_id}`}
                      </div>
                      <div className="text-xs text-neutral-600">
                        SKU: {it.product?.sku || "-"}
                        {it.size ? ` • Size: ${it.size}` : ""}
                      </div>
                      <div className="mt-1 text-sm">
                        x{it.quantity} • {formatVnd(it.unit_price)}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      {formatVnd(it.subtotal)}
                    </div>
                  </li>
                ))}

                {(!order.items || order.items.length === 0) && (
                  <li className="p-4 text-center text-sm text-neutral-500">
                    Không có sản phẩm
                  </li>
                )}
              </ul>

              {/* Summary */}
              <div className="border-t p-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Tạm tính:</span>
                  <span>
                    {formatVnd(
                      order.total_price - order.shipping_fee + order.discount_amount
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Phí vận chuyển:</span>
                  <span>{formatVnd(order.shipping_fee)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Giảm giá:</span>
                    <span>- {formatVnd(order.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>Tổng cộng:</span>
                  <span>{formatVnd(order.total_price)}</span>
                </div>
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
      <span className="min-w-32 text-neutral-500">{label}:</span>
      <span className="font-medium flex-1">{value}</span>
    </div>
  );
}