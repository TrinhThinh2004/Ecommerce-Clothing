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

          {/* Socials */}
          <div className="flex items-center gap-3">
            {[
              { label: "Zalo", bg: "bg-sky-500" },
              { label: "YouTube", bg: "bg-red-600" },
              { label: "Instagram", bg: "bg-pink-500" },
              { label: "Facebook", bg: "bg-blue-600" },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className={`grid h-9 w-9 place-content-center rounded-md ${s.bg} hover:opacity-90`}
              >
                <span className="text-[11px] font-bold leading-none">
                  {s.label[0]}
                </span>
              </a>
            ))}
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

            {/* badges */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-xs text-white/90">
                <BadgeCheck className="size-4" /> ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-xs text-white/90">
                <ShieldCheck className="size-4" /> DMCA PROTECTED
              </span>
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
              <span className="rounded-md border border-white/15 px-3 py-1.5">
                SPay
              </span>
              <span className="rounded-md border border-white/15 px-3 py-1.5">
                VNPAY
              </span>
              <span className="rounded-md border border-white/15 px-3 py-1.5">
                COD
              </span>
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
        <MapPin className="size-4 text-white/70" aria-hidden="true" />
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
