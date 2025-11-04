import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Truck, ShieldCheck, Star, } from "lucide-react";
import { formatVnd } from "../../utils/format";
import SizeGuideModal from "../../components/Modals/SizeGuideModal";
/** ------------------ MOCK DATA ------------------ */
const MOCK = {
    "1": {
        product_id: 1,
        name: "Áo Thun Nam ICONDENIM Orgnls",
        image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1503342452485-86ff0a0d98ab?q=80&w=1200&auto=format&fit=crop",
        ],
        sizes: ["S", "M", "L", "XL"],
        price: 299_000,
        isNew: true,
        voucherText: "Voucher 30K",
        description: "COTTON 220GSM – MỀM MẠI & THOÁNG KHÍ. In graphic ORGNLS tinh thần streetwear. Form regular gọn gàng dễ mặc.",
        sku: "ATID0640-01",
        category: "Áo Thun",
        stock_quantity: 100,
        created_at: "2025-10-13T00:00:00Z",
        updated_at: "2025-10-13T00:00:00Z",
    },
};
const REVIEWS = [
    {
        id: "r1",
        user: "Nguyễn Minh",
        rating: 5,
        comment: "Áo đẹp, chất dày vừa, form chuẩn. Sẽ ủng hộ tiếp!",
        createdAt: "2025-08-02T12:30:00Z",
    },
    {
        id: "r2",
        user: "Trần Bảo",
        rating: 4,
        comment: "Màu đẹp, mặc thoải mái. Góp ý: giao nhanh hơn chút là perfect.",
        createdAt: "2025-08-01T09:05:00Z",
    },
    {
        id: "r3",
        user: "Lê Hồng",
        rating: 5,
        comment: "Đúng mô tả, form regular dễ phối đồ.",
        createdAt: "2025-07-29T15:10:00Z",
    },
];
function avgRating(list) {
    if (!list.length)
        return 0;
    const sum = list.reduce((s, r) => s + r.rating, 0);
    return Math.round((sum / list.length) * 10) / 10; // 1 chữ số thập phân
}
function countByStar(list) {
    return {
        5: list.filter((r) => r.rating === 5).length,
        4: list.filter((r) => r.rating === 4).length,
        3: list.filter((r) => r.rating === 3).length,
        2: list.filter((r) => r.rating === 2).length,
        1: list.filter((r) => r.rating === 1).length,
    };
}
function formatDateVN(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
/** ------------------------------------------------ */
function addToCartLS(item, qty, size) {
    const raw = localStorage.getItem("cart");
    const cart = raw ? JSON.parse(raw) : [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keyMatch = (c) => c.product_id === item.product_id && c.size === size;
    const idx = cart.findIndex(keyMatch);
    if (idx >= 0)
        cart[idx].qty += qty;
    else
        cart.push({ product_id: item.product_id, qty, item, size });
    localStorage.setItem("cart", JSON.stringify(cart));
    // eslint-disable-next-line no-alert
    alert("Đã thêm vào giỏ!");
}
export default function ProductDetail() {
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const { id = "1" } = useParams(); // demo: default 1
    const data = useMemo(() => MOCK[id] ?? Object.values(MOCK)[0], [id]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [size, setSize] = useState(data.sizes[0]);
    const [qty, setQty] = useState(1);
    const mainImg = data.images[activeIdx] ?? data.image_url;
    return (_jsxs("div", { className: "bg-gradient-to-b from-amber-50 to-amber-100", children: [_jsxs("div", { className: "mx-auto w-full max-w-6xl px-3 py-6 lg:px-0", children: [_jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [_jsxs("section", { className: "rounded-xl border border-neutral-200 bg-white p-3", children: [_jsx("div", { className: "overflow-hidden rounded-lg bg-white", children: _jsx("div", { className: "h-[360px] md:h-[480px] grid place-items-center ", children: _jsx("img", { src: mainImg, alt: data.name, className: "max-h-full max-w-full object-contain rounded", loading: "lazy" }) }) }), _jsx("ul", { className: "mt-3 grid grid-cols-5 gap-2", children: data.images.map((src, i) => (_jsx("li", { children: _jsx("button", { onClick: () => setActiveIdx(i), className: [
                                                    "block overflow-hidden rounded-md border",
                                                    i === activeIdx
                                                        ? "border-black"
                                                        : "border-neutral-200 hover:border-neutral-300",
                                                ].join(" "), children: _jsx("div", { className: "h-16 w-full grid place-items-center bg-white", children: _jsx("img", { src: src, alt: `thumb-${i}`, className: "max-h-full max-w-full object-contain rounded", loading: "lazy" }) }) }) }, i))) })] }), _jsxs("section", { className: "rounded-xl border border-neutral-200 bg-white p-4 sm:p-6", children: [_jsx("h1", { className: "text-xl font-semibold", children: data.name }), _jsxs("div", { className: "mt-1 flex items-center gap-2", children: [_jsxs(Link, { to: `/danh-muc/${encodeURIComponent(data.category)}`, className: "text-xs text-neutral-500 hover:underline", children: ["Lo\u1EA1i: ", data.category] }), _jsx("span", { className: "text-xs text-neutral-400", children: "|" }), _jsxs("span", { className: "text-xs text-neutral-500", children: ["MSP: ", data.sku] }), data.isNew && (_jsx("span", { className: "ml-2 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700", children: "C\u00F2n H\u00E0ng" }))] }), _jsx("div", { className: "mt-3 text-2xl font-bold text-black", children: formatVnd(Number(data.price)) }), _jsxs("div", { className: "mt-3 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3", children: [_jsxs("p", { className: "flex items-center gap-2 text-sm font-semibold", children: [_jsx(ShieldCheck, { className: "h-4 w-4 text-amber-600" }), "KHUY\u1EBEN M\u00C3I - \u01AFU \u0110\u00C3I"] }), _jsxs("ul", { className: "mt-2 list-disc space-y-1 pl-5 text-sm", children: [_jsx("li", { children: "Nh\u1EADp m\u00E3 SEP9 GI\u1EA2M 9K \u0111\u01A1n t\u1EEB 0\u0111" }), _jsx("li", { children: "Nh\u1EADp m\u00E3 SEP30 GI\u1EA2M 30K \u0111\u01A1n t\u1EEB 299K" }), _jsx("li", { children: "Nh\u1EADp m\u00E3 SEP50 GI\u1EA2M 50K \u0111\u01A1n t\u1EEB 599K" }), _jsx("li", { children: "Nh\u1EADp m\u00E3 SEP100 GI\u1EA2M 100K \u0111\u01A1n t\u1EEB 999K" }), _jsx("li", { children: "FREESHIP \u0111\u01A1n t\u1EEB 399K" })] })] }), _jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: ["SEP9", "SEP30", "SEP50", "SEP100"].map((m) => (_jsx("span", { className: "inline-block rounded bg-black px-3 py-1 text-xs font-bold text-white", children: m }, m))) }), _jsxs("div", { className: "mt-4", children: [_jsxs("div", { className: "text-sm font-medium", children: ["K\u00EDch th\u01B0\u1EDBc:", " ", _jsx("button", { type: "button", onClick: () => setShowSizeGuide(true), className: "ml-2 text-xs text-sky-600 hover:underline cursor-pointer", children: "H\u01B0\u1EDBng d\u1EABn ch\u1ECDn size" })] }), _jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: data.sizes.map((s) => (_jsx("button", { onClick: () => setSize(s), className: [
                                                        "min-w-10 rounded border px-3 py-1.5 text-sm cursor-pointer",
                                                        size === s
                                                            ? "border-black bg-black text-white"
                                                            : "border-neutral-300 bg-white hover:border-neutral-500",
                                                    ].join(" "), children: s }, s))) })] }), _jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-3", children: [_jsxs("div", { className: "flex items-center rounded-md border border-neutral-300", children: [_jsx("button", { className: "grid h-9 w-9 place-content-center hover:bg-neutral-50", onClick: () => setQty((q) => Math.max(1, q - 1)), children: _jsx(Minus, { className: "h-4 w-4" }) }), _jsx("input", { value: qty, onChange: (e) => setQty(Math.max(1, Number(e.target.value) || 1)), className: "h-9 w-14 border-x border-neutral-300 text-center outline-none" }), _jsx("button", { className: "grid h-9 w-9 place-content-center hover:bg-neutral-50", onClick: () => setQty((q) => q + 1), children: _jsx(Plus, { className: "h-4 w-4" }) })] }), _jsxs("button", { className: "inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 font-semibold text-white transition hover:bg-sky-600 cursor-pointer", onClick: () => addToCartLS(data, qty, size), children: [_jsx(ShoppingCart, { className: "h-4 w-4 " }), "TH\u00CAM V\u00C0O GI\u1ECE"] }), _jsx("button", { className: "rounded-md border border-black px-4 py-2 font-semibold hover:bg-black hover:text-white cursor-pointer", onClick: () => addToCartLS(data, qty, size), children: "MUA NGAY" })] }), _jsxs("div", { className: "mt-4 flex flex-wrap items-center gap-5 text-sm text-neutral-600", children: [_jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx(Truck, { className: "h-4 w-4" }), " Mi\u1EC5n ph\u00ED v\u1EADn chuy\u1EC3n \u0111\u01A1n t\u1EEB 299K"] }), _jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx(ShieldCheck, { className: "h-4 w-4" }), " B\u1EA3o h\u00E0nh trong v\u00F2ng 30 ng\u00E0y"] })] })] })] }), _jsxs(Tabs, { className: "mt-6", children: [_jsx(Tab, { title: "M\u00D4 T\u1EA2", children: _jsxs("div", { className: "rounded-xl border border-neutral-200 bg-white p-5", children: [_jsxs("h3", { className: "text-lg font-semibold", children: ["160STORE \u2013 ", data.name] }), _jsxs("ul", { className: "mt-3 list-disc space-y-2 pl-5 text-sm leading-6", children: [_jsx("li", { children: "Ch\u1EA5t li\u1EC7u: Thun Cotton 220GSM" }), _jsx("li", { children: "Form: Regular" })] }), _jsx("hr", { className: "my-4" }), _jsxs("div", { className: "space-y-3 text-sm leading-7", children: [_jsx("p", { children: "\u25BA COTTON 220GSM \u2013 M\u1EC0M M\u1EA0I & THO\u00C1NG KH\u00CD" }), _jsx("p", { children: "Ch\u1EA5t li\u1EC7u d\u00E0y v\u1EEBa, m\u1EC1m m\u1ECBn, co gi\u00E3n t\u1ED1t, tho\u1EA3i m\u00E1i c\u1EA3 ng\u00E0y." }), _jsx("p", { children: "\u25BA H\u00CCNH IN ORGNLS \u2013 TINH TH\u1EA6N STREETWEAR" }), _jsx("p", { children: data.description })] })] }) }), _jsx(Tab, { title: "CH\u00CDNH S\u00C1CH GIAO H\u00C0NG", children: _jsx(ImgPanel, { src: "https://file.hstatic.net/1000253775/file/cs_giaohanh.jpg", alt: "Ch\u00EDnh s\u00E1ch giao h\u00E0ng" }) }), _jsxs(Tab, { title: "CH\u00CDNH S\u00C1CH \u0110\u1ED4I H\u00C0NG", children: [_jsx(ImgPanel, { src: "https://file.hstatic.net/1000253775/file/doitra_1.jpg", alt: "Ch\u00EDnh s\u00E1ch \u0111\u1ED5i h\u00E0ng" }), _jsx(ImgPanel, { src: "https://file.hstatic.net/1000253775/file/doitra_2.jpg", alt: "Ch\u00EDnh s\u00E1ch \u0111\u1ED5i h\u00E0ng" })] })] }), _jsx("section", { className: "mt-6 rounded-xl border border-neutral-200 bg-white p-5", children: _jsxs("div", { className: "grid gap-6 md:grid-cols-[260px,1fr]", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-extrabold leading-tight", children: "\u0110\u00C1NH GI\u00C1 S\u1EA2N PH\u1EA8M" }), _jsxs("div", { className: "mt-4 flex items-center gap-3", children: [_jsx("div", { className: "text-[44px] font-extrabold leading-none", children: avgRating(REVIEWS) }), _jsxs("div", { className: "mt-0.5", children: [_jsx(StarRow, { stars: Math.round(avgRating(REVIEWS)) }), _jsxs("div", { className: "text-sm font-semibold text-neutral-700", children: [REVIEWS.length, " \u0111\u00E1nh gi\u00E1"] })] })] }), _jsx("ul", { className: "mt-4 space-y-2 text-sm", children: [5, 4, 3, 2, 1].map((s) => {
                                                const distribution = countByStar(REVIEWS);
                                                const count = distribution[s];
                                                const percent = REVIEWS.length
                                                    ? Math.round((count / REVIEWS.length) * 100)
                                                    : 0;
                                                return (_jsxs("li", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "w-8 text-right", children: [s, "\u2605"] }), _jsx("div", { className: "relative h-2 flex-1 rounded bg-neutral-200", children: _jsx("div", { className: "absolute left-0 top-0 h-2 rounded bg-yellow-400", style: { width: `${percent}%` } }) }), _jsx("div", { className: "w-10 text-right tabular-nums", children: count })] }, s));
                                            }) })] }), _jsx("div", { children: REVIEWS.length === 0 ? (_jsx("div", { className: "py-10 text-center text-sm text-neutral-600", children: "S\u1EA3n ph\u1EA9m ch\u01B0a c\u00F3 \u0111\u00E1nh gi\u00E1" })) : (_jsx("ul", { className: "space-y-4", children: REVIEWS.map((r) => (_jsxs("li", { className: "rounded-lg border border-neutral-200 p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "font-semibold", children: r.user }), _jsx("div", { className: "text-xs text-neutral-500", children: formatDateVN(r.createdAt) })] }), _jsx("div", { className: "mt-1", children: _jsx(StarRow, { stars: r.rating }) }), _jsx("p", { className: "mt-2 text-sm leading-6 text-neutral-800", children: r.comment })] }, r.id))) })) })] }) })] }), _jsx(SizeGuideModal, { open: showSizeGuide, onClose: () => setShowSizeGuide(false), title: `Bảng size ${data.name}`, 
                // dữ liệu mẫu – sau này đổi thành link từ API
                src: "https://cdn.hstatic.net/products/1000253775/polo-regular_e5cb6669ccc243d09ba2d0ae4fdb6143_master.png" })] }));
}
function Tabs({ children, className = "", }) {
    // ép kiểu rõ ràng cho phần tử Tab
    const items = (Array.isArray(children) ? children : [children]);
    const [idx, setIdx] = useState(0);
    return (_jsxs("div", { className: className, children: [_jsx("div", { className: "flex gap-2", children: items.map((c, i) => (_jsx("button", { onClick: () => setIdx(i), className: [
                        "rounded-t-lg border px-3 py-2 text-sm font-semibold",
                        i === idx
                            ? "border-neutral-200 border-b-white bg-white"
                            : "border-transparent bg-neutral-100 hover:bg-neutral-200",
                    ].join(" "), children: c.props.title }, i))) }), _jsx("div", { className: "rounded-b-xl border border-neutral-200 bg-white p-0", children: items[idx] })] }));
}
function Tab({ children }) {
    return _jsx("div", { className: "p-5", children: children });
}
function ImgPanel({ src, alt }) {
    return (_jsx("div", { className: "p-5", children: _jsx("img", { src: src, alt: alt, className: "mx-auto w-full max-w-4xl rounded-lg border" }) }));
}
function StarRow({ stars }) {
    return (_jsx("div", { className: "inline-flex items-center gap-1", children: Array.from({ length: 5 }, (_, i) => (_jsx(Star, { className: `h-4 w-4 ${i < stars ? "text-yellow-400 fill-yellow-400" : "text-neutral-300"}` }, i))) }));
}
