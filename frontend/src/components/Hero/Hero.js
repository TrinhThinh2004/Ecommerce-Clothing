import { jsx as _jsx } from "react/jsx-runtime";
export default function HeroNew({ src = "/hero-new.jpg", alt = "HÀNG MỚI", }) {
    return (_jsx("section", { className: "mx-auto w-full max-w-6xl px-1 sm:px-0", children: _jsx("div", { className: "overflow-hidden rounded-xl border border-neutral-200 bg-white", children: _jsx("div", { className: "h-[110px] sm:h-[140px] lg:h-[180px] w-full", children: _jsx("img", { src: src, alt: alt, className: "h-full w-full object-cover", loading: "lazy" }) }) }) }));
}
