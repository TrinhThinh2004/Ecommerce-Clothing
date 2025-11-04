import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ProductCard from "../../components/Products/ProductCard";
import Pagination from "../../components/Products/Pagination";
const API_URL = import.meta.env.VITE_API_URL;
export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 8; // ✅ mỗi trang hiển thị 8 sản phẩm
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axios.get(`${API_URL}/api/v1/products`);
                // 🔍 Kiểm tra dữ liệu trả về từ API
                const data = res.data?.data;
                if (Array.isArray(data)) {
                    setProducts(data);
                }
                else {
                    setProducts([]);
                    console.warn("API không trả về danh sách hợp lệ:", res.data);
                }
            }
            catch (err) {
                console.error("Lỗi tải sản phẩm:", err);
                setError("Không thể tải sản phẩm. Vui lòng thử lại sau!");
            }
            finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    // ✅ Phân trang phía frontend
    const paginatedProducts = useMemo(() => {
        const start = (page - 1) * limit;
        return products.slice(start, start + limit);
    }, [products, page]);
    const totalPages = Math.ceil(products.length / limit);
    // --- UI hiển thị ---
    if (loading)
        return _jsx("p", { className: "p-6", children: "\u0110ang t\u1EA3i s\u1EA3n ph\u1EA9m..." });
    if (error)
        return _jsx("p", { className: "p-6 text-red-600", children: error });
    return (_jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-2xl font-bold mb-6 uppercase", children: "T\u1EA5t c\u1EA3 s\u1EA3n ph\u1EA9m" }), paginatedProducts.length === 0 ? (_jsx("p", { children: "Ch\u01B0a c\u00F3 s\u1EA3n ph\u1EA9m n\u00E0o." })) : (_jsx("div", { className: "grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4", children: paginatedProducts.map((p) => (_jsx(ProductCard, { item: p }, p.product_id))) })), totalPages > 1 && (_jsx(Pagination, { page: page, pageCount: totalPages, onPageChange: (p) => setPage(p) }))] }));
}
