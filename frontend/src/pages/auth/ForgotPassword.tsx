import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword } from '../../api/auth';
import CanvasPolygons from './_Components/CanvasPolygons';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Vui lòng nhập email');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
      toast.success('Email hướng dẫn đã được gửi. Vui lòng kiểm tra inbox!');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="relative min-h-svh w-full overflow-hidden bg-black text-cyan-100">
        <CanvasPolygons />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.08),transparent_60%)]" />
        <div className="relative z-10 grid min-h-svh place-items-center px-4">
          <section className="relative w-[min(92svw,360px)] md:w-[min(70svw,420px)]">
            <div className="rounded-2xl border border-cyan-500/30 bg-black/40 p-5 md:p-6 backdrop-blur-md shadow-[0_0_28px_rgba(0,255,255,0.22)]">
              <h2 className="mb-4 text-center text-[clamp(1.1rem,3.4vw,1.4rem)] font-semibold text-white/90">
                Email đã được gửi
              </h2>
              <p className="mb-6 text-center text-[clamp(.85rem,2.5vw,.95rem)] text-cyan-100/80 leading-relaxed">
                Chúng tôi đã gửi liên kết đặt lại mật khẩu tới <strong className="text-cyan-300">{email}</strong>. Vui lòng kiểm tra inbox hoặc thư mục spam.
              </p>
              <p className="mb-8 text-center text-[clamp(.8rem,2.3vw,.9rem)] text-cyan-100/60">
                Liên kết sẽ hết hạn sau 1 giờ.
              </p>
              <Link
                to="/dang-nhap"
                className="group relative block w-full overflow-hidden rounded-xl border border-cyan-400/50 bg-cyan-400/10 px-5 py-2.5 text-center text-[clamp(.9rem,2.6vw,.95rem)] font-medium tracking-wide text-cyan-50 shadow-[0_0_16px_rgba(0,255,255,0.22)] transition-colors hover:bg-cyan-400/20"
              >
                <span className="relative z-10">Quay lại đăng nhập</span>
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/20 blur-sm transition-transform duration-500 group-hover:translate-x-[250%]" />
              </Link>
            </div>
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl blur-xl [box-shadow:0_0_80px_14px_rgba(0,255,255,0.13)]" />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-black text-cyan-100">
      <CanvasPolygons />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.08),transparent_60%)]" />
      <div className="relative z-10 grid min-h-svh place-items-center px-4">
        <section className="relative w-[min(92svw,360px)] md:w-[min(70svw,420px)]">
          <div className="rounded-2xl border border-cyan-500/30 bg-black/40 p-5 md:p-6 backdrop-blur-md shadow-[0_0_28px_rgba(0,255,255,0.22)]">
            <h1 className="mb-1 text-center text-[clamp(1.1rem,3.4vw,1.4rem)] font-semibold text-white/90">
              Quên Mật Khẩu?
            </h1>
            <p className="mb-6 text-center text-[clamp(.8rem,2.4vw,.9rem)] text-cyan-100/70">
              Nhập email để đặt lại
            </p>

            <form onSubmit={handleSubmit}>
              {/* EMAIL */}
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-cyan-100/70">
                Email
              </label>
              <div className="relative mb-6">
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="peer input-neon w-full rounded-md bg-transparent px-0 py-2 text-[clamp(.9rem,2.6vw,.95rem)] text-cyan-50 placeholder:text-cyan-200/30 caret-neon text-neon selection:bg-cyan-500/20"
                  placeholder=" "
                  required
                />
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
                  {loading ? 'ĐANG GỬI...' : 'GỬI LIÊN KẾT'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/20 blur-sm transition-transform duration-500 group-hover:translate-x-[250%]" />
              </button>
            </form>

            <p className="mt-6 text-center text-[clamp(.82rem,2.4vw,.9rem)] text-cyan-100/70">
              Nhớ mật khẩu?{' '}
              <Link to="/dang-nhap" className="text-cyan-300 hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>

          <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl blur-xl [box-shadow:0_0_80px_14px_rgba(0,255,255,0.13)]" />
        </section>
      </div>
    </div>
  );
}
