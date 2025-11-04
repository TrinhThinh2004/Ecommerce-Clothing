import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Logout } from "../../api/auth";
import { Search, MapPin, User2, ShoppingCart, ChevronDown, Menu, X, } from "lucide-react";
const NAV_ITEMS = [
    {
        label: "SẢN PHẨM",
        href: "",
        children: [{ label: "Tất cả", href: "/san-pham" }],
    },
    {
        label: "ÁO NAM",
        href: "",
        children: [
            { label: "Áo thun", href: "/san-pham/1" },
            { label: "Sơ mi", href: "/san-pham/2" },
            { label: "Áo khoác", href: "/san-pham/3" },
        ],
    },
    {
        label: "QUẦN NAM",
        href: "",
        children: [
            { label: "Jeans", href: "/san-pham/4" },
            { label: "Kaki", href: "/san-pham/5" },
            { label: "Jogger", href: "/san-pham/6" },
        ],
    },
    {
        label: "PHỤ KIỆN",
        href: "",
        children: [
            { label: "Dây Nịt", href: "/san-pham/7" },
            { label: "Mũ", href: "/san-pham/8" },
        ],
    },
    { label: "OUTLET", href: "/outlet" },
    { label: "TIN THỜI TRANG", href: "/tin" },
];
export default function Header() {
    const [openMobile, setOpenMobile] = useState(false);
    const [query, setQuery] = useState("");
    const [isMenuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const cartCount = 0;
    const primaryNav = useMemo(() => NAV_ITEMS, []);
    const storedUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        }
        catch {
            return null;
        }
    }, []);
    const handleLogout = async () => {
        try {
            await Logout();
        }
        catch (error) {
            console.error("Logout failed:", error);
        }
        finally {
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            window.location.href = "/";
        }
    };
    const handleBlur = (event) => {
        if (event.currentTarget.contains(event.relatedTarget))
            return;
        setMenuOpen(false);
    };
    return (_jsxs("header", { className: "fixed inset-x-0 top-0 z-50 w-full", children: [_jsx("div", { className: "bg-black text-white", children: _jsxs("div", { className: "mx-auto flex max-w-7xl items-center gap-4 px-4 py-3", children: [_jsx(Link, { to: "/", className: "shrink-0", children: _jsx("img", { src: "/logo.png", alt: "160STORE", className: "h-7 w-auto object-contain" }) }), _jsx("form", { onSubmit: (e) => e.preventDefault(), className: "hidden md:block md:flex-1", children: _jsx("div", { className: "mx-auto w-full max-w-[520px] lg:max-w-[480px]", children: _jsxs("div", { className: "flex items-stretch overflow-hidden rounded-md bg-white ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-white/40", children: [_jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "B\u1EA1n \u0111ang t\u00ECm g\u00EC...", className: "h-10 flex-1 bg-transparent px-4 text-sm text-black placeholder:text-neutral-500 outline-none" }), _jsx("button", { type: "submit", "aria-label": "T\u00ECm ki\u1EBFm", className: "grid h-10 w-10 place-content-center bg-black hover:bg-black/90", children: _jsx(Search, { className: "h-5 w-5 text-white cursor-pointer" }) })] }) }) }), _jsxs("nav", { className: "ml-auto hidden items-center gap-6 md:flex", children: [_jsxs(Link, { to: "/he-thong-cua-hang", className: "flex items-center gap-2 hover:opacity-90", children: [_jsx(MapPin, { className: "h-5 w-5" }), _jsx("span", { className: "text-sm", children: "C\u1EEDa h\u00E0ng" })] }), storedUser ? (_jsxs("div", { className: "relative", ref: menuRef, onBlur: handleBlur, children: [_jsxs("button", { onClick: () => setMenuOpen(!isMenuOpen), className: "flex items-center gap-1.5 hover:opacity-90", children: [_jsx(User2, { className: "h-5 w-5" }), _jsx("span", { className: "text-sm", children: "T\u00E0i kho\u1EA3n" }), _jsx(ChevronDown, { className: `h-4 w-4 transition-transform ${isMenuOpen ? "rotate-180" : "rotate-0"}` })] }), isMenuOpen && (_jsxs("div", { className: "absolute right-0 mt-3 w-48 origin-top-right rounded-md bg-white p-1 text-black shadow-lg ring-1 ring-black ring-opacity-5 z-10", children: [_jsx(Link, { to: "/tai-khoan", onClick: () => setMenuOpen(false), className: "block w-full rounded-md px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100", children: "T\u00E0i kho\u1EA3n c\u1EE7a t\u00F4i" }), _jsx("button", { onClick: handleLogout, className: "block w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50", children: "\u0110\u0103ng xu\u1EA5t" })] }))] })) : (_jsxs(Link, { to: "/dang-nhap", className: "flex items-center gap-2 hover:opacity-90", children: [_jsx(User2, { className: "h-5 w-5" }), _jsx("span", { className: "text-sm", children: "\u0110\u0103ng nh\u1EADp" })] })), _jsxs(Link, { to: "/gio-hang", className: "relative flex items-center gap-2 hover:opacity-90", children: [_jsx(ShoppingCart, { className: "h-5 w-5" }), _jsx("span", { className: "text-sm", children: "Gi\u1ECF h\u00E0ng" }), cartCount > 0 && (_jsx("span", { className: "absolute -right-2 -top-2 grid h-5 min-w-5 place-content-center rounded-full bg-white text-xs font-semibold text-black", children: cartCount }))] })] }), _jsxs("div", { className: "ml-auto flex items-center gap-2 md:hidden", children: [_jsx("button", { className: "grid h-9 w-9 place-content-center rounded-md bg-white", onClick: () => {
                                        const el = document.getElementById("m-search");
                                        el?.focus();
                                    }, children: _jsx(Search, { className: "h-5 w-5 text-black" }) }), _jsx("button", { className: "grid h-9 w-9 place-content-center rounded-md bg-white", onClick: () => setOpenMobile((v) => !v), children: openMobile ? (_jsx(X, { className: "h-5 w-5 text-black" })) : (_jsx(Menu, { className: "h-5 w-5 text-black" })) })] })] }) }), _jsxs("div", { className: "border-b border-neutral-200 bg-white", children: [_jsx("div", { className: "mx-auto hidden items-center px-4 md:flex justify-center", children: _jsx("ul", { className: "flex items-center gap-2 py-3 text-sm font-bold", children: primaryNav.map((item) => (_jsxs("li", { className: "shrink-0 group relative", children: [_jsxs(Link, { to: item.href, className: "inline-flex items-center gap-1 rounded px-3 py-2 hover:bg-neutral-100", children: [item.label === "HÀNG MỚI" && (_jsx("span", { role: "img", "aria-hidden": true, className: "mr-0.5", children: "\uD83D\uDD0E" })), _jsx("span", { className: "uppercase tracking-wide", children: item.label }), item.children && (_jsx(ChevronDown, { className: "h-4 w-4 text-neutral-500 group-hover:rotate-180 transition" })), item.badge] }), item.children && (_jsx("div", { className: "invisible absolute mt-1 w-56 rounded-md border border-neutral-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 z-10", children: _jsx("ul", { className: "flex flex-col", children: item.children.map((c) => (_jsx("li", { children: _jsx(Link, { to: c.href, className: "block rounded px-3 py-2 text-sm hover:bg-neutral-100", children: c.label }) }, c.label))) }) }))] }, item.label))) }) }), _jsxs("div", { className: "md:hidden", children: [_jsx("div", { className: "px-4 py-2", children: _jsxs("div", { className: "relative", children: [_jsx("input", { id: "m-search", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "B\u1EA1n \u0111ang t\u00ECm g\u00EC...", className: "w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 text-sm focus:outline-none" }), _jsx(Search, { className: "pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" })] }) }), openMobile && (_jsxs("ul", { className: "space-y-1 border-t border-neutral-200 p-2", children: [primaryNav.map((item) => (_jsx(MobileItem, { item: item }, item.label))), _jsxs("li", { className: "mt-2 flex items-center justify-between rounded-md bg-black px-3 py-3 text-white", children: [_jsxs(Link, { to: "/gio-hang", className: "flex items-center gap-2", children: [_jsx(ShoppingCart, { className: "h-5 w-5" }), _jsx("span", { children: "Gi\u1ECF h\u00E0ng" })] }), cartCount > 0 && (_jsx("span", { className: "grid h-5 min-w-5 place-content-center rounded-full bg-white px-1 text-xs font-semibold text-black", children: cartCount }))] })] }))] })] })] }));
}
function MobileItem({ item }) {
    const [open, setOpen] = useState(false);
    const hasChildren = !!item.children?.length;
    return (_jsxs("li", { className: "rounded-md", children: [_jsxs("div", { className: "flex items-center", children: [_jsxs(Link, { to: item.href, className: "flex-1 rounded-md px-3 py-3 text-sm font-semibold hover:bg-neutral-100", children: [_jsx("span", { className: "uppercase", children: item.label }), item.badge] }), hasChildren && (_jsx("button", { onClick: () => setOpen((v) => !v), className: "mr-1 rounded p-2 text-neutral-600", "aria-label": "M\u1EDF danh m\u1EE5c", children: _jsx(ChevronDown, { className: `h-4 w-4 transition ${open ? "rotate-180" : ""}` }) }))] }), hasChildren && open && (_jsx("ul", { className: "mb-1 ml-2 space-y-1 rounded-md border-l border-neutral-200 pl-2", children: item.children.map((c) => (_jsx("li", { children: _jsx(Link, { to: c.href, className: "block rounded px-3 py-2 text-sm hover:bg-neutral-100", children: c.label }) }, c.label))) }))] }));
}
