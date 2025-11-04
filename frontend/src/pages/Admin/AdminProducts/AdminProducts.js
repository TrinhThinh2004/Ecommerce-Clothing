import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { PackagePlus, Search, Pencil, Trash2, Image as ImageIcon, DollarSign, Package, Archive, AlertTriangle, CheckCircle2, XCircle, ServerCrash, RefreshCw, UploadCloud } from "lucide-react";
import { formatVnd } from "../../../utils/format";
import AdminLayout from "../_Components/AdminLayout";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../../../api/products";
import { toast } from 'react-toastify';
const PAGE_SIZE = 10;
const LOW_STOCK_THRESHOLD = 5;
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
export default function AdminProducts() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [checked, setChecked] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    useEffect(() => {
        loadData();
    }, []);
    async function loadData() {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchProducts();
            setItems(data);
        }
        catch (err) {
            setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.");
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }
    const stats = useMemo(() => {
        const totalValue = items.reduce((sum, p) => {
            const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
            return sum + price * p.stock_quantity;
        }, 0);
        const lowStockCount = items.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= LOW_STOCK_THRESHOLD).length;
        const outOfStockCount = items.filter((p) => p.stock_quantity === 0).length;
        return { productCount: items.length, totalValue, lowStockCount, outOfStockCount };
    }, [items]);
    const filtered = useMemo(() => {
        const text = q.trim().toLowerCase();
        return items.filter((p) => {
            const okText = !text || p.name.toLowerCase().includes(text);
            const okStatus = status === "all" || (status === "active" ? (p.active ?? true) : !(p.active ?? true));
            return okText && okStatus;
        });
    }, [items, q, status]);
    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);
    useEffect(() => setPage(1), [q, status]);
    const allCheckedOnPage = paged.length > 0 && paged.every((p) => checked[p.product_id]);
    const someCheckedOnPage = paged.some((p) => checked[p.product_id]);
    function toggleAllOnPage(e) {
        const on = e.target.checked;
        setChecked((prev) => {
            const next = { ...prev };
            paged.forEach((p) => { next[String(p.product_id)] = on; });
            return next;
        });
    }
    function toggleOne(id, on) { setChecked((prev) => ({ ...prev, [String(id)]: on })); }
    async function handleFormSubmit(payload, imageFile, id) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, String(value));
            }
        });
        if (imageFile) {
            formData.append('image', imageFile);
        }
        try {
            if (id) {
                const updatedProduct = await updateProduct(id, formData);
                setItems(prev => prev.map(p => p.product_id === updatedProduct.product_id ? updatedProduct : p));
            }
            else {
                const newProduct = await createProduct(formData);
                setItems(prev => [newProduct, ...prev]);
            }
            setShowForm(false);
            toast.success(id ? 'Cập nhật sản phẩm thành công' : 'Tạo sản phẩm thành công');
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            toast.error(`Đã xảy ra lỗi: ${message}`);
        }
    }
    async function handleRemoveOne(id) {
        if (!confirm("Bạn có chắc muốn xoá sản phẩm này?"))
            return;
        try {
            const success = await deleteProduct(id);
            if (success) {
                setItems(prev => prev.filter(p => p.product_id !== id));
                toast.success('Xoá sản phẩm thành công');
            }
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            toast.error(`Đã xảy ra lỗi khi xoá: ${message}`);
        }
    }
    async function handleDelSelected() {
        const idsToDelete = Object.keys(checked).filter((k) => checked[k]);
        if (!idsToDelete.length || !confirm(`Xoá ${idsToDelete.length} sản phẩm đã chọn?`))
            return;
        try {
            await Promise.all(idsToDelete.map(id => deleteProduct(id)));
            setItems(prev => prev.filter(p => !idsToDelete.includes(String(p.product_id))));
            setChecked({});
            toast.success(`Đã xoá ${idsToDelete.length} sản phẩm thành công`);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            toast.error(`Đã xảy ra lỗi khi xoá hàng loạt: ${message}`);
        }
    }
    return (_jsxs(AdminLayout, { title: "Qu\u1EA3n l\u00FD s\u1EA3n ph\u1EA9m", actions: _jsxs("button", { onClick: () => { setEditing(null); setShowForm(true); }, className: "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2", children: [_jsx(PackagePlus, { className: "h-4 w-4" }), "Th\u00EAm s\u1EA3n ph\u1EA9m"] }), children: [loading ? (_jsxs("div", { className: "flex h-64 items-center justify-center text-neutral-500", children: [_jsx(RefreshCw, { className: "h-6 w-6 animate-spin mr-2" }), "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u..."] })) : error ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-64 text-red-600 bg-red-50 rounded-lg", children: [_jsx(ServerCrash, { className: "h-10 w-10 mb-2" }), _jsx("p", { className: "font-semibold", children: error }), _jsx("button", { onClick: loadData, className: "mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700", children: "Th\u1EED l\u1EA1i" })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4", children: [_jsx(StatCard, { icon: Package, title: "T\u1ED5ng s\u1EA3n ph\u1EA9m", value: stats.productCount }), _jsx(StatCard, { icon: DollarSign, title: "T\u1ED5ng gi\u00E1 tr\u1ECB kho", value: formatVnd(stats.totalValue) }), _jsx(StatCard, { icon: Archive, title: "H\u1EBFt h\u00E0ng", value: stats.outOfStockCount, color: "red" }), _jsx(StatCard, { icon: AlertTriangle, title: "S\u1EAFp h\u1EBFt h\u00E0ng", value: stats.lowStockCount, color: "yellow" })] }), _jsxs("div", { className: "rounded-lg border border-neutral-200 bg-white shadow-sm", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 border-b p-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "T\u00ECm theo t\u00EAn s\u1EA3n ph\u1EA9m\u2026", className: "h-10 w-full rounded-lg border border-neutral-300 bg-neutral-50 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-64" })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "h-10 rounded-lg border border-neutral-300 bg-neutral-50 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500", children: [_jsx("option", { value: "all", children: "T\u1EA5t c\u1EA3 tr\u1EA1ng th\u00E1i" }), _jsx("option", { value: "active", children: "\u0110ang b\u00E1n" }), _jsx("option", { value: "inactive", children: "\u0110\u00E3 \u1EA9n" })] }), someCheckedOnPage && (_jsx("div", { className: "flex items-center gap-2", children: _jsx("button", { onClick: handleDelSelected, className: "action-btn-danger", title: "Xo\u00E1 c\u00E1c s\u1EA3n ph\u1EA9m \u0111\u00E3 ch\u1ECDn", children: _jsx(Trash2, { className: "h-4 w-4" }) }) }))] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-600", children: _jsxs("tr", { children: [_jsx("th", { className: "w-10 px-4 py-3", children: _jsx("input", { type: "checkbox", className: "h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500", checked: allCheckedOnPage, ref: (el) => { if (el)
                                                                el.indeterminate = !allCheckedOnPage && someCheckedOnPage; }, onChange: toggleAllOnPage }) }), _jsx("th", { className: "px-4 py-3", children: "S\u1EA3n ph\u1EA9m" }), _jsx("th", { className: "w-40 px-4 py-3", children: "Gi\u00E1 b\u00E1n" }), _jsx("th", { className: "w-32 px-4 py-3", children: "T\u1ED3n kho" }), _jsx("th", { className: "w-36 px-4 py-3", children: "Tr\u1EA1ng th\u00E1i" }), _jsx("th", { className: "w-28 px-4 py-3 text-center", children: "Thao t\u00E1c" })] }) }), _jsxs("tbody", { className: "divide-y divide-neutral-200", children: [paged.map((p) => (_jsxs("tr", { className: "hover:bg-neutral-50", children: [_jsx("td", { className: "px-4 py-3", children: _jsx("input", { type: "checkbox", className: "h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500", checked: !!checked[String(p.product_id)], onChange: (e) => toggleOne(p.product_id, e.target.checked) }) }), _jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: p.image_url ? `${API_BASE_URL}${p.image_url}` : 'https://placehold.co/100x100/e2e8f0/adb5bd?text=N/A', alt: p.name, className: "h-12 w-12 flex-shrink-0 rounded-md bg-neutral-100 object-cover" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-neutral-800", children: p.name }), _jsxs("div", { className: "mt-1 text-xs text-neutral-500", children: ["Category ID: ", p.category_id || 'N/A'] })] })] }) }), _jsx("td", { className: "px-4 py-3 font-semibold text-neutral-800", children: formatVnd(Number(p.price)) }), _jsx("td", { className: "px-4 py-3", children: _jsx(StockBadge, { stock: p.stock_quantity }) }), _jsx("td", { className: "px-4 py-3", children: _jsx(StatusBadge, { active: p.active ?? true }) }), _jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("button", { onClick: () => { setEditing(p); setShowForm(true); }, className: "action-btn", title: "S\u1EEDa", children: _jsx(Pencil, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => handleRemoveOne(p.product_id), className: "action-btn-danger", title: "Xo\u00E1", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }) })] }, p.product_id))), paged.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "py-16 text-center text-neutral-500", children: "Kh\u00F4ng t\u00ECm th\u1EA5y s\u1EA3n ph\u1EA9m n\u00E0o." }) }))] })] }) }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 border-t p-4", children: [_jsxs("div", { className: "text-xs text-neutral-600", children: ["Hi\u1EC3n th\u1ECB ", _jsx("b", { children: paged.length }), " trong t\u1ED5ng s\u1ED1 ", _jsx("b", { children: filtered.length }), " s\u1EA3n ph\u1EA9m"] }), _jsx(PaginationSimple, { page: page, pageCount: pageCount, onChange: (p) => { window.scrollTo({ top: 0, behavior: "smooth" }); setPage(p); } })] })] })] })), showForm && (_jsx(ProductFormModal, { initial: editing ?? undefined, onClose: () => setShowForm(false), onSubmit: handleFormSubmit }))] }));
}
const StatCard = ({ icon: Icon, title, value, color }) => {
    const colors = { red: "text-red-600 bg-red-50", yellow: "text-yellow-600 bg-yellow-50", default: "text-blue-600 bg-blue-50" };
    return (_jsxs("div", { className: "rounded-lg border border-neutral-200 bg-white p-4 shadow-sm", children: [_jsx("div", { className: `mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg ${colors[color || 'default']}`, children: _jsx(Icon, { className: "h-5 w-5" }) }), _jsx("h3", { className: "text-xs font-medium uppercase text-neutral-500", children: title }), _jsx("p", { className: "text-2xl font-bold text-neutral-800", children: value })] }));
};
const StatusBadge = ({ active }) => active ? _jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700", children: [_jsx(CheckCircle2, { className: "h-3.5 w-3.5" }), "\u0110ang b\u00E1n"] }) : _jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-600", children: [_jsx(XCircle, { className: "h-3.5 w-3.5" }), "\u0110\u00E3 \u1EA9n"] });
const StockBadge = ({ stock }) => {
    if (stock === 0)
        return _jsx("span", { className: "font-semibold text-red-600", children: "H\u1EBFt h\u00E0ng" });
    if (stock <= LOW_STOCK_THRESHOLD)
        return _jsxs("span", { className: "font-semibold text-yellow-600", children: [stock, " (S\u1EAFp h\u1EBFt)"] });
    return _jsx("span", { children: stock });
};
function PaginationSimple({ page, pageCount, onChange }) {
    if (pageCount <= 1)
        return null;
    const windowSize = 5;
    const half = Math.floor(windowSize / 2);
    let from = Math.max(1, page - half);
    let to = Math.min(pageCount, from + windowSize - 1);
    if (to - from + 1 < windowSize) {
        from = Math.max(1, to - windowSize + 1);
    }
    const pages = Array.from({ length: to - from + 1 }, (_, i) => from + i);
    const itemCls = "h-8 w-8 grid place-content-center rounded-lg border text-xs transition-colors disabled:opacity-50";
    return (_jsxs("nav", { className: "flex items-center gap-2", "aria-label": "Pagination", children: [_jsx("button", { type: "button", className: itemCls, onClick: () => onChange(1), disabled: page === 1, children: "\u00AB" }), _jsx("button", { type: "button", className: itemCls, onClick: () => onChange(page - 1), disabled: page === 1, children: "\u2039" }), from > 1 && _jsx("span", { className: "px-1 text-neutral-500", children: "\u2026" }), pages.map((p) => (_jsx("button", { type: "button", onClick: () => onChange(p), className: p === page ? `${itemCls} border-blue-600 bg-blue-600 text-white` : `${itemCls} hover:bg-neutral-100`, children: p }, p))), to < pageCount && _jsx("span", { className: "px-1 text-neutral-500", children: "\u2026" }), _jsx("button", { type: "button", className: itemCls, onClick: () => onChange(page + 1), disabled: page === pageCount, children: "\u203A" }), _jsx("button", { type: "button", className: itemCls, onClick: () => onChange(pageCount), disabled: page === pageCount, children: "\u00BB" })] }));
}
function ProductFormModal({ initial, onClose, onSubmit, }) {
    const [form, setForm] = useState(() => {
        if (initial) {
            const { product_id, created_at, updated_at, ...editableFields } = initial;
            return {
                ...editableFields,
                price: Number(editableFields.price)
            };
        }
        return { name: "", description: "", image_url: "", price: 0, stock_quantity: 0, active: true };
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(initial?.image_url ? `${API_BASE_URL}${initial.image_url}` : null);
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const newPreviewUrl = URL.createObjectURL(file);
            setPreviewUrl(newPreviewUrl);
        }
    };
    function handleChange(key, val) {
        setForm((prev) => ({ ...prev, [key]: val }));
    }
    function submit() {
        if (!form.name?.trim()) {
            toast.error("Vui lòng nhập tên sản phẩm");
            return;
        }
        if (form.price === undefined || Number(form.price) <= 0) {
            toast.error("Giá bán phải lớn hơn 0");
            return;
        }
        const payload = {
            name: form.name,
            description: form.description || null,
            price: Number(form.price),
            stock_quantity: form.stock_quantity || 0,
            image_url: form.image_url || null,
            active: form.active ?? true,
        };
        onSubmit(payload, imageFile, initial?.product_id);
    }
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4", onClick: onClose, children: _jsxs("div", { className: "w-full max-w-3xl rounded-t-2xl bg-white shadow-xl sm:rounded-2xl", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between border-b px-6 py-4", children: [_jsx("h3", { className: "text-lg font-bold", children: initial?.product_id ? "Cập nhật sản phẩm" : "Thêm sản phẩm" }), _jsx("button", { onClick: onClose, className: "rounded-full p-1.5 hover:bg-neutral-100", children: _jsx(XCircle, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "grid max-h-[70vh] gap-6 overflow-y-auto p-6 sm:grid-cols-4", children: [_jsx("div", { className: "sm:col-span-2", children: _jsxs("div", { className: "space-y-4", children: [_jsx(FormInput, { label: "T\u00EAn s\u1EA3n ph\u1EA9m", value: form.name, onChange: (e) => handleChange("name", e.target.value), icon: Package, required: true }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs font-semibold text-neutral-600", children: "M\u00F4 t\u1EA3" }), _jsx("textarea", { value: form.description || '', onChange: (e) => handleChange("description", e.target.value), rows: 5, className: "w-full rounded-lg border border-neutral-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(FormInput, { label: "Gi\u00E1 b\u00E1n (VND)", type: "number", value: form.price, onChange: (e) => handleChange("price", e.target.valueAsNumber), icon: DollarSign, required: true }), _jsx(FormInput, { label: "T\u1ED3n kho", type: "number", value: form.stock_quantity, onChange: (e) => handleChange("stock_quantity", e.target.valueAsNumber), icon: Archive, required: true })] })] }) }), _jsxs("div", { className: "sm:col-span-2", children: [_jsx("label", { className: "mb-1 block text-xs font-semibold text-neutral-600", children: "\u1EA2nh s\u1EA3n ph\u1EA9m" }), _jsxs("div", { className: "flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-neutral-50 p-4", children: [_jsx("div", { className: "aspect-square w-full mb-4", children: previewUrl ? (_jsx("img", { src: previewUrl, alt: "Preview", className: "h-full w-full rounded-lg object-cover" })) : (_jsx("div", { className: "flex h-full w-full items-center justify-center rounded-lg bg-neutral-100", children: _jsx(ImageIcon, { className: "h-10 w-10 text-neutral-400" }) })) }), _jsxs("label", { htmlFor: "image-upload", className: "cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-700 border border-neutral-300 hover:bg-neutral-50", children: [_jsx(UploadCloud, { className: "h-4 w-4" }), _jsx("span", { children: imageFile ? "Đổi ảnh" : "Chọn ảnh" })] }), _jsx("input", { id: "image-upload", type: "file", accept: "image/*", className: "hidden", onChange: handleFileChange }), imageFile && _jsx("p", { className: "text-xs text-neutral-500 mt-2 truncate", children: imageFile.name })] })] })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 border-t bg-neutral-50 px-6 py-4", children: [_jsxs("label", { className: "flex cursor-pointer items-center gap-2 text-sm", children: [_jsx("input", { type: "checkbox", className: "h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500", checked: form.active, onChange: (e) => handleChange("active", e.target.checked) }), form.active ? "Đang bán" : "Tạm ẩn"] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: onClose, className: "rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50", children: "Hu\u1EF7" }), _jsx("button", { onClick: submit, className: "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700", children: initial?.product_id ? "Lưu thay đổi" : "Tạo sản phẩm" })] })] })] }) }));
}
const FormInput = ({ label, icon: Icon, ...props }) => (_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-xs font-semibold text-neutral-600", children: label }), _jsxs("div", { className: "relative", children: [_jsx("span", { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400", children: _jsx(Icon, { className: "h-4 w-4" }) }), _jsx("input", { className: "h-10 w-full rounded-lg border border-neutral-300 bg-transparent pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500", ...props })] })] }));
