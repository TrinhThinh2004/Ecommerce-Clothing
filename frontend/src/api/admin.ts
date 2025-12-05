// src/api/admin.ts
import axiosInstance from "./client";

/* ================= Types ================= */
export interface AdminCustomer {
  user_id: number;
  username: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | null;
  role: "admin" | "user";
  created_at: string;
  total_orders?: number;
  total_spent?: number;
}

export interface AdminOrder {
  order_id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
  ward?: string;
  note?: string;
  voucher_code?: string;
  discount_amount: number;
  shipping_fee: number;
  total_price: number;
  payment_method: "cod" | "vnpay" | "momo";
  payment_status: "pending" | "paid" | "failed";
  status: "pending" | "processing" | "shipping" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  items?: AdminOrderItem[];
  user?: {
    username: string;
    email: string;
  };
}

export interface AdminOrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  size?: string;
  unit_price: number;
  subtotal: number;
  product?: {
    product_id: number;
    name: string;
    image_url?: string;
    sku?: string;
  };
}

const getToken = (): string => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Chưa đăng nhập");
  return token;
};

/* ================= CUSTOMERS API ================= */

/** Lấy danh sách tất cả khách hàng (admin only) */
export const fetchAllCustomers = async (): Promise<AdminCustomer[]> => {
  try {
    const token = getToken();
    const res = await axiosInstance.get("/api/v1/admin/customers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data || [];
  } catch (err) {
    console.error("fetchAllCustomers error:", err);
    throw err;
  }
};

/** Cập nhật thông tin khách hàng */
export const updateCustomer = async (
  userId: number,
  data: Partial<AdminCustomer>
): Promise<boolean> => {
  try {
    const token = getToken();
    await axiosInstance.patch(`/api/v1/admin/customers/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (err) {
    console.error("updateCustomer error:", err);
    throw err;
  }
};

/** Xóa khách hàng */
export const deleteCustomer = async (userId: number): Promise<boolean> => {
  try {
    const token = getToken();
    await axiosInstance.delete(`/api/v1/admin/customers/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (err) {
    console.error("deleteCustomer error:", err);
    throw err;
  }
};

/** Block/Unblock khách hàng */
export const toggleCustomerStatus = async (
  userId: number,
  active: boolean
): Promise<boolean> => {
  try {
    const token = getToken();
    await axiosInstance.patch(
      `/api/v1/admin/customers/${userId}/status`,
      { active },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return true;
  } catch (err) {
    console.error("toggleCustomerStatus error:", err);
    throw err;
  }
};

/* ================= ORDERS API ================= */

/** Lấy danh sách tất cả đơn hàng (admin only) */
export const fetchAllOrders = async (): Promise<AdminOrder[]> => {
  try {
    const token = getToken();
    const res = await axiosInstance.get("/api/v1/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data || [];
  } catch (err) {
    console.error("fetchAllOrders error:", err);
    throw err;
  }
};

/** Lấy chi tiết đơn hàng với order items */
export const fetchOrderDetail = async (orderId: number): Promise<AdminOrder | null> => {
  try {
    const token = getToken();
    const res = await axiosInstance.get(`/api/v1/admin/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  } catch (err) {
    console.error("fetchOrderDetail error:", err);
    return null;
  }
};

/** Cập nhật trạng thái đơn hàng */
export const updateOrderStatus = async (
  orderId: number,
  status: AdminOrder["status"]
): Promise<boolean> => {
  try {
    const token = getToken();
    await axiosInstance.patch(
      `/api/v1/admin/orders/${orderId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return true;
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    throw err;
  }
};

/** Xóa đơn hàng */
export const deleteOrder = async (orderId: number): Promise<boolean> => {
  try {
    const token = getToken();
    await axiosInstance.delete(`/api/v1/admin/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (err) {
    console.error("deleteOrder error:", err);
    throw err;
  }
};