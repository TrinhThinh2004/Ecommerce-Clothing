import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { formatVnd } from "../../utils/format";
import { ShoppingCart } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;
function addToCart(item) {
    try {
        const raw = localStorage.getItem("cart");
        const cart = raw
            ? JSON.parse(raw)
            : [];
        const idx = cart.findIndex((c) => c.id === item.product_id);
        if (idx >= 0)
            cart[idx].qty += 1;
        else
            cart.push({ id: item.product_id, qty: 1, item });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Đã thêm vào giỏ hàng!");
    }
    catch {
        alert("Không thể thêm vào giỏ. Vui lòng thử lại.");
    }
}
export default function ProductCard({ item }) {
    return (_jsxs("article", { className: "group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition\r\n                 hover:-translate-y-0.5 hover:shadow-md", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "overflow-hidden", children: _jsx("img", { src: `${API_URL}${item.image_url}`, alt: item.name, className: "h-56 w-full object-cover transition-transform duration-300 sm:h-64 group-hover:scale-105", loading: "lazy" }) }), _jsx("button", { className: "absolute right-2 top-2 grid h-9 w-9 place-content-center rounded-full bg-white/95 text-neutral-800 shadow hover:bg-white", "aria-label": "Th\u00EAm v\u00E0o gi\u1ECF h\u00E0ng", onClick: (e) => {
                            e.stopPropagation();
                            addToCart(item);
                        }, children: _jsx(ShoppingCart, { className: "h-4 w-4" }) })] }), _jsxs("div", { className: "flex flex-1 flex-col p-3", children: [_jsx("h3", { className: "line-clamp-2 min-h-[40px] text-sm font-semibold leading-snug", children: item.name }), _jsxs("div", { className: "mt-1 min-h-[22px] flex items-start gap-1", children: [item.isNew && (_jsx("span", { className: "inline-block rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-neutral-800 whitespace-nowrap", children: "H\u00E0ng M\u1EDBi" })), item.voucherText && (_jsx("span", { className: "inline-block rounded bg-amber-400 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-black whitespace-nowrap", children: item.voucherText }))] }), _jsxs("div", { className: "mt-auto flex items-center justify-between pt-2", children: [_jsx("div", { className: "text-[13px] font-semibold text-black", children: formatVnd(Number(item.price)) }), _jsx(Link, { to: `/san-pham/${item.product_id}`, onClick: (e) => e.stopPropagation(), className: "rounded-md bg-black px-3 py-1.5 text-xs font-semibold text-white\r\n             transition-colors hover:bg-sky-600 focus-visible:outline-none\r\n             focus-visible:ring-2 focus-visible:ring-sky-500", children: "Chi ti\u1EBFt" })] })] })] }));
}
