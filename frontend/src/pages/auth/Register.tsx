// src/pages/PolygonsRegister.tsx
import { useState } from "react";
import CanvasPolygons from "./_Components/CanvasPolygons";
import { SignUpUser } from "../../api/auth";
import { toast } from "react-toastify";
import axios from "axios"; 

export default function PolygonsRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) return toast.error("Nhập đủ thông tin");
    if (password !== confirm) return toast.error("Mật khẩu nhập lại không khớp");
    try {
      setLoading(true);
      await SignUpUser({ username, email, password, phone_number: phone || undefined });
      toast.success("Đăng ký thành công. Vui lòng đăng nhập");
      // TODO: điều hướng sang /dang-nhap
    } catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    toast.error(err.response?.data?.message || "Đăng ký thất bại");
  } else {
    toast.error("Đăng ký thất bại");
  }
}
 finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-black text-cyan-100">
      <CanvasPolygons />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.08),transparent_60%)]" />

      {/* center cả dọc & ngang để cân đối viewport */}
      <div className="relative z-10 grid min-h-svh place-items-center px-4">
        <section className="w-[min(92svw,360px)] md:w-[min(70svw,420px)]">
          <div className="rounded-2xl border border-cyan-500/30 bg-black/40 p-5 md:p-6 backdrop-blur-md shadow-[0_0_28px_rgba(0,255,255,0.22)]">
            <h1 className="mb-1 text-center text-[clamp(1.1rem,3.4vw,1.4rem)] font-semibold text-white/90">
              Tạo Tài Khoản
            </h1>
            <p className="mb-4 text-center text-[clamp(.8rem,2.4vw,.9rem)] text-cyan-100/70">
              Chào mừng đến gia đình 🚀
            </p>

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-cyan-100/70">
                Tên đăng nhập
              </label>
              <div className="relative mb-3.5">
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="peer input-neon w-full rounded-md bg-transparent px-0 py-2
                           text-[clamp(.9rem,2.6vw,.95rem)] text-cyan-50 placeholder:text-cyan-200/30
                           caret-neon text-neon selection:bg-cyan-500/20"
                  placeholder=" "
                />
                <span className="uline-track uline-slim"></span>
                <span className="uline-sweep uline-slim peer-focus:animate-uline"></span>
              </div>

              {/* Email */}
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-cyan-100/70">
                Email
              </label>
              <div className="relative mb-3.5">
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer input-neon w-full rounded-md bg-transparent px-0 py-2
                           text-[clamp(.9rem,2.6vw,.95rem)] text-cyan-50 placeholder:text-cyan-200/30
                           caret-neon text-neon selection:bg-cyan-500/20"
                  placeholder=" "
                />
                <span className="uline-track uline-slim"></span>
                <span className="uline-sweep uline-slim peer-focus:animate-uline"></span>
              </div>

              {/* Phone number */}
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-cyan-100/70">
                Số điện thoại
              </label>
              <div className="relative mb-3.5">
                <input
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  pattern="^(\+?84|0)\d{8,10}$"
                  title="Use 0xxxxxxxxx or +84xxxxxxxxx"
                  maxLength={15}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="peer input-neon w-full rounded-md bg-transparent px-0 py-2
                           text-[clamp(.9rem,2.6vw,.95rem)] text-cyan-50 placeholder:text-cyan-200/30
                           caret-neon text-neon selection:bg-cyan-500/20"
                  placeholder=" "
                />
                <span className="uline-track uline-slim"></span>
                <span className="uline-sweep uline-slim peer-focus:animate-uline"></span>
              </div>

              {/* Password */}
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-cyan-100/70">
                Mật khẩu
              </label>
              <div className="relative mb-3.5">
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer input-neon w-full rounded-md bg-transparent px-0 py-2
                           text-[clamp(.9rem,2.6vw,.95rem)] text-cyan-50 placeholder:text-cyan-200/30
                           caret-neon text-neon selection:bg-cyan-500/20"
                  placeholder=" "
                />
                <span className="uline-track uline-slim"></span>
                <span className="uline-sweep uline-slim peer-focus:animate-uline"></span>
              </div>

              {/* Confirm Password */}
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-cyan-100/70">
                Xác nhận mật khẩu
              </label>
              <div className="relative mb-4">
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="peer input-neon w-full rounded-md bg-transparent px-0 py-2
                           text-[clamp(.9rem,2.6vw,.95rem)] text-cyan-50 placeholder:text-cyan-200/30
                           caret-neon text-neon selection:bg-cyan-500/20"
                  placeholder=" "
                />
                <span className="uline-track uline-slim"></span>
                <span className="uline-sweep uline-slim peer-focus:animate-uline"></span>
              </div>

              <label className="mb-4 inline-flex select-none items-start gap-2 text-[clamp(.82rem,2.4vw,.9rem)] leading-6">
                <input
                  type="checkbox"
                  className="mt-[2px] h-4 w-4 shrink-0 appearance-none rounded-[4px] border border-cyan-400/50 bg-transparent checked:bg-cyan-400 checked:shadow-[0_0_8px_rgba(0,255,255,0.8)]"
                  required
                />
                <span className="text-cyan-100/80">
                  Tôi đồng ý với {" "}
                  <a className="text-cyan-300 hover:underline" href="/terms">
                    Điều khoản Dịch vụ
                  </a>{" "}
                  và {" "}
                  <a className="text-cyan-300 hover:underline" href="/privacy">
                    Chính sách Bảo mật
                  </a>
                  .
                </span>
              </label>

              <button type="submit" disabled={loading} className="group relative w-full overflow-hidden rounded-xl border border-cyan-400/50 bg-cyan-400/10 px-5 py-2.5 text-[clamp(.9rem,2.6vw,.95rem)] font-medium tracking-wide text-cyan-50 shadow-[0_0_16px_rgba(0,255,255,0.22)] transition-colors hover:bg-cyan-400/20 disabled:opacity-60">
                <span className="relative z-10">{loading ? "ĐANG TẠO..." : "TẠO TÀI KHOẢN"}</span>
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/20 blur-sm transition-transform duration-500 group-hover:translate-x-[250%]" />
              </button>
            </form>

            <p className="mt-4 text-center text-[clamp(.82rem,2.4vw,.9rem)] text-cyan-100/70">
              Đã có tài khoản?{" "}
              <a className="text-cyan-300 hover:underline" href="/dang-nhap">
                Đăng nhập
              </a>
            </p>
          </div>

          <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl blur-xl [box-shadow:0_0_80px_14px_rgba(0,255,255,0.13)]" />
        </section>
      </div>
    </div>
  );
}
