import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import Button from "../Button/Button"; // <— thêm import
export default function ProductGrid({ items, pageSize = 12, showSeeMore = false, seeMoreText = "Xem thêm", }) {
    const [page, setPage] = useState(1);
    // Reset về trang 1 khi dữ liệu đổi (tránh lệch trang)
    useEffect(() => setPage(1), [items, pageSize]);
    const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
    const pageItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, page, pageSize]);
    const isLastPage = page >= pageCount;
    return (_jsxs("section", { className: "mx-auto mt-6 w-full max-w-6xl px-1 sm:px-0", children: [_jsx("div", { className: "grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4", children: pageItems.map((p) => (_jsx(ProductCard, { item: p }, p.product_id))) }), showSeeMore && !isLastPage && (_jsx("div", { className: "mt-4 flex justify-center", children: _jsx(Button, { onClick: () => setPage((p) => Math.min(pageCount, p + 1)), children: seeMoreText }) })), _jsx(Pagination, { page: page, pageCount: pageCount, onPageChange: setPage })] }));
}
