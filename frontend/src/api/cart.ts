// src/api/cart.ts
import axiosInstance from "./client";

/* ========= Types ========= */
export type ProductInfo = {
  product_id: number;
  name: string;
  image_url?: string;
  price?: number;
};

export type CartItem = {
  cart_id: number;
  quantity: number;
  price_snapshot: number;
  size?: string | null;
  product?: ProductInfo; // Thông tin sản phẩm đầy đủ
};

export type CartResponse = {
  success: boolean;
  cart?: CartItem[];
  item?: CartItem;
  message?: string;
};

/* ========= Helper: Lấy token đăng nhập ========= */
const getToken = (): string => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Chưa đăng nhập");
  return token;
};

/* ========= LocalCartItem cho frontend ========= */
export type LocalCartItem = {
  cart_id: number;
  product_id: number;
  qty: number;
  size?: string;
  item: {
    product_id: number;
    name: string;
    image?: string;
    price: number;
  };
};

export const mapCartItem = (it: CartItem): LocalCartItem => {
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:5000";
  const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");

  const rawImage =
    it.product?.image_url ?? (it.product as { image?: string })?.image ?? "";

  const imageUrl =
    rawImage && !rawImage.startsWith("http")
      ? `${normalizedBaseUrl}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
      : rawImage;

  return {
    cart_id: it.cart_id,
    product_id: it.product?.product_id ?? 0,
    qty: it.quantity,
    size: it.size ?? undefined,
    item: {
      product_id: it.product?.product_id ?? 0,
      name: it.product?.name ?? "Unknown",
      image: imageUrl,
      price: it.price_snapshot,
    },
  };
};

/* ========= API: Lấy danh sách giỏ hàng ========= */
export const fetchCart = async (): Promise<CartItem[]> => {
  try {
    const token = getToken();
    const res = await axiosInstance.get<CartResponse>("/api/v1/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.cart || [];
  } catch (err) {
    console.error("fetchCart error:", err);
    return [];
  }
};

/* ========= API: Thêm sản phẩm vào giỏ ========= */
export const addToCart = async (
  product_id: number,
  quantity: number = 1,
  size?: string
): Promise<CartItem | null> => {
  try {
    const token = getToken();
    const res = await axiosInstance.post<CartResponse>(
      "/api/v1/cart",
      { product_id, quantity, size },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.data.success) return null;
    return res.data.item || null;
  } catch (err) {
    console.error("addToCart error:", err);
    throw err;
  }
};

/* ========= API: Cập nhật số lượng ========= */
export const updateCartItem = async (
  cart_id: number,
  quantity: number
): Promise<CartItem | null> => {
  try {
    const token = getToken();
    const res = await axiosInstance.patch<CartResponse>(
      `/api/v1/cart/${cart_id}`,
      { quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.data.success) return null;
    return res.data.item || null;
  } catch (err) {
    console.error("updateCartItem error:", err);
    return null;
  }
};

/* ========= API: Xoá sản phẩm khỏi giỏ ========= */
export const removeCartItem = async (cart_id: number): Promise<boolean> => {
  try {
    const token = getToken();
    const res = await axiosInstance.delete<CartResponse>(
      `/api/v1/cart/${cart_id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data?.success ?? false;
  } catch (err) {
    console.error("removeCartItem error:", err);
    return false;
  }
};

export const clearCart = async (): Promise<boolean> => {
  try {
    const token = getToken();
    const res = await axiosInstance.delete<CartResponse>("/api/v1/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("🗑️ Clear cart response:", res.data);
    return res.data.success ?? false;
  } catch (err) {
    console.error("clearCart error:", err);
    return false;
  }
};
