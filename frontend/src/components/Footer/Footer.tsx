import {
  Mail,
  Send,
  Phone,
  Clock,
  MapPin,
  Inbox,
  ChevronDown,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { useState } from "react";
import spay from "../../../src/assets/footer/spay.jpg";
import cod from "../../../src/assets/footer/cod.jpg";
import vnpay from "../../../src/assets/footer/vnpay.jpg";
import thongbao from "../../../src/assets/footer/thongbao.png";
import dmca from "../../../src/assets/footer/dmca.png";
function SocialSvg({
  type,
  className = "",
  title = "",
}: {
  type: "facebook" | "youtube2" | "instagram" | "zalo";
  className?: string;
  title?: string;
}) {
  const icons = {
    facebook: (
      <path fill="currentColor" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5l0-170.3-52.8 0 0-78.2 52.8 0 0-33.7c0-87.1 39.4-127.5 125-127.5 16.2 0 44.2 3.2 55.7 6.4l0 70.8c-6-.6-16.5-1-29.6-1-42 0-58.2 15.9-58.2 57.2l0 27.8 83.6 0-14.4 78.2-69.3 0 0 175.9C413.8 494.8 512 386.9 512 256z"/>
    ),

    youtube2: (
      <path fill="currentColor" d="M549.7 124.1C543.5 100.4 524.9 81.8 501.4 75.5 458.9 64 288.1 64 288.1 64S117.3 64 74.7 75.5C51.2 81.8 32.7 100.4 26.4 124.1 15 167 15 256.4 15 256.4s0 89.4 11.4 132.3c6.3 23.6 24.8 41.5 48.3 47.8 42.6 11.5 213.4 11.5 213.4 11.5s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zM232.2 337.6l0-162.4 142.7 81.2-142.7 81.2z"/>
    ),

    instagram: (
      <path fill="currentColor" d="M224.3 141a115 115 0 1 0 -.6 230 115 115 0 1 0 .6-230zm-.6 40.4a74.6 74.6 0 1 1 .6 149.2 74.6 74.6 0 1 1 -.6-149.2zm93.4-45.1a26.8 26.8 0 1 1 53.6 0 26.8 26.8 0 1 1 -53.6 0zm129.7 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM399 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
    ),

    zalo: (
      <path d="M90 20H30C16 20 5 31 5 45v70c0 14 11 25 25 25h60c14 0 25-11 25-25V45c0-14-11-25-25-25zM40 60h40v10H40V60zm0 25h30v10H40V85z"/>
    ),
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      className={className}
      role="img"
      aria-label={title}
    >
      {icons[type]}
    </svg>
  );
}
const stores = {
  hcm: {
    city: "HỒ CHÍ MINH",
    count: 12,
    items: ["401 Phan Xích Long, Phường Đức Nhuận, TP.HCM"],
  },
  hn: {
    city: "HÀ NỘI",
    count: 2,
    items: ["Số 26 Phố Lê Đại Hành, Phường Hai Bà Trưng, TP.Hà Nội"],
  },
  ct: {
    city: "CẦN THƠ",
    count: 2,
    items: ["Số 35 Trần Phú, Phường Ninh Kiều, TP.Cần Thơ"],
  },
  dn: {
    city: "ĐÀ NẴNG",
    count: 2,
    items: ["332 Đ. Lê Duẩn, Phường Thanh Khê, TP.Đà Nẵng"],
  },
};

export default function Footer() {
  const [expandPolicies, setExpandPolicies] = useState(false);

  return (
    <footer className="bg-black text-white">
      {/* Subscribe bar */}
      <div className="container mx-auto max-w-7xl px-4 py-6 border-b border-white/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold tracking-wide">
            ĐĂNG KÍ NHẬN TIN
          </h3>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full md:w-auto"
            aria-label="Đăng ký nhận tin"
          >
            <label htmlFor="subscribe-email" className="sr-only">
              Email
            </label>
            <div className="flex w-full items-center overflow-hidden rounded-lg ring-1 ring-white/15 focus-within:ring-2 focus-within:ring-white/40 md:min-w-[520px]">
              <div className="pl-3">
                <Mail className="size-5 text-white/70" aria-hidden="true" />
              </div>
              <input
                id="subscribe-email"
                type="email"
                required
                placeholder="Email"
                className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-white/50"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-white/10 px-4 py-3 text-sm font-medium hover:bg-white/15 focus:outline-none"
              >
                <Send className="size-4" aria-hidden="true" />
                ĐĂNG KÝ
              </button>
            </div>
          </form>

          {/* Socials (Facebook, YouTube, Instagram) */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-md hover:opacity-90"
              style={{ backgroundColor: "#1877F2" }}
            >
              <SocialSvg type="facebook" title="Facebook" className="h-5 w-5 text-white" />
            </a>

            <a
              href="#"
              aria-label="YouTube"
              className="flex h-9 w-9 items-center justify-center rounded-md hover:opacity-90"
              style={{ backgroundColor: "#FF0000" }}
            >
              <SocialSvg type="youtube2" title="YouTube" className="h-5 w-5 text-white" />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-md hover:opacity-90"
              style={{ background: "linear-gradient(45deg,#F58529,#DD2A7B,#8134AF,#515BD4)" }}
            >
              <SocialSvg type="instagram" title="Instagram" className="h-5 w-5 text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Giới thiệu */}
          <div>
            <h4 className="mb-4 text-base font-semibold">GIỚI THIỆU</h4>
            <p className="mb-4 text-sm text-white/80">
              160STORE - Chuỗi Phân Phối Thời Trang Nam Chuẩn Hiệu
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-white/70" />
                <a href="tel:02871006789" className="hover:underline">
                  02871006789
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Inbox className="size-4 text-white/70" />
                <a href="mailto:cs@160store.com" className="hover:underline">
                  cs@160store.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-white/70" />
                Giờ mở cửa : 08:30 – 22:00
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 text-white/70" />
                Nhân viên tư vấn phản hồi tin nhắn đến 24:00 (Mỗi ngày)
              </li>
            </ul>

            {/* badges (stacked vertically) */}
            <div className="mt-6 flex flex-col items-start gap-3">
              <img src={thongbao} alt="Thông báo Bộ Công Thương" className="w-40 h-20" />
              <img src={dmca} alt="DMCA Protected" className="w-30 h-9" />
            </div>
          </div>

          {/* Chính sách */}
          <div>
            <h4 className="mb-4 text-base font-semibold">CHÍNH SÁCH</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/huong-dan-dat-hang" className="hover:underline">
                  Hướng dẫn đặt hàng
                </a>
              </li>
              <li>
                <button
                  className="group inline-flex items-center gap-2 hover:underline"
                  onClick={() => setExpandPolicies((v) => !v)}
                >
                  Chính sách
                  <ChevronDown
                    className={`size-4 transition-transform ${
                      expandPolicies ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {expandPolicies && (
                  <ul className="ml-4 mt-2 list-disc space-y-2 text-white/80">
                    <li>Đổi trả & hoàn tiền</li>
                    <li>Bảo mật & quyền riêng tư</li>
                    <li>Vận chuyển & giao hàng</li>
                  </ul>
                )}
              </li>
            </ul>
          </div>

          {/* Địa chỉ cửa hàng */}
          <div>
            <h4 className="mb-4 text-base font-semibold">
              ĐỊA CHỈ CỬA HÀNG <span className="text-white/50">(23 CH)</span>
            </h4>

            <CityBlock
              title={`${stores.hcm.city} (${stores.hcm.count} CH)`}
              lines={stores.hcm.items}
            />
            <CityBlock
              title={`${stores.hn.city} (${stores.hn.count} CH)`}
              lines={stores.hn.items}
            />
            <CityBlock
              title={`${stores.ct.city} (${stores.ct.count} CH)`}
              lines={stores.ct.items}
            />
            <CityBlock
              title={`${stores.dn.city} (${stores.dn.count} CH)`}
              lines={stores.dn.items}
              extraRight={
                <span className="ml-2 rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-red-300">
                  New
                </span>
              }
            />

            <a
              href="/he-thong-cua-hang"
              className="mt-3 inline-block text-sm font-medium text-white hover:underline"
            >
              XEM TẤT CẢ CỬA HÀNG
            </a>
          </div>

          {/* Phương thức thanh toán */}
          <div>
            <h4 className="mb-4 text-base font-semibold">
              PHƯƠNG THỨC THANH TOÁN
            </h4>
            <div className="flex flex-wrap items-center gap-3 text-sm">
             <img src={vnpay} alt="VNPAY" className="h-6" />
              <img src={spay} alt="SPay" className="h-6" />
              <img src={cod} alt="COD" className="h-6" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/70">
          BẢN QUYỀN THUỘC VỀ 160STORE
        </div>
      </div>
    </footer>
  );
}

function CityBlock({
  title,
  lines,
  extraRight,
}: {
  title: string;
  lines: string[];
  extraRight?: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center gap-2">
        <MapPin className="size-5 text-white/70" aria-hidden="true" />
        <p className="text-sm font-semibold">
          {title} {extraRight}
        </p>
      </div>
      <ul className="ml-6 list-disc space-y-1 text-sm text-white/80">
        {lines.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
