import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, ShoppingBag, Package, Users2, TicketPercent, MessageSquare, Settings, } from "lucide-react";
export default function SideNav({ onNavigate }) {
    const { pathname } = useLocation();
    const items = [
        { to: "/admin", label: "Tổng quan", icon: _jsx(LayoutGrid, {}) },
        { to: "/admin/orders", label: "Đơn hàng", icon: _jsx(ShoppingBag, {}) },
        { to: "/admin/products", label: "Sản phẩm", icon: _jsx(Package, {}) },
        { to: "/admin/customers", label: "Khách hàng", icon: _jsx(Users2, {}) },
        { to: "/admin/vouchers", label: "Mã giảm giá", icon: _jsx(TicketPercent, {}) },
        { to: "/admin/reviews", label: "Đánh giá", icon: _jsx(MessageSquare, {}) },
        { to: "/admin/settings", label: "Cấu hình", icon: _jsx(Settings, {}) },
    ];
    return (_jsx("nav", { className: "grid gap-1", children: items.map((it) => {
            const active = pathname === it.to ||
                (it.to !== "/admin" && pathname.startsWith(it.to));
            return (_jsxs(Link, { to: it.to, onClick: onNavigate, className: [
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold",
                    active
                        ? "bg-black text-white"
                        : "text-neutral-800 hover:bg-neutral-100",
                ].join(" "), children: [_jsx("span", { className: active ? "text-white" : "text-neutral-700", children: it.icon }), _jsx("span", { children: it.label })] }, it.to));
        }) }));
}
