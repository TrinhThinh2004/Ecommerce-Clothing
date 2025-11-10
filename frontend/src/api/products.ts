import axiosInstance from "axios";
import type { Product } from "../types/product";

const API_URL = import.meta.env.VITE_API_URL;

///Lấy tất cả sản phẩm và xáo trộn
export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await axiosInstance.get(`${API_URL}/api/v1/products`);
    console.log("API trả về:", res.data);

    // Nếu API trả về { data: [...] } hoặc trả về mảng trực tiếp
    const data: Product[] = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data.data)
      ? res.data.data
      : [];

    //Xáo trộn mảng sản phẩm ngẫu nhiên 
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }

    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Tạo mới sản phẩm
export async function createProduct(
  payload: Partial<Product> | FormData
): Promise<Product> {
  try {
    let res;
    if (payload instanceof FormData) {
      res = await axiosInstance.post(`${API_URL}/api/v1/products`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      res = await axiosInstance.post(`${API_URL}/api/v1/products`, payload);
    }
    return res.data?.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

// Cập nhật sản phẩm
export async function updateProduct(
  id: number | string,
  payload: Partial<Product> | FormData
): Promise<Product> {
  try {
    let res;
    if (payload instanceof FormData) {
      res = await axiosInstance.put(
        `${API_URL}/api/v1/products/${id}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } else {
      res = await axiosInstance.put(
        `${API_URL}/api/v1/products/${id}`,
        payload
      );
    }
    return res.data?.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
}

// Xóa sản phẩm
export async function deleteProduct(id: number | string): Promise<boolean> {
  try {
    await axiosInstance.delete(`${API_URL}/api/v1/products/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    return false;
  }
}
