import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from "../Header/Header";
import Banner from "../Banner/Banner";
import Footer from "../Footer/Footer";
import ContactFloating from "../../components/FloatingContact/FloatingContact";
export default function Layout({ children, noBanner = false, noFooter = false, }) {
    return (_jsxs("div", { className: "flex min-h-screen flex-col relative", children: [_jsx(Header, {}), _jsx("div", { className: "h-[64px] md:h-[96px]", "aria-hidden": true }), !noBanner && (_jsx("div", { className: "bg-amber-50", children: _jsx("div", { className: "mx-auto w-full max-w-7xl px-4 py-4", children: _jsx(Banner, {}) }) })), _jsx("main", { className: noBanner ? "bg-white" : "bg-amber-50", children: _jsx("div", { className: "mx-auto w-full max-w-7xl px-4 py-10 flex-1", children: children }) }), !noFooter && _jsx(Footer, {}), _jsx(ContactFloating, {})] }));
}
