import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/Search/Search.tsx
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../../components/Products/ProductGrid";
import { formatVnd } from "../../utils/format";
const PAGE_SIZE = 12;
const baseImgs = [
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503342452485-86ff0a0d98ab?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop",
];
const NAMES = [
    "Áo Polo Nam ICONDENIM Braided Stripes",
    "Áo Polo Nam ICONDENIM Heroic",
    "Quần Jean Nam ICONDENIM Grey Baggy",
    "Mũ ICONDENIM Conqueror Bear",
    "Quần Short Nam RUNPOW Flash Move",
];
const PRICES = [399000, 359000, 549000, 249000, 299000];
const CATES = ["ao-thun", "so-mi", "ao-khoac", "quan-jeans", "quan-tay"];
const MOCK = Array.from({ length: 48 }, (_, i) => {
    const idx = i % baseImgs.length;
    return {
        id: String(i + 1),
        product_id: i + 1,
        name: NAMES[idx] + ` #${i + 1}`,
        image: baseImgs[idx],
        price: PRICES[idx],
        isNew: i % 4 === 0,
        voucherText: i % 3 === 0 ? "Voucher 30K" : undefined,
        category: CATES[idx],
        stock_quantity: 100,
    };
});
/** ============================================ */
export default function Search() {
    const [params] = useSearchParams();
    const q = (params.get("q") ?? "").trim().toLowerCase();
    const category = params.get("category") ?? undefined;
    // Lọc theo q & category
    const filtered = useMemo(() => {
        let arr = MOCK;
        if (q) {
            arr = arr.filter((p) => p.name.toLowerCase().includes(q) ||
                String(p.price).includes(q) ||
                formatVnd(p.price).toLowerCase().includes(q));
        }
        if (category) {
            arr = arr.filter((p) => p.category === category);
        }
        return arr;
    }, [q, category]);
    return (_jsx("div", { className: "bg-gradient-to-b from-amber-50 to-amber-100", children: _jsxs("div", { className: "mx-auto w-full max-w-7xl px-4 py-6", children: [_jsx("header", { className: "flex flex-wrap items-end justify-between gap-3", children: _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-extrabold", children: "K\u1EBFt qu\u1EA3 t\u00ECm ki\u1EBFm" }), _jsxs("p", { className: "mt-1 text-sm text-neutral-600", children: [q ? (_jsxs(_Fragment, { children: ["T\u1EEB kh\u00F3a: ", _jsxs("b", { children: ["\u201C", q, "\u201D"] }), " \u2022", " "] })) : null, "T\u00ECm th\u1EA5y ", _jsx("b", { children: filtered.length }), " s\u1EA3n ph\u1EA9m", category ? (_jsxs(_Fragment, { children: [" ", "trong m\u1EE5c ", _jsx("b", { children: category })] })) : null] })] }) }), _jsx(ProductGrid, { items: filtered, pageSize: PAGE_SIZE, showSeeMore // hiện nút “Xem thêm”
                    : true, seeMoreText: "Xem th\u00EAm" })] }) }));
}
