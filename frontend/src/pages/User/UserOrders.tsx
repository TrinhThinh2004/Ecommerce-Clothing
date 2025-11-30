// src/pages/User/UserOrders.tsx
import { useEffect, useState } from "react";
import { fetchOrders, fetchOrderById, updateOrderStatus } from "../../api/order";
import { Order } from "../../types/order";
import { formatVnd } from "../../utils/format";
import { 
  Loader2, Package, Truck, CheckCircle, XCircle, 
  Clock, Eye, X 
} from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    label: "Chờ xử lý",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  processing: {
    label: "Đang xử lý",
    icon: Package,
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  shipping: {
    label: "Đang giao",
    icon: Truck,
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  completed: {
    label: "Hoàn thành",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700 border-green-200",
  },
  cancelled: {
    label: "Đã hủy",
    icon: XCircle,
    color: "bg-red-100 text-red-700 border-red-200",
  },
};

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const userId = Number(localStorage.getItem("userId"));
      const res = await fetchOrders(userId);
      setOrders(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (orderId: number) => {
    try {
      const detail = await fetchOrderById(orderId);
      setSelectedOrder(detail);
    } catch (error) {
      console.error("Error fetching order detail:", error);
    }
  };

  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const handleCancel = async (orderId: number) => {
    const ok = window.confirm("Bạn có chắc muốn hủy đơn hàng này không?");
    if (!ok) return;
    try {
      setCancellingId(orderId);
      const success = await updateOrderStatus(orderId, "cancelled");
      if (success) {
        // reload orders
        await loadOrders();
      } else {
        console.error("Hủy đơn thất bại");
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
    } finally {
      setCancellingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true;
    return order.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-neutral-600" />
        <span className="ml-3 text-neutral-600">Đang tải đơn hàng...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-800">Đơn Hàng Của Tôi</h2>
          <p className="text-sm text-neutral-600 mt-1">
            Quản lý và theo dõi đơn hàng của bạn
          </p>
        </div>
        <div className="text-sm">
          <span className="font-semibold">{orders.length}</span> đơn hàng
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            statusFilter === "all"
              ? "bg-black text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          Tất cả ({orders.length})
        </button>

        {Object.entries(STATUS_CONFIG).map(([status, config]) => {
          const count = orders.filter((o) => o.status === status).length;
          const Icon = config.icon;

          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                statusFilter === status
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 grid h-20 w-20 place-content-center rounded-full bg-neutral-100">
              <Package className="h-10 w-10 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800">
              Không có đơn hàng nào
            </h3>
            <p className="text-sm text-neutral-600 mt-2">
              {statusFilter === "all"
                ? "Bạn chưa có đơn hàng nào"
                : `Không có đơn hàng ${STATUS_CONFIG[statusFilter as keyof typeof STATUS_CONFIG]?.label.toLowerCase()}`}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
            const StatusIcon = statusConfig?.icon || Clock;

            return (
              <div
                key={order.order_id}
                className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-content-center rounded-lg bg-neutral-100">
                      <StatusIcon className="h-6 w-6 text-neutral-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-800">
                        Đơn hàng #{order.order_id}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString("vi-VN")
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusConfig?.color}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusConfig?.label}
                    </span>

                    <button
                      onClick={() => handleViewDetail(order.order_id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-neutral-50"
                    >
                      <Eye className="h-4 w-4" />
                      Chi tiết
                    </button>
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancel(order.order_id)}
                        disabled={cancellingId === order.order_id}
                        className={`inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-red-50 text-red-600 ${
                          cancellingId === order.order_id ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      >
                        {cancellingId === order.order_id ? (
                          <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Info */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="text-sm">
                    <span className="text-neutral-600">Tổng tiền:</span>
                    <span className="ml-2 font-bold text-black">
                      {formatVnd(order.total_price)}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="text-neutral-600">Thanh toán:</span>
                    <span className="ml-2 font-semibold text-neutral-800">
                      {order.payment_method === "cod"
                        ? "COD"
                        : order.payment_method === "vnpay"
                        ? "VNPAY"
                        : "MoMo"}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="text-neutral-600">Người nhận:</span>
                    <span className="ml-2 font-semibold text-neutral-800">
                      {order.full_name}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="text-neutral-600">Điện thoại:</span>
                    <span className="ml-2 font-semibold text-neutral-800">
                      {order.phone}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4 z-10">
              <div>
                <h3 className="text-lg font-bold text-neutral-800">
                  Chi tiết đơn hàng #{selectedOrder.order_id}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {selectedOrder.created_at
                    ? new Date(selectedOrder.created_at).toLocaleString("vi-VN")
                    : ""}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="rounded-lg bg-neutral-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-700">
                    Trạng thái
                  </span>
                  {(() => {
                    const statusConfig =
                      STATUS_CONFIG[selectedOrder.status as keyof typeof STATUS_CONFIG];
                    const StatusIcon = statusConfig?.icon || Clock;
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusConfig?.color}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusConfig?.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Shipping Info */}
              <div>
                <h4 className="mb-3 font-semibold text-neutral-800">
                  Thông tin giao hàng
                </h4>
                <div className="rounded-lg border border-neutral-200 p-4 space-y-2 text-sm">
                  <p>
                    <span className="text-neutral-600">Người nhận:</span>
                    <span className="ml-2 font-semibold">
                      {selectedOrder.full_name}
                    </span>
                  </p>
                  <p>
                    <span className="text-neutral-600">Điện thoại:</span>
                    <span className="ml-2 font-semibold">
                      {selectedOrder.phone}
                    </span>
                  </p>
                  <p>
                    <span className="text-neutral-600">Địa chỉ:</span>
                    <span className="ml-2">
                      {selectedOrder.address}, {selectedOrder.city}
                    </span>
                  </p>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="mb-3 font-semibold text-neutral-800">
                  Sản phẩm ({selectedOrder.items?.length || 0})
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={item.order_item_id}
                      className="flex items-center gap-4 rounded-lg border border-neutral-200 p-4"
                    >
                      <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-neutral-100" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-800 truncate">
                          {item.product?.name}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Size: {item.size} • Số lượng: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-neutral-800">
                          {formatVnd(item.subtotal)}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {formatVnd(item.unit_price)} x {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="rounded-lg bg-neutral-50 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Tạm tính</span>
                  <span>{formatVnd(selectedOrder.total_price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Phí vận chuyển</span>
                  <span>
                    {formatVnd(selectedOrder.shipping_fee || 0)}
                  </span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{formatVnd(selectedOrder.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 text-base font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-black">
                    {formatVnd(selectedOrder.total_price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 border-t bg-white px-6 py-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full rounded-lg bg-neutral-800 px-6 py-3 font-semibold text-white hover:bg-black"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}