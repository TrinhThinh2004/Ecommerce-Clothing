import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Hero from "../../components/Hero/Hero";
import ProductGrid from "../../components/Products/ProductGrid";
import { fetchProducts } from "../../api/products";
export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const data = await fetchProducts();
                const transformedProducts = data.map((product, index) => ({
                    ...product,
                    isNew: index % 3 === 0,
                    voucherText: index % 2 === 0 ? "Voucher 30K" : undefined,
                }));
                setProducts(transformedProducts);
            }
            catch (err) {
                setError("Không thể tải danh sách sản phẩm");
                console.error("Error fetching products:", err);
            }
            finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 bg-gradient-to-b from-amber-50 to-amber-100 pb-10 pt-4", children: [_jsx(Hero, {}), _jsx("div", { className: "mx-auto mt-6 w-full max-w-6xl px-1 sm:px-0", children: _jsx("div", { className: "grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4", children: Array.from({ length: 8 }).map((_, i) => (_jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-64 bg-gray-200 rounded-xl" }), _jsxs("div", { className: "mt-3 space-y-2", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4" })] })] }, i))) }) })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "space-y-6 bg-gradient-to-b from-amber-50 to-amber-100 pb-10 pt-4", children: [_jsx(Hero, {}), _jsx("div", { className: "mx-auto mt-6 w-full max-w-6xl px-1 sm:px-0", children: _jsx("div", { className: "text-center py-8", children: _jsx("p", { className: "text-red-500", children: error }) }) })] }));
    }
    return (_jsxs("div", { className: "space-y-6 bg-gradient-to-b from-amber-50 to-amber-100 pb-10 pt-4", children: [_jsx(Hero, {}), _jsx(ProductGrid, { items: products, pageSize: 12, showSeeMore: true, seeMoreText: "Xem th\u00EAm" })] }));
}
