import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
export default function SizeGuideModal({ open, onClose, title = "Bảng size", src, }) {
    // khóa scroll & lắng nghe ESC
    useEffect(() => {
        if (!open)
            return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);
    if (!open)
        return null;
    const modal = (_jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3", role: "dialog", "aria-modal": "true", "aria-label": title, onClick: onClose, children: _jsxs("div", { className: "max-h-[90vh] w-full max-w-xl overflow-auto rounded-2xl bg-white shadow-xl", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3", children: [_jsx("h3", { className: "text-lg font-semibold", children: title }), _jsx("button", { className: "grid h-9 w-9 place-content-center rounded-full hover:bg-neutral-100 cursor-pointer", "aria-label": "\u0110\u00F3ng", onClick: onClose, children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "p-4", children: _jsx("div", { className: "grid place-items-center", children: _jsx("img", { src: src, alt: title, className: "max-h-[75vh] w-auto max-w-full object-contain", loading: "lazy" }) }) })] }) }));
    // render ra <body> để tránh bị ảnh hưởng bởi z-index/overflow của layout
    return createPortal(modal, document.body);
}
