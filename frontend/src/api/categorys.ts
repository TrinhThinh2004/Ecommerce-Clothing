import axiosInstance from "./client";
import type { Category } from "../types/categorys.ts";

const BASE_URL = "/api/v1/categorys";

// Fetch a flat list of categories from backend
export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await axiosInstance.get(`${BASE_URL}`);
    // backend returns an array directly
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Lấy 1 danh mục theo ID (kèm danh sách sản phẩm)
 */
export async function fetchCategoryById(id: number | string): Promise<Category | null> {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/${id}`);
    return res.data ?? null;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    return null;
  }
}

/**
 * Tạo mới danh mục
 */
export async function createCategory(payload: Partial<Category>): Promise<Category> {
  try {
    const res = await axiosInstance.post(BASE_URL, payload);
    return res.data?.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

/**
 * Cập nhật danh mục
 */
export async function updateCategory(id: number | string, payload: Partial<Category>): Promise<Category> {
  try {
    const res = await axiosInstance.put(`${BASE_URL}/${id}`, payload);
    return res.data?.data;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw error;
  }
}

/**
 * Xóa danh mục
 */
export async function deleteCategory(id: number | string): Promise<boolean> {
  try {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    return false;
  }
}
