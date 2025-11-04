import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Admin/AdminCustomers.tsx
import { useEffect, useMemo, useState } from "react";
import { UserPlus, Search, Pencil, Trash2, Eye, EyeOff, Mail, Phone, Tags, } from "lucide-react";
import { formatVnd } from "../../../utils/format";
import AdminLayout from "../_Components/AdminLayout";
/* ================= Seed & Storage ================= */
const SAMPLE_CUSTOMERS = [
    {
        id: "C0001",
        name: "Nguyễn Văn A",
        phone: "0901 234 567",
        email: "a.nguyen@example.com",
        totalOrders: 12,
        totalSpent: 3890000,
        active: true,
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
        id: "C0002",
        name: "Trần Thị B",
        phone: "0902 345 678",
        email: "b.tran@example.com",
        totalOrders: 5,
        totalSpent: 1590000,
        active: true,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
        id: "C0003",
        name: "Lê Minh C",
        phone: "0903 456 789",
        email: "c.le@example.com",
        totalOrders: 1,
        totalSpent: 299000,
        active: false,
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
        id: "C0004",
        name: "Phạm Thu D",
        phone: "0904 567 890",
        email: "d.pham@example.com",
        totalOrders: 8,
        totalSpent: 2450000,
        active: true,
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
        id: "C0005",
        name: "Đỗ Quang E",
        phone: "0905 678 901",
        email: "e.do@example.com",
        totalOrders: 3,
        totalSpent: 799000,
        active: true,
        createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
    {
        id: "C0006",
        name: "Võ Hải F",
        phone: "0906 789 012",
        email: "f.vo@example.com",
        totalOrders: 21,
        totalSpent: 6890000,
        active: true,
        createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    },
    {
        id: "C0007",
        name: "Bùi Lan G",
        phone: "0907 890 123",
        email: "g.bui@example.com",
        totalOrders: 0,
        totalSpent: 0,
        active: false,
        createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
    {
        id: "C0008",
        name: "Huỳnh Đức H",
        phone: "0908 901 234",
        email: "h.huynh@example.com",
        totalOrders: 11,
        totalSpent: 3150000,
        active: true,
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
        id: "C0009",
        name: "Tạ Mỹ I",
        phone: "0909 012 345",
        email: "i.ta@example.com",
        totalOrders: 4,
        totalSpent: 1190000,
        active: true,
        createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    },
    {
        id: "C0010",
        name: "Trương Gia K",
        phone: "0910 123 456",
        email: "k.truong@example.com",
        totalOrders: 6,
        totalSpent: 1750000,
        active: true,
        createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
];
const LS_KEY = "admin_customers";
function loadCustomers() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                return parsed.filter((x) => {
                    const r = x;
                    return (typeof r.id === "string" &&
                        typeof r.name === "string" &&
                        typeof r.phone === "string" &&
                        typeof r.email === "string" &&
                        typeof r.totalOrders === "number" &&
                        typeof r.totalSpent === "number" &&
                        typeof r.active === "boolean" &&
                        typeof r.createdAt === "string");
                });
            }
        }
    }
    catch (err) {
        console.warn("[admin_customers] Lỗi đọc localStorage:", err);
    }
    // seed mặc định
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(SAMPLE_CUSTOMERS));
    }
    catch (err) {
        console.warn("[admin_customers] Lỗi ghi localStorage:", err);
    }
    return SAMPLE_CUSTOMERS;
}
function saveCustomers(items) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(items));
    }
    catch (err) {
        console.warn("[admin_customers] Lỗi ghi localStorage:", err);
    }
}
/* ================= Page ================= */
const PAGE_SIZE = 10;
export default function AdminCustomers() {
    const [items, setItems] = useState(() => loadCustomers());
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [checked, setChecked] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    // đồng bộ LS
    useEffect(() => saveCustomers(items), [items]);
    // filter/search
    const filtered = useMemo(() => {
        const text = q.trim().toLowerCase();
        return items.filter((c) => {
            const okText = !text ||
                c.name.toLowerCase().includes(text) ||
                c.email.toLowerCase().includes(text) ||
                c.phone.replace(/\s/g, "").includes(text.replace(/\s/g, ""));
            const okStatus = status === "all" || (status === "active" ? c.active : !c.active);
            return okText && okStatus;
        });
    }, [items, q, status]);
    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);
    // khi thay filter => về trang 1
    useEffect(() => {
        setPage(1);
    }, [q, status]);
    const allCheckedOnPage = paged.length > 0 && paged.every((c) => checked[c.id]);
    const someCheckedOnPage = paged.some((c) => checked[c.id]);
    function toggleAllOnPage(e) {
        const on = e.target.checked;
        setChecked((prev) => {
            const next = { ...prev };
            paged.forEach((c) => {
                next[c.id] = on;
            });
            return next;
        });
    }
    function toggleOne(id, on) {
        setChecked((prev) => ({ ...prev, [id]: on }));
    }
    function delSelected() {
        const ids = Object.keys(checked).filter((k) => checked[k]);
        if (!ids.length)
            return;
        if (!confirm(`Xoá ${ids.length} khách hàng đã chọn?`))
            return;
        setItems((prev) => prev.filter((c) => !ids.includes(c.id)));
        setChecked({});
    }
    function setActiveSelected(active) {
        const ids = Object.keys(checked).filter((k) => checked[k]);
        if (!ids.length)
            return;
        setItems((prev) => prev.map((c) => (ids.includes(c.id) ? { ...c, active } : c)));
        setChecked({});
    }
    function removeOne(id) {
        if (!confirm("Xoá khách hàng này?"))
            return;
        setItems((prev) => prev.filter((c) => c.id !== id));
    }
    function toggleActive(id) {
        setItems((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
    }
    function onSubmitForm(payload) {
        // Create
        if (!payload.id) {
            const id = `C${String(Date.now()).slice(-8)}`;
            const newItem = {
                id,
                name: payload.name,
                phone: payload.phone,
                email: payload.email,
                active: payload.active,
                totalOrders: 0,
                totalSpent: 0,
                createdAt: new Date().toISOString(),
            };
            setItems((prev) => [newItem, ...prev]);
            return;
        }
        // Update
        setItems((prev) => prev.map((c) => c.id === payload.id
            ? {
                ...c,
                name: payload.name,
                phone: payload.phone,
                email: payload.email,
                active: payload.active,
            }
            : c));
    }
    return (_jsx(AdminLayout, { title: "Qu\u1EA3n l\u00FD kh\u00E1ch h\u00E0ng", actions: _jsxs("button", { onClick: () => {
                setEditing(null);
                setShowForm(true);
            }, className: "inline-flex items-center gap-2 rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-black/90", children: [_jsx(UserPlus, { className: "h-4 w-4" }), "Th\u00EAm kh\u00E1ch h\u00E0ng"] }), children: _jsxs("div", { className: "min-h-screen bg-neutral-50", children: [_jsxs("div", { className: "mx-auto max-w-7xl px-4 py-6", children: [_jsxs("div", { className: "mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [_jsxs("div", { className: "relative", children: [_jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "T\u00ECm theo t\u00EAn, email ho\u1EB7c S\u0110T\u2026", className: "h-10 w-full rounded-md border border-neutral-300 pl-10 pr-3 text-sm outline-none focus:border-black" }), _jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" })] }), _jsx("div", { children: _jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black", children: [_jsx("option", { value: "all", children: "T\u1EA5t c\u1EA3 tr\u1EA1ng th\u00E1i" }), _jsx("option", { value: "active", children: "\u0110ang ho\u1EA1t \u0111\u1ED9ng" }), _jsx("option", { value: "blocked", children: "\u0110\u00E3 ch\u1EB7n" })] }) }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 lg:col-span-2", children: [_jsx("button", { onClick: () => setActiveSelected(true), className: "rounded-md border px-3 py-2 text-sm hover:bg-neutral-50", title: "M\u1EDF ch\u1EB7n c\u00E1c KH \u0111\u00E3 ch\u1ECDn", children: "M\u1EDF ch\u1EB7n" }), _jsx("button", { onClick: () => setActiveSelected(false), className: "rounded-md border px-3 py-2 text-sm hover:bg-neutral-50", title: "Ch\u1EB7n c\u00E1c KH \u0111\u00E3 ch\u1ECDn", children: "Ch\u1EB7n" }), _jsxs("button", { onClick: delSelected, className: "inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm text-red-600 hover:bg-red-50", title: "Xo\u00E1 c\u00E1c KH \u0111\u00E3 ch\u1ECDn", children: [_jsx(Trash2, { className: "h-4 w-4" }), "Xo\u00E1"] })] })] }), _jsxs("div", { className: "overflow-hidden rounded-xl border border-neutral-200 bg-white", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-[920px] w-full table-fixed", children: [_jsx("thead", { className: "bg-neutral-50 text-left text-sm font-semibold text-neutral-700", children: _jsxs("tr", { children: [_jsx("th", { className: "w-10 px-3 py-3", children: _jsx("input", { type: "checkbox", className: "accent-black", checked: allCheckedOnPage, ref: (el) => {
                                                                    if (el)
                                                                        el.indeterminate =
                                                                            !allCheckedOnPage && someCheckedOnPage;
                                                                }, onChange: toggleAllOnPage }) }), _jsx("th", { className: "px-3 py-3", children: "Kh\u00E1ch h\u00E0ng" }), _jsx("th", { className: "w-[170px] px-3 py-3", children: "Email" }), _jsx("th", { className: "w-[130px] px-3 py-3", children: "\u0110i\u1EC7n tho\u1EA1i" }), _jsx("th", { className: "w-[110px] px-3 py-3", children: "\u0110\u01A1n h\u00E0ng" }), _jsx("th", { className: "w-[140px] px-3 py-3", children: "T\u1ED5ng chi" }), _jsx("th", { className: "w-[120px] px-3 py-3", children: "Tr\u1EA1ng th\u00E1i" }), _jsx("th", { className: "w-[140px] px-3 py-3", children: "Thao t\u00E1c" })] }) }), _jsxs("tbody", { className: "divide-y text-sm", children: [paged.map((c) => (_jsxs("tr", { className: "hover:bg-neutral-50/50", children: [_jsx("td", { className: "px-3 py-2", children: _jsx("input", { type: "checkbox", className: "accent-black", checked: !!checked[c.id], onChange: (e) => toggleOne(c.id, e.target.checked) }) }), _jsxs("td", { className: "px-3 py-2", children: [_jsx("div", { className: "font-semibold", children: c.name }), _jsxs("div", { className: "mt-0.5 flex items-center gap-1 text-xs text-neutral-500", children: [_jsx(Tags, { className: "h-3.5 w-3.5" }), _jsx("span", { children: new Date(c.createdAt).toLocaleDateString("vi-VN") })] })] }), _jsx("td", { className: "px-3 py-2 truncate", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Mail, { className: "h-3.5 w-3.5 text-neutral-500" }), _jsx("span", { className: "truncate", children: c.email })] }) }), _jsx("td", { className: "px-3 py-2", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Phone, { className: "h-3.5 w-3.5 text-neutral-500" }), _jsx("span", { children: c.phone })] }) }), _jsx("td", { className: "px-3 py-2", children: c.totalOrders }), _jsx("td", { className: "px-3 py-2 font-semibold", children: formatVnd(c.totalSpent) }), _jsx("td", { className: "px-3 py-2", children: c.active ? (_jsx("span", { className: "rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700", children: "\u0110ang ho\u1EA1t \u0111\u1ED9ng" })) : (_jsx("span", { className: "rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-700", children: "\u0110\u00E3 ch\u1EB7n" })) }), _jsx("td", { className: "px-3 py-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => {
                                                                                setEditing(c);
                                                                                setShowForm(true);
                                                                            }, className: "rounded-md border px-2 py-1.5 text-xs hover:bg-neutral-50", title: "S\u1EEDa", children: _jsx(Pencil, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => toggleActive(c.id), className: "rounded-md border px-2 py-1.5 text-xs hover:bg-neutral-50", title: c.active
                                                                                ? "Chặn khách hàng"
                                                                                : "Mở chặn khách hàng", children: c.active ? (_jsx(EyeOff, { className: "h-4 w-4" })) : (_jsx(Eye, { className: "h-4 w-4" })) }), _jsx("button", { onClick: () => removeOne(c.id), className: "rounded-md border px-2 py-1.5 text-xs text-red-600 hover:bg-red-50", title: "Xo\u00E1", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }) })] }, c.id))), paged.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 8, className: "px-3 py-10 text-center text-sm text-neutral-600", children: "Kh\u00F4ng c\u00F3 kh\u00E1ch h\u00E0ng ph\u00F9 h\u1EE3p." }) }))] })] }) }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 border-t px-3 py-3 text-sm", children: [_jsxs("div", { children: ["Hi\u1EC3n th\u1ECB ", _jsx("b", { children: paged.length }), " / ", _jsx("b", { children: filtered.length }), " kh\u00E1ch h\u00E0ng"] }), _jsx(PaginationSimple, { page: page, pageCount: pageCount, onChange: (p) => {
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                                setPage(p);
                                            } })] })] })] }), showForm && (_jsx(CustomerFormModal, { initial: editing ?? undefined, onClose: () => setShowForm(false), onSubmit: (payload) => {
                        onSubmitForm(payload);
                        setShowForm(false);
                    } }))] }) }));
}
/* ================= Small components ================= */
function PaginationSimple({ page, pageCount, onChange, }) {
    if (pageCount <= 1)
        return null;
    const windowSize = 5;
    const half = Math.floor(windowSize / 2);
    const from = Math.max(1, page - half);
    const to = Math.min(pageCount, from + windowSize - 1);
    const pages = Array.from({ length: to - from + 1 }, (_, i) => from + i);
    const itemCls = "rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-40";
    return (_jsxs("nav", { className: "flex items-center justify-center gap-2", "aria-label": "Pagination", children: [_jsx("button", { type: "button", className: itemCls, onClick: () => onChange(1), disabled: page === 1, children: "\u00AB \u0110\u1EA7u" }), _jsx("button", { type: "button", className: itemCls, onClick: () => onChange(Math.max(1, page - 1)), disabled: page === 1, children: "\u2039 Tr\u01B0\u1EDBc" }), from > 1 && _jsx("span", { className: "px-1 text-neutral-500", children: "\u2026" }), pages.map((p) => (_jsx("button", { type: "button", onClick: () => onChange(p), className: p === page
                    ? `${itemCls} border-black bg-black text-white hover:bg-black`
                    : itemCls, children: p }, p))), to < pageCount && _jsx("span", { className: "px-1 text-neutral-500", children: "\u2026" }), _jsx("button", { type: "button", className: itemCls, onClick: () => onChange(Math.min(pageCount, page + 1)), disabled: page === pageCount, children: "Sau \u203A" }), _jsx("button", { type: "button", className: itemCls, onClick: () => onChange(pageCount), disabled: page === pageCount, children: "Cu\u1ED1i \u00BB" })] }));
}
function CustomerFormModal({ initial, onClose, onSubmit, }) {
    // Khởi tạo form: lấy các trường editable, giữ id nếu edit
    const [form, setForm] = useState(() => {
        if (initial) {
            const { id, name, phone, email, active } = initial;
            return { id, name, phone, email, active };
        }
        return {
            name: "",
            phone: "",
            email: "",
            active: true,
        };
    });
    function handleChange(key, val) {
        setForm((prev) => ({ ...prev, [key]: val }));
    }
    function submit() {
        // validate tối thiểu
        if (!form.name.trim())
            return alert("Vui lòng nhập tên khách hàng");
        if (!form.phone.trim())
            return alert("Vui lòng nhập số điện thoại");
        if (!form.email.trim())
            return alert("Vui lòng nhập email");
        onSubmit(form);
    }
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items=end justify-center bg-black/30 p-0 sm:items-center sm:p-6", children: _jsxs("div", { className: "w-full max-w-xl overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl", children: [_jsx("div", { className: "border-b px-4 py-3", children: _jsx("h3", { className: "text-base font-extrabold", children: form.id ? "Cập nhật khách hàng" : "Thêm khách hàng" }) }), _jsxs("div", { className: "space-y-3 p-4", children: [_jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs font-semibold text-neutral-600", children: "H\u1ECD t\u00EAn" }), _jsx("input", { value: form.name, onChange: (e) => handleChange("name", e.target.value), className: "h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs font-semibold text-neutral-600", children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i" }), _jsx("input", { value: form.phone, onChange: (e) => handleChange("phone", e.target.value), className: "h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs font-semibold text-neutral-600", children: "Email" }), _jsx("input", { value: form.email, onChange: (e) => handleChange("email", e.target.value), className: "h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black", placeholder: "name@example.com" })] }), _jsxs("label", { className: "flex items-center gap-2 text-sm", children: [_jsx("input", { type: "checkbox", className: "accent-black", checked: form.active, onChange: (e) => handleChange("active", e.target.checked) }), "\u0110ang ho\u1EA1t \u0111\u1ED9ng"] }), _jsxs("div", { className: "rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm", children: [_jsx("div", { className: "font-semibold", children: "Xem tr\u01B0\u1EDBc" }), _jsxs("div", { className: "mt-1 text-neutral-700", children: [form.name, " \u2022 ", form.email, " \u2022 ", form.phone, " \u2022", " ", form.active ? "Đang hoạt động" : "Đã chặn"] })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-2 border-t px-4 py-3", children: [_jsx("button", { onClick: onClose, className: "rounded-md border px-3 py-2 text-sm hover:bg-neutral-50", children: "Hu\u1EF7" }), _jsx("button", { onClick: submit, className: "rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-black/90", children: form.id ? "Lưu thay đổi" : "Tạo mới" })] })] }) }));
}
