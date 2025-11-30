import axiosInstance from "./client";
import { Order, OrderInput, OrderResponse } from "../types/order";

const getToken = (): string => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Chưa đăng nhập");
  return token;
};

/** Tạo đơn hàng*/
export const createOrder = async (data: OrderInput): Promise<Order | null> => {
  try {
    const token = getToken();
    const res = await axiosInstance.post<OrderResponse>("/api/v1/orders", data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success === false) {
      console.error("createOrder failed:", res.data.message);
      return null;
    }

    return res.data.data as Order;
  } catch (err) {
    console.error("createOrder error:", err);
    throw err;
  }
};

/** Lấy danh sách đơn hàng (có thể lọc theo user_id)*/
export const fetchOrders = async (user_id?: number): Promise<Order[]> => {
  try {
    const token = getToken();
    const params = user_id ? { user_id } : undefined;
    const res = await axiosInstance.get<OrderResponse>("/api/v1/orders", {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return (res.data.data as Order[]) || [];
  } catch (err) {
    console.error("fetchOrders error:", err);
    return [];
  }
};

/**
  Lấy chi tiết đơn hàng
 */
export const fetchOrderById = async (order_id: number): Promise<Order | null> => {
  try {
    const token = getToken();
    const res = await axiosInstance.get<OrderResponse>(
      `/api/v1/orders/${order_id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.data as Order;
  } catch (err) {
    console.error("fetchOrderById error:", err);
    return null;
  }
};

/**
 Cập nhật trạng thái đơn hàng
 */
export const updateOrderStatus = async (
  order_id: number,
  status: string
): Promise<boolean> => {
  try {
    const token = getToken();
    const res = await axiosInstance.patch<OrderResponse>(
      `/api/v1/orders/${order_id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (typeof res.data.success === "boolean") return res.data.success;
    return res.status >= 200 && res.status < 300;
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    return false;
  }
};

/**
  Xóa đơn hàng
 */
export const deleteOrder = async (order_id: number): Promise<boolean> => {
  try {
    const token = getToken();
    const res = await axiosInstance.delete<OrderResponse>(
      `/api/v1/orders/${order_id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.success ?? true;
  } catch (err) {
    console.error("deleteOrder error:", err);
    return false;
  }
};
