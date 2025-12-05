import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CanvasPolygons from "./_Components/CanvasPolygons";
import { SignInUser } from "../../api/auth";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Nhập email và mật khẩu");
    try {
      setLoading(true);
      const res = await SignInUser(email, password);
      toast.success("Đăng nhập thành công");

      const role = res?.user?.role || "user";
      if (role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || "Đăng nhập thất bại");
      } else {
        toast.error("Đăng nhập thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-black text-cyan-100">
      <CanvasPolygons />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.08),transparent_60%)]" />
      <div className="relative z-10 grid min-h-svh place-items-center px-4">
        <section className="relative w-[min(92svw,360px)] md:w-[min(70svw,420px)]">
          <div className="rounded-2xl border border-cyan-500/30 bg-black/40 p-5 md:p-6 backdrop-blur-md shadow-[0_0_28px_rgba(0,255,255,0.22)]">
            <h1 className="mb-1 text-center text-[clamp(1.1rem,3.4vw,1.4rem)] font-semibold text-white/90">
              Đăng Nhập
            </h1>
            <p className="mb-4 text-center text-[clamp(.8rem,2.4vw,.9rem)] text-cyan-100/70">
              Chào mừng trở lại
            </p>

            <form onSubmit={handleSubmit}>
              {/* EMAIL */}
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-cyan-100/70">
                Email
              </label>
              <div className="relative mb-3.5">
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer input-neon w-full rounded-md bg-transparent px-0 py-2 text-[clamp(.9rem,2.6vw,.95rem)] text-cyan-50 placeholder:text-cyan-200/30 caret-neon text-neon selection:bg-cyan-500/20"
                  placeholder=" "
                  required
                />
                <span className="uline-track uline-slim"></span>
                <span className="uline-sweep uline-slim peer-focus:animate-uline"></span>
              </div>

             
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-cyan-100/70">
                Mật khẩu
              </label>
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer input-neon w-full rounded-md bg-transparent px-0 py-2 pr-10 text-[clamp(.9rem,2.6vw,.95rem)] text-cyan-50 placeholder:text-cyan-200/30 caret-neon text-neon selection:bg-cyan-500/20"
                  placeholder=" "
                  required
                />
                {/* 👁 Icon hiện/ẩn mật khẩu */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-cyan-300 hover:text-cyan-100 transition"
                  aria-label="Hiện mật khẩu"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <span className="uline-track uline-slim"></span>
                <span className="uline-sweep uline-slim peer-focus:animate-uline"></span>
              </div>

          
              <div className="mb-5 flex items-center justify-between text-[clamp(.82rem,2.4vw,.9rem)]">
                <label className="inline-flex select-none items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 appearance-none rounded-[4px] border border-cyan-400/50 bg-transparent checked:bg-cyan-400 checked:shadow-[0_0_8px_rgba(0,255,255,0.8)]"
                  />
                  <span className="text-cyan-100/80">Nhớ tôi</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-cyan-300/80 underline-offset-4 hover:text-cyan-200 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl border border-cyan-400/50 bg-cyan-400/10 px-5 py-2.5 text-[clamp(.9rem,2.6vw,.95rem)] font-medium tracking-wide text-cyan-50 shadow-[0_0_16px_rgba(0,255,255,0.22)] transition-colors hover:bg-cyan-400/20 disabled:opacity-60"
              >
                <span className="relative z-10">
                  {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
                </span>
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/20 blur-sm transition-transform duration-500 group-hover:translate-x-[250%]" />
              </button>
            </form>

            <p className="mt-4 text-center text-[clamp(.82rem,2.4vw,.9rem)] text-cyan-100/70">
              Chưa có tài khoản?{" "}
              <a className="text-cyan-300 hover:underline" href="/dang-ky">
                Đăng ký ngay
              </a>
            </p>
          </div>

          <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl blur-xl [box-shadow:0_0_80px_14px_rgba(0,255,255,0.13)]" />
        </section>
      </div>
    </div>
  );
}
