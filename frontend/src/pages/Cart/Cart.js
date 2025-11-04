import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/Cart/CartPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, CreditCard, Truck, Wallet } from "lucide-react";
import { formatVnd } from "../../utils/format";
/* ========= Helpers ========= */
function normalizeCart(raw) {
    if (!Array.isArray(raw))
        return [];
    const arr = raw;
    return arr
        .map((rec) => {
        const item = rec.item ?? {};
        const itemRec = item;
        const id = (typeof itemRec.id === "string" && itemRec.id) ||
            (typeof rec.id === "string" && rec.id) ||
            "";
        const name = (typeof itemRec.name === "string" && itemRec.name) ||
            (typeof rec.name === "string" && rec.name) ||
            "";
        const image = (typeof itemRec.image === "string" && itemRec.image) ||
            (typeof rec.image === "string" && rec.image) ||
            "";
        const price = (typeof itemRec.price === "number" && itemRec.price) ||
            (typeof rec.price === "number" && rec.price) ||
            0;
        const qty = typeof rec.qty === "number" ? rec.qty : 1;
        const size = typeof rec.size === "string"
            ? rec.size
            : typeof itemRec.size === "string"
                ? itemRec.size
                : undefined;
        if (!id || !name || !image)
            return null;
        const normalized = { id, name, image, price, qty, size };
        return normalized;
    })
        .filter((x) => x !== null);
}
const SEED = [
    {
        id: "1",
        name: "Áo Thun Nam ICONDENIM Orgnls",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
        price: 299000,
        qty: 1,
        size: "M",
    },
    {
        id: "2",
        name: "Quần Jean Nam ICONDENIM Grey Baggy",
        image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop",
        price: 549000,
        qty: 1,
        size: "L",
    },
];
// Tailwind shortcut thay cho "className='input'"
const INPUT_CLS = "h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black";
/* ========= Page ========= */
export default function Cart() {
    const [items, setItems] = useState(() => {
        try {
            const raw = localStorage.getItem("cart");
            if (raw) {
                const parsed = JSON.parse(raw);
                const normalized = normalizeCart(parsed);
                return normalized.length ? normalized : SEED;
            }
        }
        catch (err) {
            console.warn("Không đọc được cart từ localStorage:", err);
        }
        return SEED;
    });
    // form (mock — sau này bind API)
    const [country] = useState(", Vietnam 7000");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("0359744735");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [note, setNote] = useState("");
    const [pay, setPay] = useState("cod");
    const [voucher, setVoucher] = useState("");
    const [applied, setApplied] = useState({
        amount: 0,
    });
    // sync localStorage (demo)
    useEffect(() => {
        const to = items.map((i) => ({
            id: i.id,
            qty: i.qty,
            item: { id: i.id, name: i.name, image: i.image, price: i.price },
            size: i.size,
        }));
        localStorage.setItem("cart", JSON.stringify(to));
    }, [items]);
    // prices
    const subTotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);
    const ship = useMemo(() => (subTotal >= 299000 || applied.code === "FREESHIP" ? 0 : 30000), [subTotal, applied]);
    const discount = applied.amount;
    const grand = Math.max(0, subTotal + ship - discount);
    function changeQty(id, delta) {
        setItems((prev) => prev
            .map((it) => it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)
            .filter(Boolean));
    }
    function removeItem(id) {
        setItems((prev) => prev.filter((it) => it.id !== id));
    }
    function applyVoucher() {
        const code = voucher.trim().toUpperCase();
        if (!code)
            return setApplied({ amount: 0 });
        if (code === "SEP30")
            setApplied({ code, amount: 30000 });
        else if (code === "FREESHIP")
            setApplied({ code, amount: 0 });
        else {
            setApplied({ amount: 0 });
            // demo
            alert("Mã không hợp lệ (demo). Thử SEP30 hoặc FREESHIP");
        }
    }
    function placeOrder() {
        if (!items.length)
            return;
        if (!name || !phone || !address || !city) {
            alert("Vui lòng điền đầy đủ thông tin giao hàng.");
            return;
        }
        alert(`Đặt hàng thành công (demo)!\nTổng thanh toán: ${formatVnd(grand)}\nHình thức: ${pay.toUpperCase()}`);
        localStorage.removeItem("cart");
        setItems([]);
    }
    return (_jsxs("div", { className: "bg-gradient-to-b from-amber-50 to-amber-100 pb-28", children: [_jsxs("div", { className: "mx-auto w-full max-w-6xl px-3 py-6 lg:px-0", children: [_jsx("h1", { className: "mb-4 text-2xl font-extrabold", children: "Gi\u1ECF h\u00E0ng" }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-[1fr,0.9fr]", children: [_jsxs("section", { className: "space-y-4", children: [_jsx(Card, { title: "Th\u00F4ng tin \u0111\u01A1n h\u00E0ng", children: _jsxs("div", { className: "grid gap-3", children: [_jsx("input", { value: country, disabled: true, className: INPUT_CLS }), _jsx("input", { placeholder: "H\u1ECD v\u00E0 t\u00EAn", className: INPUT_CLS, value: name, onChange: (e) => setName(e.target.value) }), _jsx("input", { placeholder: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i", className: INPUT_CLS, value: phone, onChange: (e) => setPhone(e.target.value) }), _jsx("input", { placeholder: "\u0110\u1ECBa ch\u1EC9", className: INPUT_CLS, value: address, onChange: (e) => setAddress(e.target.value) }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [_jsxs("select", { className: INPUT_CLS, value: city, onChange: (e) => setCity(e.target.value), children: [_jsx("option", { value: "", children: "T\u1EC9nh/Th\u00E0nh ph\u1ED1" }), _jsx("option", { children: "TP. H\u1ED3 Ch\u00ED Minh" }), _jsx("option", { children: "H\u00E0 N\u1ED9i" }), _jsx("option", { children: "\u0110\u00E0 N\u1EB5ng" }), _jsx("option", { children: "Ki\u00EAn Giang" })] }), _jsxs("select", { className: INPUT_CLS, value: district, onChange: (e) => setDistrict(e.target.value), children: [_jsx("option", { value: "", children: "Qu\u1EADn/Huy\u1EC7n" }), _jsx("option", { children: "Ph\u00FA Nhu\u1EADn" }), _jsx("option", { children: "Hai B\u00E0 Tr\u01B0ng" }), _jsx("option", { children: "Thanh Kh\u00EA" })] }), _jsxs("select", { className: INPUT_CLS, value: ward, onChange: (e) => setWard(e.target.value), children: [_jsx("option", { value: "", children: "Ph\u01B0\u1EDDng/X\u00E3" }), _jsx("option", { children: "Ph\u01B0\u1EDDng 1" }), _jsx("option", { children: "Ph\u01B0\u1EDDng 2" })] })] }), _jsx("input", { placeholder: "Ghi ch\u00FA th\u00EAm (VD: giao gi\u1EDD h\u00E0nh ch\u00EDnh)", className: INPUT_CLS, value: note, onChange: (e) => setNote(e.target.value) })] }) }), _jsx(Card, { title: "H\u00ECnh th\u1EE9c thanh to\u00E1n", children: _jsxs("div", { className: "space-y-3", children: [_jsx(PayRow, { checked: pay === "cod", onChange: () => setPay("cod"), title: "Thanh to\u00E1n khi giao h\u00E0ng (COD)", desc: _jsxs(_Fragment, { children: [_jsx("li", { children: "Kh\u00E1ch h\u00E0ng \u0111\u01B0\u1EE3c ki\u1EC3m tra h\u00E0ng tr\u01B0\u1EDBc khi nh\u1EADn." }), _jsx("li", { children: "Freeship m\u1ECDi \u0111\u01A1n h\u00E0ng (\u00E1p d\u1EE5ng \u0111i\u1EC1u ki\u1EC7n)." })] }), icon: _jsx(Truck, { className: "h-5 w-5" }) }), _jsx(PayRow, { checked: pay === "vnpay", onChange: () => setPay("vnpay"), title: "V\u00ED \u0111i\u1EC7n t\u1EED VNPAY", icon: _jsx(CreditCard, { className: "h-5 w-5" }) }), _jsx(PayRow, { checked: pay === "momo", onChange: () => setPay("momo"), title: "Thanh to\u00E1n MoMo", icon: _jsx(Wallet, { className: "h-5 w-5" }) })] }) })] }), _jsxs("section", { className: "space-y-4", children: [_jsx(Card, { children: items.length === 0 ? (_jsx(EmptyCart, {})) : (_jsx("ul", { className: "divide-y", children: items.map((it) => (_jsxs("li", { className: "flex items-center gap-3 py-3", children: [_jsx(Link, { to: `/san-pham/${it.id}`, className: "block h-20 w-20 shrink-0 overflow-hidden rounded-lg border", children: _jsx("img", { src: it.image, alt: it.name, className: "h-full w-full object-cover" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx(Link, { to: `/san-pham/${it.id}`, className: "line-clamp-2 font-semibold hover:underline", children: it.name }), _jsxs("div", { className: "mt-1 text-sm text-neutral-600", children: [it.size ? _jsxs(_Fragment, { children: ["Size: ", it.size, " \u2022 "] }) : null, "Gi\u00E1: ", formatVnd(it.price)] }), _jsxs("div", { className: "mt-2 flex items-center gap-3", children: [_jsx(Qty, { qty: it.qty, onDec: () => changeQty(it.id, -1), onInc: () => changeQty(it.id, +1) }), _jsx("button", { onClick: () => removeItem(it.id), className: "rounded-md p-2 text-neutral-600 hover:bg-neutral-100", title: "X\u00F3a", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }), _jsx("div", { className: "font-semibold", children: formatVnd(it.price * it.qty) })] }, it.id))) })) }), _jsxs(Card, { title: "\u01AFu \u0111\u00E3i d\u00E0nh cho b\u1EA1n", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { placeholder: "Nh\u1EADp m\u00E3 gi\u1EA3m gi\u00E1 (VD: SEP30, FREESHIP)", className: `${INPUT_CLS} flex-1`, value: voucher, onChange: (e) => setVoucher(e.target.value) }), _jsx("button", { onClick: applyVoucher, className: "rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90 cursor-pointer", children: "\u00C1p d\u1EE5ng" })] }), applied.code && (_jsxs("p", { className: "mt-2 text-sm text-emerald-700", children: ["\u0110\u00E3 \u00E1p d\u1EE5ng m\u00E3 ", _jsx("b", { children: applied.code })] }))] }), _jsx(Card, { title: "T\u00F3m t\u1EAFt \u0111\u01A1n h\u00E0ng", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsx(Row, { label: "T\u1EA1m t\u00EDnh", value: formatVnd(subTotal) }), _jsx(Row, { label: "Ph\u00ED v\u1EADn chuy\u1EC3n", value: ship === 0 ? "Miễn phí" : formatVnd(ship) }), _jsx(Row, { label: "Voucher gi\u1EA3m", value: discount ? `- ${formatVnd(discount)}` : formatVnd(0) }), _jsx("hr", { className: "my-2" }), _jsx(Row, { big: true, label: "T\u1ED5ng", value: formatVnd(grand) })] }) })] })] })] }), _jsx("div", { className: "fixed inset-x-0 bottom-0 z-40 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70", children: _jsxs("div", { className: "mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 lg:px-0", children: [_jsx("div", { className: "text-sm text-neutral-600", children: items.length ? (_jsxs(_Fragment, { children: [items.length, " s\u1EA3n ph\u1EA9m \u2022 ", _jsx("b", { children: formatVnd(grand) })] })) : ("Giỏ hàng đang trống") }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Link, { to: "/", className: "rounded-md border px-4 py-2 text-sm font-semibold hover:bg-neutral-50", children: "Ti\u1EBFp t\u1EE5c mua s\u1EAFm" }), _jsx("button", { onClick: placeOrder, disabled: !items.length, className: "rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer", children: "\u0110\u1EB7t h\u00E0ng" })] })] }) })] }));
}
/* ========= Small components ========= */
function Card({ children, title }) {
    return (_jsxs("section", { className: "overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm", children: [title && _jsx("div", { className: "border-b px-4 py-3 font-semibold", children: title }), _jsx("div", { className: "space-y-3 p-4", children: children })] }));
}
function Qty({ qty, onDec, onInc, }) {
    return (_jsxs("div", { className: "flex items-center rounded-md border border-neutral-300", children: [_jsx("button", { className: "grid h-8 w-8 place-content-center hover:bg-neutral-50", onClick: onDec, children: _jsx(Minus, { className: "h-4 w-4" }) }), _jsx("input", { value: qty, readOnly: true, className: "h-8 w-12 border-x border-neutral-300 text-center outline-none" }), _jsx("button", { className: "grid h-8 w-8 place-content-center hover:bg-neutral-50", onClick: onInc, children: _jsx(Plus, { className: "h-4 w-4" }) })] }));
}
function PayRow({ checked, onChange, title, icon, desc, }) {
    return (_jsxs("label", { className: `block cursor-pointer rounded-lg border p-3 transition ${checked
            ? "border-black ring-1 ring-black/30"
            : "border-neutral-200 hover:border-neutral-300"}`, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "radio", className: "accent-black", checked: checked, onChange: onChange }), _jsx("span", { className: "text-neutral-700", children: icon }), _jsx("span", { className: "font-semibold", children: title })] }), desc && (_jsx("ul", { className: "mt-2 list-disc pl-7 text-sm text-neutral-600", children: desc }))] }));
}
function Row({ label, value, big, }) {
    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: `text-neutral-600 ${big ? "text-base font-semibold" : ""}`, children: label }), _jsx("span", { className: `font-semibold ${big ? "text-base" : ""}`, children: value })] }));
}
function EmptyCart() {
    return (_jsxs("div", { className: "flex flex-col items-center gap-3 py-10 text-center", children: [_jsx("div", { className: "grid h-24 w-24 place-content-center rounded-full bg-amber-50", children: _jsx("span", { className: "text-3xl", children: "\uD83D\uDC5C" }) }), _jsx("h3", { className: "text-lg font-semibold", children: "Hi\u1EC7n gi\u1ECF h\u00E0ng c\u1EE7a b\u1EA1n kh\u00F4ng c\u00F3 s\u1EA3n ph\u1EA9m n\u00E0o!" }), _jsx("p", { className: "text-sm text-neutral-600", children: "V\u1EC1 trang c\u1EEDa h\u00E0ng \u0111\u1EC3 ch\u1ECDn mua s\u1EA3n ph\u1EA9m b\u1EA1n nh\u00E9." }), _jsx(Link, { to: "/", className: "rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90", children: "Mua s\u1EAFm ngay" })] }));
}
