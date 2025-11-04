import { jsx as _jsx } from "react/jsx-runtime";
// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { ROUTES } from "./routeConfig";
import Layout from "../components/Layout/Layout";
function FullPageLoader() {
    return (_jsx("div", { className: "grid min-h-[40vh] place-content-center text-sm text-neutral-600", children: "\u0110ang t\u1EA3i\u2026" }));
}
export default function AppRoutes() {
    return (_jsx(Suspense, { fallback: _jsx(FullPageLoader, {}), children: _jsx(Routes, { children: ROUTES.map(({ path, element: Comp, layout }, idx) => {
                let wrapped = _jsx(Comp, {});
                if (layout?.type === "public") {
                    wrapped = _jsx(Layout, { ...(layout.props || {}), children: wrapped });
                }
                // if (layout?.type === "admin") wrapped = <AdminLayout>{wrapped}</AdminLayout>;
                return _jsx(Route, { path: path, element: wrapped }, idx);
            }) }) }));
}
