import { jsx as _jsx } from "react/jsx-runtime";
export default function Button(props) {
    const base = 
    // kích thước & layout
    "inline-flex items-center justify-center w-[120px] h-[40px] py-2 px-3 " +
        // màu & hover đảo màu
        "bg-neutral-900 text-white hover:bg-white hover:text-black " +
        // bo góc, bóng, viền, focus ring
        "rounded shadow-sm ring-1 ring-black/10 hover:ring-black/20 " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 " +
        // hiệu ứng
        "transition-all duration-200 ease-out active:scale-[0.98] " +
        // typo
        "text font-semibold tracking-wide select-none cursor-pointer";
    const content = _jsx("span", { children: props.children ?? "Xem tất cả" });
    if ("href" in props && props.href) {
        const { className = "", href, ...rest } = props; // ❌ không destructure children
        return (_jsx("a", { href: href, className: `${base} ${className}`, ...rest, children: content }));
    }
    const { className = "", ...rest } = props; // ❌ không destructure children
    return (_jsx("button", { className: `${base} ${className}`, ...rest, children: content }));
}
