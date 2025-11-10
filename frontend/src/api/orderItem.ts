import axiosInstance from "./client";
import { OrderItem, OrderItemResponse } from "../types/orderItem";

/** Lấy token từ localStorage, nếu không có thì throw lỗi */
const getToken = (): string => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Chưa đăng nhập");
  return token;
};

/** Chuẩn hóa dữ liệu từ API luôn trả về mảng */
const normalizeData = (data: OrderItem | OrderItem[] | null | undefined): OrderItem[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

/** Lấy tất cả order items */
export const fetchOrderItems = async (): Promise<OrderItem[]> => {
  try {
    const token = getToken();
    const res = await axiosInstance.get<OrderItemResponse>("/api/v1/order-items", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("fetchOrderItems response:", res.data);
    return normalizeData(res.data.data);
  } catch (err) {
    console.error("fetchOrderItems error:", err);
    return [];
  }
};

/** Lấy chi tiết order item theo ID */
export const fetchOrderItemById = async (id: number): Promise<OrderItem | null> => {
  try {
    const token = getToken();
    const res = await axiosInstance.get<OrderItemResponse>(`/api/v1/order-items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`fetchOrderItemById(${id}) response:`, res.data);
    const data = normalizeData(res.data.data);
    return data[0] || null;
  } catch (err) {
    console.error(`fetchOrderItemById(${id}) error:`, err);
    return null;
  }
};

/** Cập nhật order item */
export const updateOrderItem = async (
  id: number,
  payload: Partial<OrderItem>
): Promise<boolean> => {
  try {
    const token = getToken();
    const res = await axiosInstance.patch<OrderItemResponse>(`/api/v1/order-items/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`updateOrderItem(${id}) response:`, res.data);
    return res.data.success ?? false;
  } catch (err) {
    console.error(`updateOrderItem(${id}) error:`, err);
    return false;
  }
};

/** Xóa order item */
export const deleteOrderItem = async (id: number): Promise<boolean> => {
  try {
    const token = getToken();
    const res = await axiosInstance.delete<OrderItemResponse>(`/api/v1/order-items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`deleteOrderItem(${id}) response:`, res.data);
    return res.data.success ?? false;
  } catch (err) {
    console.error(`deleteOrderItem(${id}) error:`, err);
    return false;
  }
};
