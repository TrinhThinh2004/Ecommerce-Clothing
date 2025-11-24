import { useEffect, useState } from "react";
import { fetchOrders, fetchOrderById } from "../../api/order";
import { Order } from "../../types/order";
import { formatVnd } from "../../utils/format";
import { Loader2 } from "lucide-react";

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const load = async () => {
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
    load();
  }, []);

  const handleViewDetail = async (orderId: number) => {
    const detail = await fetchOrderById(orderId);
    setSelectedOrder(detail);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Lịch sử đơn hàng</h1>


      <div className="space-y-4">
        {orders.length === 0 ? (
          <p>Không có đơn hàng nào.</p>
        ) : (
          orders.map((o) => (
            <div
              key={o.order_id}
              className="border rounded-lg p-4 shadow hover:bg-gray-50 transition cursor-pointer"
              onClick={() => handleViewDetail(o.order_id)}
            >
              <div className="flex justify-between">
                <p className="font-semibold">Mã đơn: #{o.order_id}</p>
                <p className="text-blue-600 font-semibold">
                  {formatVnd(o.total_price)}
                </p>
              </div>

              <p className="text-sm text-gray-600">
                Trạng thái: <span className="font-medium">{o.status}</span>
              </p>

              <p className="text-sm text-gray-600">
                Ngày tạo: {o.created_at ? new Date(o.created_at).toLocaleString() : ""}
              </p>
            </div>
          ))
        )}
      </div>

      {selectedOrder && (
        <div className="mt-8 border rounded-lg p-5 shadow bg-white">
          <h2 className="text-lg font-bold mb-2">
            Chi tiết đơn #{selectedOrder.order_id}
          </h2>

          <p className="mb-1">Số tiền: {formatVnd(selectedOrder.total_price)}</p>
          <p className="mb-1">Trạng thái: {selectedOrder.status}</p>
          <p className="mb-3">
            Ngày tạo:{" "}
            {selectedOrder.created_at
              ? new Date(selectedOrder.created_at).toLocaleString()
              : ""}
          </p>

          <h3 className="font-semibold mb-2">Sản phẩm:</h3>
          <ul className="space-y-3">
            {selectedOrder.items?.map((item) => (
              <li
                key={item.order_item_id}
                className="border p-3 rounded bg-gray-50"
              >
                <p className="font-medium">{item.product?.name}</p>
                <p>Size: {item.size}</p>
                <p>Số lượng: {item.quantity}</p>
                <p>Giá: {formatVnd(item.unit_price)}</p>
                <p>Tổng: {formatVnd(item.subtotal)}</p>
              </li>
            ))}
          </ul>

          <button
            className="mt-4 px-4 py-2 bg-gray-300 rounded"
            onClick={() => setSelectedOrder(null)}
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
}
