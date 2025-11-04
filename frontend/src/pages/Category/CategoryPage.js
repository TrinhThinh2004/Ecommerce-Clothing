import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ProductCard from "../../components/Products/ProductCard";
import Pagination from "../../components/Products/Pagination";
const API_URL = import.meta.env.VITE_API_URL;
export default function CategoryPage() {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 4; // ✅ mỗi trang hiển thị 4 sản phẩm
    useEffect(() => {
        if (!id)
            return;
        setLoading(true);
        axios
            .get(`${API_URL}/api/v1/categorys/${id}`)
            .then((res) => setCategory(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);
    // ✅ Phân trang phía frontend
    const paginatedProducts = useMemo(() => {
        if (!category?.products)
            return [];
        const start = (page - 1) * limit;
        return category.products.slice(start, start + limit);
    }, [category, page]);
    const totalPages = category?.products
        ? Math.ceil(category.products.length / limit)
        : 1;
    if (loading)
        return _jsx("p", { className: "p-6", children: "\u0110ang t\u1EA3i..." });
    if (!category)
        return _jsx("p", { className: "p-6", children: "Kh\u00F4ng t\u00ECm th\u1EA5y danh m\u1EE5c." });
    return (_jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: category.name }), paginatedProducts.length === 0 ? (_jsx("p", { children: "Ch\u01B0a c\u00F3 s\u1EA3n ph\u1EA9m trong danh m\u1EE5c n\u00E0y." })) : (_jsx("div", { className: "grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4", children: paginatedProducts.map((p) => (_jsx(ProductCard, { item: p }, p.product_id))) })), totalPages > 1 && (_jsx(Pagination, { page: page, pageCount: totalPages, onPageChange: (p) => setPage(p) }))] }));
}
