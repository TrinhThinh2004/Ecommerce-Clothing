import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Admin/AdminDashboard.tsx
import { useMemo, useState } from "react";
import { LayoutGrid, ShoppingBag, Users2, TicketPercent, Package, MessageSquare, Settings, BarChart3, ChevronRight, } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, } from "recharts";
import { Link } from "react-router-dom";
import AdminLayout from "../_Components/AdminLayout";
function genData(range) {
    if (range === "day") {
        return Array.from({ length: 24 }, (_, i) => ({
            label: `${String(i).padStart(2, "0")}:00`,
            value: Math.round(Math.random() * 50) + (i < 9 ? 10 : 0),
        }));
    }
    if (range === "week") {
        const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
        return days.map((d, i) => ({
            label: d,
            value: Math.round(Math.random() * 300) + (i >= 4 ? 120 : 20),
        }));
    }
    // month
    return Array.from({ length: 30 }, (_, i) => ({
        label: String(i + 1),
        value: Math.round(Math.random() * 400) + (i % 6 === 0 ? 200 : 40),
    }));
}
const statFmt = (n) => n.toLocaleString("vi-VN");
/* ================= Page ================= */
export default function AdminDashboard() {
    const [range, setRange] = useState("day");
    const data = useMemo(() => genData(range), [range]);
    const todayOrders = useMemo(() => data.reduce((s, p) => s + p.value, 0), [data]);
    const todayRevenue = todayOrders * 199000;
    const convRate = 2.8;
    return (_jsxs(AdminLayout, { title: "T\u1ED5ng quan", children: [_jsxs("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: [_jsx(KpiCard, { title: "\u0110\u01A1n h\u00F4m nay", value: statFmt(todayOrders), sub: "+12% so v\u1EDBi h\u00F4m qua", icon: _jsx(ShoppingBag, { className: "h-5 w-5" }) }), _jsx(KpiCard, { title: "Doanh thu \u01B0\u1EDBc t\u00EDnh", value: statFmt(todayRevenue), currency: "\u20AB", sub: "+8% so v\u1EDBi h\u00F4m qua", icon: _jsx(BarChart3, { className: "h-5 w-5" }) }), _jsx(KpiCard, { title: "Kh\u00E1ch m\u1EDBi", value: statFmt(Math.round(todayOrders * 0.18)), sub: "Theo d\u00F5i theo k\u00EAnh", icon: _jsx(Users2, { className: "h-5 w-5" }) }), _jsx(KpiCard, { title: "T\u1EC9 l\u1EC7 chuy\u1EC3n \u0111\u1ED5i", value: convRate.toFixed(1), suffix: "%", sub: "K\u00EAnh organic t\u0103ng", icon: _jsx(LayoutGrid, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "rounded-xl border border-neutral-200 bg-white p-4", children: [_jsx("h2", { className: "mb-3 text-base font-extrabold", children: "Qu\u1EA3n l\u00FD nhanh" }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: [_jsx(ManageTile, { to: "/admin/orders", title: "Qu\u1EA3n l\u00FD \u0110\u01A1n h\u00E0ng", desc: "Xem, \u0111\u1ED5i tr\u1EA1ng th\u00E1i, in ho\u00E1 \u0111\u01A1n", children: _jsx(ShoppingBag, { className: "h-5 w-5" }) }), _jsx(ManageTile, { to: "/admin/products", title: "Qu\u1EA3n l\u00FD S\u1EA3n ph\u1EA9m", desc: "T\u1EA1o m\u1EDBi, ch\u1EC9nh s\u1EEDa, t\u1ED3n kho", children: _jsx(Package, { className: "h-5 w-5" }) }), _jsx(ManageTile, { to: "/admin/customers", title: "Qu\u1EA3n l\u00FD Kh\u00E1ch h\u00E0ng", desc: "Th\u00F4ng tin, ph\u00E2n nh\u00F3m, ghi ch\u00FA", children: _jsx(Users2, { className: "h-5 w-5" }) }), _jsx(ManageTile, { to: "/admin/vouchers", title: "M\u00E3 gi\u1EA3m gi\u00E1", desc: "T\u1EA1o chi\u1EBFn d\u1ECBch, theo d\u00F5i d\u00F9ng m\u00E3", children: _jsx(TicketPercent, { className: "h-5 w-5" }) }), _jsx(ManageTile, { to: "/admin/reviews", title: "\u0110\u00E1nh gi\u00E1", desc: "Duy\u1EC7t/\u1EA9n, ph\u1EA3n h\u1ED3i kh\u00E1ch h\u00E0ng", children: _jsx(MessageSquare, { className: "h-5 w-5" }) }), _jsx(ManageTile, { to: "/admin/settings", title: "C\u1EA5u h\u00ECnh c\u1EEDa h\u00E0ng", desc: "Thanh to\u00E1n, v\u1EADn chuy\u1EC3n, k\u00EAnh b\u00E1n", children: _jsx(Settings, { className: "h-5 w-5" }) })] })] }), _jsxs("div", { className: "rounded-xl border border-neutral-200 bg-white p-4", children: [_jsxs("div", { className: "mb-3 flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-base font-extrabold", children: "Ph\u00E2n t\u00EDch \u0111\u01A1n h\u00E0ng" }), _jsxs("p", { className: "text-sm text-neutral-600", children: ["S\u1ED1 l\u01B0\u1EE3ng \u0111\u01A1n theo", " ", range === "day"
                                                ? "giờ (hôm nay)"
                                                : range === "week"
                                                    ? "ngày trong tuần"
                                                    : "ngày trong tháng"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(RangeBtn, { active: range === "day", onClick: () => setRange("day"), children: "Ng\u00E0y" }), _jsx(RangeBtn, { active: range === "week", onClick: () => setRange("week"), children: "Tu\u1EA7n" }), _jsx(RangeBtn, { active: range === "month", onClick: () => setRange("month"), children: "Th\u00E1ng" })] })] }), _jsx("div", { className: "h-72 w-full", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: data, margin: { left: 8, right: 8, top: 10, bottom: 0 }, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "g", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "currentColor", stopOpacity: 0.25 }), _jsx("stop", { offset: "95%", stopColor: "currentColor", stopOpacity: 0 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false }), _jsx(XAxis, { dataKey: "label", tick: { fontSize: 12 } }), _jsx(YAxis, { tick: { fontSize: 12 } }), _jsx(Tooltip, { contentStyle: {
                                            borderRadius: 8,
                                            borderColor: "rgb(229 231 235)",
                                        }, formatter: (val) => [`${val}`, "Đơn"], labelStyle: { fontWeight: 600 } }), _jsx(Area, { type: "monotone", dataKey: "value", stroke: "currentColor", fill: "url(#g)", strokeWidth: 2 })] }) }) })] }), _jsxs("div", { className: "rounded-xl border border-neutral-200 bg-white p-4", children: [_jsx("h2", { className: "mb-3 text-base font-extrabold", children: "\u0110\u01A1n h\u00E0ng g\u1EA7n \u0111\u00E2y" }), _jsx("ul", { className: "divide-y", children: Array.from({ length: 6 }).map((_, i) => (_jsxs("li", { className: "flex items-center justify-between py-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "truncate text-sm font-semibold", children: ["#ORD", String(1023 + i), " \u2022 \u00C1o thun ICONDENIM \u2022 2 s\u1EA3n ph\u1EA9m"] }), _jsx("p", { className: "text-xs text-neutral-600", children: "Kh\u00E1ch: 09xx xxx 735 \u2022 COD" })] }), _jsxs("div", { className: "ml-3 flex items-center gap-3", children: [_jsx("span", { className: "rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700", children: "Th\u00E0nh c\u00F4ng" }), _jsx(ChevronRight, { className: "h-4 w-4 text-neutral-400" })] })] }, i))) })] })] }));
}
/* ================= Small components ================= */
function KpiCard({ title, value, sub, icon, currency, suffix, }) {
    return (_jsxs("div", { className: "rounded-xl border border-neutral-200 bg-white p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm font-semibold text-neutral-600", children: title }), _jsx("span", { className: "rounded-lg bg-neutral-100 p-2 text-neutral-700", children: icon })] }), _jsxs("div", { className: "mt-2 text-2xl font-extrabold", children: [currency ? _jsx("span", { className: "mr-1", children: currency }) : null, value, suffix ? (_jsx("span", { className: "ml-1 text-lg font-bold", children: suffix })) : null] }), sub && _jsx("p", { className: "mt-1 text-xs text-neutral-500", children: sub })] }));
}
function ManageTile({ to, title, desc, children, }) {
    return (_jsxs(Link, { to: to, className: "group flex items-start gap-3 rounded-lg border border-neutral-200 p-4 transition hover:-translate-y-0.5 hover:shadow-sm", children: [_jsx("span", { className: "rounded-lg bg-neutral-100 p-3 text-neutral-700", children: children }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "font-semibold", children: title }), _jsx("p", { className: "truncate text-sm text-neutral-600", children: desc })] })] }));
}
function RangeBtn({ active, onClick, children, }) {
    return (_jsx("button", { onClick: onClick, className: [
            "rounded-md px-3 py-1.5 text-sm font-semibold transition",
            active
                ? "bg-black text-white"
                : "border border-neutral-200 hover:bg-neutral-50",
        ].join(" "), children: children }));
}
