import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/App.tsx
import { BrowserRouter as Router } from "react-router-dom";
import ScrollToTop from "./routes/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from 'react-toastify';
function App() {
    return (_jsxs(_Fragment, { children: [_jsx(ToastContainer, { position: "top-right", autoClose: 2000 }), _jsxs(Router, { children: [_jsx(ScrollToTop, {}), _jsx(AppRoutes, {})] })] }));
}
export default App;
