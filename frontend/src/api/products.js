import axiosInsance from "axios";
const API_URL = import.meta.env.VITE_API_URL;
// Lấy tất cả sản phẩm
export async function fetchProducts() {
    try {
        const res = await axiosInsance.get(`${API_URL}/api/v1/products/get-all`);
        console.log("API products:", res.data.data);
        return Array.isArray(res.data.data) ? res.data.data : [];
    }
    catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}
// Lấy 1 sản phẩm theo id
export async function fetchProductById(id) {
    try {
        const res = await axiosInsance.get(`${API_URL}/api/v1/products/${id}`);
        return res.data?.data ?? null;
    }
    catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
}
// Tạo mới sản phẩm
export async function createProduct(payload) {
    try {
        let res;
        if (payload instanceof FormData) {
            res = await axiosInsance.post(`${API_URL}/api/v1/products`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
        else {
            res = await axiosInsance.post(`${API_URL}/api/v1/products`, payload);
        }
        return res.data?.data;
    }
    catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}
// Cập nhật sản phẩm
export async function updateProduct(id, payload) {
    try {
        let res;
        if (payload instanceof FormData) {
            res = await axiosInsance.put(`${API_URL}/api/v1/products/${id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
        else {
            res = await axiosInsance.put(`${API_URL}/api/v1/products/${id}`, payload);
        }
        return res.data?.data;
    }
    catch (error) {
        console.error(`Error updating product ${id}:`, error);
        throw error;
    }
}
// Xóa sản phẩm
export async function deleteProduct(id) {
    try {
        await axiosInsance.delete(`${API_URL}/api/v1/products/${id}`);
        return true;
    }
    catch (error) {
        console.error(`Error deleting product ${id}:`, error);
        return false;
    }
}
