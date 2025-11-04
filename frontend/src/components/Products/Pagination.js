import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Pagination({ page, pageCount, onPageChange, windowSize = 5, }) {
    if (pageCount <= 1)
        return null;
    const current = Math.min(Math.max(1, page), pageCount);
    const half = Math.floor(windowSize / 2);
    let from = Math.max(1, current - half);
    const to = Math.min(pageCount, from + windowSize - 1);
    if (to - from + 1 < windowSize) {
        from = Math.max(1, to - windowSize + 1);
    }
    const pages = Array.from({ length: to - from + 1 }, (_, i) => from + i);
    const itemCls = "rounded-md border px-3 py-1.5 text-sm transition disabled:opacity-40 hover:bg-neutral-50";
    const onChange = (p) => {
        if (p !== current)
            onPageChange(p);
    };
    const stop = (e) => e.preventDefault();
    return (_jsxs("nav", { className: "mt-6 flex items-center justify-center gap-2", "aria-label": "Pagination", onMouseDown: stop, children: [_jsx("button", { type: "button", className: itemCls, onClick: () => onChange(1), disabled: current === 1, children: "\u00AB \u0110\u1EA7u" }), _jsx("button", { type: "button", className: itemCls, onClick: () => onChange(Math.max(1, current - 1)), disabled: current === 1, children: "\u2039 Tr\u01B0\u1EDBc" }), from > 1 && _jsx("span", { className: "px-1 text-neutral-500", children: "\u2026" }), pages.map((p) => (_jsx("button", { type: "button", onClick: () => onChange(p), className: p === current
                    ? `${itemCls} border-black bg-black text-white hover:bg-black`
                    : itemCls, children: p }, p))), to < pageCount && _jsx("span", { className: "px-1 text-neutral-500", children: "\u2026" }), _jsx("button", { type: "button", className: itemCls, onClick: () => onChange(Math.min(pageCount, current + 1)), disabled: current === pageCount, children: "Sau \u203A" }), _jsx("button", { type: "button", className: itemCls, onClick: () => onChange(pageCount), disabled: current === pageCount, children: "Cu\u1ED1i \u00BB" })] }));
}
