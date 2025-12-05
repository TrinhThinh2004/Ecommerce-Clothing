import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../../api/auth';
import { Eye, EyeOff } from 'lucide-react';
import CanvasPolygons from './_Components/CanvasPolygons';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');

    if (!emailParam || !tokenParam) {
      toast.error('Liên kết không hợp lệ');
      navigate('/login');
      return;
    }

    setEmail(decodeURIComponent(emailParam));
    setToken(tokenParam);
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Vui lòng nhập mật khẩu');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu không trùng khớp');
      return;
    }

    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, token, password);
      toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
      navigate('/dang-nhap');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      toast.error(message);
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
              Đặt Lại Mật Khẩu
            </h1>
            <p className="mb-6 text-center text-[clamp(.8rem,2.4vw,.9rem)] text-cyan-100/70">
              Tạo mật khẩu mới an toàn
            </p>

            <form onSubmit={handleSubmit}>
              {/* EMAIL (readonly) */}
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-cyan-100/70">
                Email
              </label>
              <div className="relative mb-3.5">
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="peer w-full rounded-md bg-cyan-900/20 px-3 py-2 text-[clamp(.9rem,2.6vw,.95rem)] text-cyan-300/60 border border-cyan-500/20 cursor-not-allowed"
                />
              </div>

              {/* PASSWORD */}
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-cyan-100/70">
                Mật khẩu mới
              </label>
              <div className="relative mb-3.5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="peer input-neon w-full rounded-md bg-transparent px-0 py-2 text-[clamp(.9rem,2.6vw,.95rem)] text-cyan-50 placeholder:text-cyan-200/30 caret-neon text-neon selection:bg-cyan-500/20"
                  placeholder=" "
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-cyan-400/60 hover:text-cyan-200 transition"
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

              {/* CONFIRM PASSWORD */}
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-cyan-100/70">
                Xác nhận mật khẩu
              </label>
              <div className="relative mb-6">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="peer input-neon w-full rounded-md bg-transparent px-0 py-2 text-[clamp(.9rem,2.6vw,.95rem)] text-cyan-50 placeholder:text-cyan-200/30 caret-neon text-neon selection:bg-cyan-500/20"
                  placeholder=" "
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-cyan-400/60 hover:text-cyan-200 transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <span className="uline-track uline-slim"></span>
                <span className="uline-sweep uline-slim peer-focus:animate-uline"></span>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl border border-cyan-400/50 bg-cyan-400/10 px-5 py-2.5 text-[clamp(.9rem,2.6vw,.95rem)] font-medium tracking-wide text-cyan-50 shadow-[0_0_16px_rgba(0,255,255,0.22)] transition-colors hover:bg-cyan-400/20 disabled:opacity-60"
              >
                <span className="relative z-10">
                  {loading ? 'ĐANG XỬ LÝ...' : 'ĐẶT LẠI MẬT KHẨU'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/20 blur-sm transition-transform duration-500 group-hover:translate-x-[250%]" />
              </button>
            </form>

            <p className="mt-6 text-center text-[clamp(.82rem,2.4vw,.9rem)] text-cyan-100/70">
              Quay lại{' '}
              <Link to="/dang-nhap" className="text-cyan-300 hover:underline">
                đăng nhập
              </Link>
            </p>
          </div>

          <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl blur-xl [box-shadow:0_0_80px_14px_rgba(0,255,255,0.13)]" />
        </section>
      </div>
    </div>
  );
}
