import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Admin/AdminOrders.tsx
import { useEffect, useMemo, useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Trash2, X, } from "lucide-react";
import { formatVnd } from "../../../utils/format";
import AdminLayout from "../_Components/AdminLayout";
/* ================= Mocks & helpers ================= */
const STATUSES = [
    { value: "pending", label: "Chờ xử lý" },
    { value: "processing", label: "Đang xử lý" },
    { value: "shipped", label: "Đã gửi" },
    { value: "delivered", label: "Đã giao" },
    { value: "canceled", label: "Đã hủy" },
];
const METHODS = {
    cod: "COD",
    momo: "MoMo",
    vnpay: "VNPAY",
};
const IMG = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop",
];
const NAMES = [
    "Áo thun ICONDENIM ORGNLS",
    "Quần jean Grey Baggy",
    "Áo polo Braided Stripes",
    "Mũ Conqueror Bear",
];
function seedOrders(n = 48) {
    const now = new Date();
    return Array.from({ length: n }, (_, i) => {
        const created = new Date(now.getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 28)); // trong 28 ngày
        const itemCount = 1 + (i % 3);
        const items = Array.from({ length: itemCount }, (_, j) => {
            const pick = (i + j) % IMG.length;
            return {
                sku: `SKU-${1000 + i}-${j + 1}`,
                name: NAMES[(i + j) % NAMES.length],
                image: IMG[pick],
                qty: 1 + (j % 2),
                price: [299000, 549000, 359000, 249000][(i + j) % 4],
                size: ["S", "M", "L", "XL"][(i + j) % 4],
            };
        });
        const status = [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "canceled",
        ][i % 5];
        return {
            id: `ORD${1023 + i}`,
            customerName: `Khách ${i + 1}`,
            phone: `09${Math.floor(10000000 + Math.random() * 89999999)}`,
            address: `Số ${i + 10} Đường ABC, Q.${(i % 10) + 1}, TP.HCM`,
            method: ["cod", "momo", "vnpay"][i % 3],
            status,
            items,
            note: i % 5 === 0 ? "Giao giờ hành chính" : undefined,
            createdAt: created.toISOString(),
        };
    });
}
function getTotal(o) {
    return o.items.reduce((s, it) => s + it.price * it.qty, 0);
}
function loadOrders() {
    try {
        const raw = localStorage.getItem("admin_orders");
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed))
                return parsed;
        }
    }
    catch (err) {
        console.warn("[admin_orders] Lỗi đọc localStorage:", err);
    }
    const seeded = seedOrders();
    localStorage.setItem("admin_orders", JSON.stringify(seeded));
    return seeded;
}
function saveOrders(orders) {
    localStorage.setItem("admin_orders", JSON.stringify(orders));
}
function withinRange(iso, range) {
    if (range === "all")
        return true;
    const days = range === "7d" ? 7 : 30;
    const t = new Date(iso).getTime();
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return t >= cutoff;
}
/* ================= Page ================= */
export default function AdminOrders() {
    const [orders, setOrders] = useState(() => loadOrders());
    // filters
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const [range, setRange] = useState("7d");
    // pagination
    const [page, setPage] = useState(1);
    const pageSize = 10;
    // drawer view
    const [openId, setOpenId] = useState(null);
    // derived
    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        return orders
            .filter((o) => (status === "all" ? true : o.status === status))
            .filter((o) => withinRange(o.createdAt, range))
            .filter((o) => {
            if (!query)
                return true;
            return (o.id.toLowerCase().includes(query) ||
                o.customerName.toLowerCase().includes(query) ||
                o.phone.toLowerCase().includes(query));
        })
            .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }, [orders, status, range, q]);
    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page]);
    // reset về trang 1 khi filter thay đổi
    useEffect(() => {
        setPage(1);
    }, [q, status, range]);
    function updateStatus(id, next) {
        setOrders((prev) => {
            const nextArr = prev.map((o) => o.id === id ? { ...o, status: next } : o);
            saveOrders(nextArr);
            return nextArr;
        });
    }
    function removeOrder(id) {
        if (!confirm(`Xóa đơn ${id}? (demo)`))
            return;
        setOrders((prev) => {
            const nextArr = prev.filter((o) => o.id !== id);
            saveOrders(nextArr);
            return nextArr;
        });
    }
    return (_jsxs(AdminLayout, { title: "Qu\u1EA3n l\u00FD \u0111\u01A1n h\u00E0ng", children: [_jsx("div", { className: "rounded-xl border border-neutral-200 bg-white p-3", children: _jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { className: "flex items-stretch overflow-hidden rounded-md border border-neutral-300", children: [_jsx("span", { className: "grid h-10 w-10 place-content-center text-neutral-500", children: _jsx(Search, { className: "h-5 w-5" }) }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "T\u00ECm ID / t\u00EAn KH / S\u0110T\u2026", className: "h-10 w-64 min-w-0 flex-1 px-3 text-sm outline-none" })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs("span", { className: "inline-flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm", children: [_jsx(Filter, { className: "h-4 w-4 text-neutral-500" }), "B\u1ED9 l\u1ECDc"] }), _jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "h-10 rounded-md border border-neutral-300 px-3 text-sm outline-none", children: [_jsx("option", { value: "all", children: "T\u1EA5t c\u1EA3 tr\u1EA1ng th\u00E1i" }), STATUSES.map((s) => (_jsx("option", { value: s.value, children: s.label }, s.value)))] }), _jsxs("select", { value: range, onChange: (e) => setRange(e.target.value), className: "h-10 rounded-md border border-neutral-300 px-3 text-sm outline-none", children: [_jsx("option", { value: "7d", children: "7 ng\u00E0y" }), _jsx("option", { value: "30d", children: "30 ng\u00E0y" }), _jsx("option", { value: "all", children: "To\u00E0n b\u1ED9" })] })] })] }) }), _jsxs("section", { className: "mt-4 overflow-hidden rounded-xl border border-neutral-200 bg-white", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-[720px] w-full text-sm", children: [_jsx("thead", { className: "bg-neutral-50 text-neutral-600", children: _jsxs("tr", { children: [_jsx(Th, { children: "#\u0110\u01A1n" }), _jsx(Th, { children: "Kh\u00E1ch h\u00E0ng" }), _jsx(Th, { children: "Thanh to\u00E1n" }), _jsx(Th, { children: "T\u1ED5ng" }), _jsx(Th, { children: "Ng\u00E0y t\u1EA1o" }), _jsx(Th, { children: "Tr\u1EA1ng th\u00E1i" }), _jsx(Th, { className: "text-right pr-3", children: "Thao t\u00E1c" })] }) }), _jsxs("tbody", { className: "divide-y", children: [pageItems.map((o) => (_jsxs("tr", { className: "hover:bg-neutral-50/60", children: [_jsxs(Td, { children: [_jsx("div", { className: "font-semibold", children: o.id }), _jsxs("div", { className: "text-xs text-neutral-500", children: [o.items.length, " SP"] })] }), _jsxs(Td, { children: [_jsx("div", { className: "font-medium", children: o.customerName }), _jsx("div", { className: "text-xs text-neutral-500", children: o.phone })] }), _jsx(Td, { children: METHODS[o.method] }), _jsx(Td, { className: "font-semibold", children: formatVnd(getTotal(o)) }), _jsx(Td, { children: new Date(o.createdAt).toLocaleString("vi-VN", {
                                                        hour12: false,
                                                    }) }), _jsx(Td, { children: _jsx(StatusBadge, { value: o.status }) }), _jsx(Td, { className: "text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-1", children: [_jsx(StatusSelect, { value: o.status, onChange: (s) => updateStatus(o.id, s) }), _jsx("button", { className: "rounded-md p-2 text-neutral-600 hover:bg-neutral-100", title: "Xem chi ti\u1EBFt", onClick: () => setOpenId(o.id), children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx("button", { className: "rounded-md p-2 text-red-600 hover:bg-red-50", title: "X\u00F3a", onClick: () => removeOrder(o.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] }) })] }, o.id))), pageItems.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "p-8 text-center text-neutral-600", children: "Kh\u00F4ng c\u00F3 \u0111\u01A1n h\u00E0ng n\u00E0o." }) }))] })] }) }), _jsxs("div", { className: "flex items-center justify-between border-t px-3 py-2 text-sm", children: [_jsxs("div", { className: "text-neutral-600", children: ["Hi\u1EC3n th\u1ECB ", pageItems.length, " / ", filtered.length, " \u0111\u01A1n"] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsxs("button", { className: "inline-flex items-center gap-1 rounded-md border px-2 py-1 disabled:opacity-40", onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1, children: [_jsx(ChevronLeft, { className: "h-4 w-4" }), " Tr\u01B0\u1EDBc"] }), _jsxs("span", { className: "px-2", children: [page, " / ", pageCount] }), _jsxs("button", { className: "inline-flex items-center gap-1 rounded-md border px-2 py-1 disabled:opacity-40", onClick: () => setPage((p) => Math.min(pageCount, p + 1)), disabled: page === pageCount, children: ["Sau ", _jsx(ChevronRight, { className: "h-4 w-4" })] })] })] })] }), _jsx(OrderDrawer, { order: orders.find((o) => o.id === openId) || null, onClose: () => setOpenId(null) })] }));
}
/* ================= Table Subcomponents ================= */
function Th({ children, className = "", }) {
    return (_jsx("th", { className: `px-3 py-2 text-left text-xs font-semibold ${className}`, children: children }));
}
function Td({ children, className = "", }) {
    return _jsx("td", { className: `px-3 py-3 align-top ${className}`, children: children });
}
function StatusBadge({ value }) {
    const map = {
        pending: "bg-amber-50 text-amber-700",
        processing: "bg-sky-50 text-sky-700",
        shipped: "bg-indigo-50 text-indigo-700",
        delivered: "bg-emerald-50 text-emerald-700",
        canceled: "bg-red-50 text-red-700",
    };
    const label = STATUSES.find((s) => s.value === value)?.label ?? value;
    return (_jsx("span", { className: `inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${map[value]}`, children: label }));
}
function StatusSelect({ value, onChange, }) {
    return (_jsx("select", { value: value, onChange: (e) => onChange(e.target.value), className: "rounded-md border border-neutral-300 px-2 py-1 text-xs outline-none hover:border-neutral-400", title: "\u0110\u1ED5i tr\u1EA1ng th\u00E1i", children: STATUSES.map((s) => (_jsx("option", { value: s.value, children: s.label }, s.value))) }));
}
/* ================= Drawer ================= */
function OrderDrawer({ order, onClose, }) {
    return (_jsxs("div", { className: [
            "fixed inset-0 z-50",
            order ? "pointer-events-auto" : "pointer-events-none",
        ].join(" "), "aria-hidden": !order, children: [_jsx("div", { className: [
                    "absolute inset-0 bg-black/40 transition-opacity",
                    order ? "opacity-100" : "opacity-0",
                ].join(" "), onClick: onClose }), _jsxs("aside", { className: [
                    "absolute right-0 top-0 h-full w-full max-w-lg translate-x-0 rounded-l-2xl bg-white shadow-xl transition-transform",
                    order ? "translate-x-0" : "translate-x-full",
                ].join(" "), role: "dialog", "aria-modal": "true", "aria-label": "Chi ti\u1EBFt \u0111\u01A1n h\u00E0ng", children: [_jsxs("div", { className: "flex items-center justify-between border-b px-4 py-3", children: [_jsxs("h3", { className: "text-base font-extrabold", children: ["Chi ti\u1EBFt ", order?.id ?? ""] }), _jsx("button", { onClick: onClose, className: "rounded p-2 text-neutral-600 hover:bg-neutral-100", "aria-label": "\u0110\u00F3ng", children: _jsx(X, { className: "h-5 w-5" }) })] }), order ? (_jsxs("div", { className: "space-y-4 overflow-y-auto px-4 py-4", children: [_jsx("div", { className: "rounded-lg border p-3", children: _jsxs("div", { className: "grid gap-2 text-sm sm:grid-cols-2", children: [_jsx(Row, { label: "Kh\u00E1ch h\u00E0ng", value: order.customerName }), _jsx(Row, { label: "S\u0110T", value: order.phone }), _jsx(Row, { label: "\u0110\u1ECBa ch\u1EC9", value: order.address }), _jsx(Row, { label: "Thanh to\u00E1n", value: METHODS[order.method] }), _jsx(Row, { label: "Ng\u00E0y t\u1EA1o", value: new Date(order.createdAt).toLocaleString("vi-VN", {
                                                hour12: false,
                                            }) }), _jsx(Row, { label: "Tr\u1EA1ng th\u00E1i", value: _jsx(StatusBadge, { value: order.status }) }), order.note ? _jsx(Row, { label: "Ghi ch\u00FA", value: order.note }) : null] }) }), _jsxs("div", { className: "rounded-lg border", children: [_jsxs("div", { className: "border-b px-3 py-2 text-sm font-semibold", children: ["S\u1EA3n ph\u1EA9m (", order.items.length, ")"] }), _jsx("ul", { className: "divide-y", children: order.items.map((it) => (_jsxs("li", { className: "flex items-center gap-3 p-3", children: [_jsx("div", { className: "h-16 w-16 overflow-hidden rounded border", children: _jsx("img", { src: it.image, alt: it.name, className: "h-full w-full object-cover" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "truncate text-sm font-semibold", children: it.name }), _jsxs("div", { className: "text-xs text-neutral-600", children: ["SKU: ", it.sku, it.size ? ` • Size: ${it.size}` : ""] }), _jsxs("div", { className: "mt-1 text-sm", children: ["x", it.qty, " \u2022 ", formatVnd(it.price)] })] }), _jsx("div", { className: "text-sm font-semibold", children: formatVnd(it.price * it.qty) })] }, it.sku))) }), _jsxs("div", { className: "flex items-center justify-between border-t px-3 py-2 text-sm", children: [_jsx("span", { className: "text-neutral-600", children: "T\u1ED5ng" }), _jsx("span", { className: "font-semibold", children: formatVnd(getTotal(order)) })] })] })] })) : null] })] }));
}
function Row({ label, value }) {
    return (_jsxs("div", { className: "flex items-start gap-2", children: [_jsxs("span", { className: "min-w-28 text-neutral-500", children: [label, ":"] }), _jsx("span", { className: "font-medium", children: value })] }));
}
