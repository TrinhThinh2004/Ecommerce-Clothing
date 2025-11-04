import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CanvasPolygons from "./_Components/CanvasPolygons";
import { SignInUser } from "../../api/auth";
import { toast } from "react-toastify";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password)
            return toast.error("Nhập email và mật khẩu");
        try {
            setLoading(true);
            const res = await SignInUser(email, password);
            toast.success("Đăng nhập thành công");
            const role = res?.user?.role || "user";
            if (role === "admin")
                navigate("/admin");
            else
                navigate("/");
        }
        catch (err) {
            toast.error(err?.response?.data?.message || "Đăng nhập thất bại");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "relative min-h-svh w-full overflow-hidden bg-black text-cyan-100", children: [_jsx(CanvasPolygons, {}), _jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.08),transparent_60%)]" }), _jsx("div", { className: "relative z-10 grid min-h-svh place-items-center px-4", children: _jsxs("section", { className: "relative w-[min(92svw,360px)] md:w-[min(70svw,420px)]", children: [_jsxs("div", { className: "rounded-2xl border border-cyan-500/30 bg-black/40 p-5 md:p-6 backdrop-blur-md shadow-[0_0_28px_rgba(0,255,255,0.22)]", children: [_jsx("h1", { className: "mb-1 text-center text-[clamp(1.1rem,3.4vw,1.4rem)] font-semibold text-white/90", children: "Login Store" }), _jsx("p", { className: "mb-4 text-center text-[clamp(.8rem,2.4vw,.9rem)] text-cyan-100/70", children: "Welcome back" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("label", { className: "mb-1 block text-[10px] uppercase tracking-widest text-cyan-100/70", children: "Email" }), _jsxs("div", { className: "relative mb-3.5", children: [_jsx("input", { type: "email", autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "peer input-neon w-full rounded-md bg-transparent px-0 py-2 text-[clamp(.9rem,2.6vw,.95rem)] text-cyan-50 placeholder:text-cyan-200/30 caret-neon text-neon selection:bg-cyan-500/20", placeholder: " ", required: true }), _jsx("span", { className: "uline-track uline-slim" }), _jsx("span", { className: "uline-sweep uline-slim peer-focus:animate-uline" })] }), _jsx("label", { className: "mb-1 block text-[10px] uppercase tracking-widest text-cyan-100/70", children: "Password" }), _jsxs("div", { className: "relative mb-4", children: [_jsx("input", { type: "password", autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value), className: "peer input-neon w-full rounded-md bg-transparent px-0 py-2 text-[clamp(.9rem,2.6vw,.95rem)] text-cyan-50 placeholder:text-cyan-200/30 caret-neon text-neon selection:bg-cyan-500/20", placeholder: " ", required: true }), _jsx("span", { className: "uline-track uline-slim" }), _jsx("span", { className: "uline-sweep uline-slim peer-focus:animate-uline" })] }), _jsxs("div", { className: "mb-5 flex items-center justify-between text-[clamp(.82rem,2.4vw,.9rem)]", children: [_jsxs("label", { className: "inline-flex select-none items-center gap-2", children: [_jsx("input", { type: "checkbox", className: "h-4 w-4 appearance-none rounded-[4px] border border-cyan-400/50 bg-transparent checked:bg-cyan-400 checked:shadow-[0_0_8px_rgba(0,255,255,0.8)]" }), _jsx("span", { className: "text-cyan-100/80", children: "Remember me" })] }), _jsx("button", { type: "button", className: "text-cyan-300/80 underline-offset-4 hover:text-cyan-200 hover:underline", children: "Forgot Password?" })] }), _jsxs("button", { type: "submit", disabled: loading, className: "group relative w-full overflow-hidden rounded-xl border border-cyan-400/50 bg-cyan-400/10 px-5 py-2.5 text-[clamp(.9rem,2.6vw,.95rem)] font-medium tracking-wide text-cyan-50 shadow-[0_0_16px_rgba(0,255,255,0.22)] transition-colors hover:bg-cyan-400/20 disabled:opacity-60", children: [_jsx("span", { className: "relative z-10", children: loading ? "SIGNING IN..." : "SIGN IN" }), _jsx("span", { className: "pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/20 blur-sm transition-transform duration-500 group-hover:translate-x-[250%]" })] })] }), _jsxs("p", { className: "mt-4 text-center text-[clamp(.82rem,2.4vw,.9rem)] text-cyan-100/70", children: ["Don\u2019t have an account?", " ", _jsx("a", { className: "text-cyan-300 hover:underline", href: "/dang-ky", children: "Register" })] })] }), _jsx("div", { className: "pointer-events-none absolute inset-0 -z-10 rounded-2xl blur-xl [box-shadow:0_0_80px_14px_rgba(0,255,255,0.13)]" })] }) })] }));
}
