import { useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Logout } from "../../api/auth";
import {
  Search,
  MapPin,
  User2,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  badge?: string | React.ReactNode;
  children?: NavItem[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "SẢN PHẨM",
    href: "",
    children: [{ label: "Tất cả", href: "/san-pham" }],
  },
  {
    label: "ÁO NAM",
    href: "",
    children: [
      { label: "Áo thun", href: "/san-pham/1" },
      { label: "Sơ mi", href: "/san-pham/2" },
      { label: "Áo khoác", href: "/san-pham/3" },
    ],
  },
  {
    label: "QUẦN NAM",
    href: "",
    children: [
      { label: "Jeans", href: "/san-pham/4" },
      { label: "Kaki", href: "/san-pham/5" },
      { label: "Jogger", href: "/san-pham/6" },
    ],
  },
  {
    label: "PHỤ KIỆN",
    href: "",
    children: [
      { label: "Dây Nịt", href: "/san-pham/7" },
      { label: "Mũ", href: "/san-pham/8" },
    ],
  },
  { label: "OUTLET", href: "/outlet" },
  { label: "TIN THỜI TRANG", href: "/tin" },
];

export default function Header() {
  const [openMobile, setOpenMobile] = useState(false);
  const [query, setQuery] = useState("");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cartCount = 0;

  const primaryNav = useMemo(() => NAV_ITEMS, []);
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const handleLogout = async () => {
    try {
      await Logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    setMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full">
      {/* ---- Thanh trên cùng ---- */}
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link to="/" className="shrink-0">
            <img
              src="/logo.png"
              alt="160STORE"
              className="h-7 w-auto object-contain"
            />
          </Link>

          {/* ---- Ô tìm kiếm desktop ---- */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="hidden md:block md:flex-1"
          >
            <div className="mx-auto w-full max-w-[520px] lg:max-w-[480px]">
              <div className="flex items-stretch overflow-hidden rounded-md bg-white ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-white/40">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Bạn đang tìm gì..."
                  className="h-10 flex-1 bg-transparent px-4 text-sm text-black placeholder:text-neutral-500 outline-none"
                />
                <button
                  type="submit"
                  aria-label="Tìm kiếm"
                  className="grid h-10 w-10 place-content-center bg-black hover:bg-black/90"
                >
                  <Search className="h-5 w-5 text-white cursor-pointer" />
                </button>
              </div>
            </div>
          </form>

          {/* ---- Icon bên phải ---- */}
          <nav className="ml-auto hidden items-center gap-6 md:flex">
            <Link
              to="/he-thong-cua-hang"
              className="flex items-center gap-2 hover:opacity-90"
            >
              <MapPin className="h-5 w-5" />
              <span className="text-sm">Cửa hàng</span>
            </Link>

            {storedUser ? (
              <div className="relative" ref={menuRef} onBlur={handleBlur}>
                <button
                  onClick={() => setMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-1.5 hover:opacity-90"
                >
                  <User2 className="h-5 w-5" />
                  <span className="text-sm">Tài khoản</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isMenuOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 origin-top-right rounded-md bg-white p-1 text-black shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                    <Link
                      to="/tai-khoan"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full rounded-md px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      Tài khoản của tôi
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/dang-nhap"
                className="flex items-center gap-2 hover:opacity-90"
              >
                <User2 className="h-5 w-5" />
                <span className="text-sm">Đăng nhập</span>
              </Link>
            )}

            <Link
              to="/gio-hang"
              className="relative flex items-center gap-2 hover:opacity-90"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-content-center rounded-full bg-white text-xs font-semibold text-black">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* ---- Mobile icon ---- */}
          <div className="ml-auto flex items-center gap-2 md:hidden">
            <button
              className="grid h-9 w-9 place-content-center rounded-md bg-white"
              onClick={() => {
                const el = document.getElementById("m-search");
                el?.focus();
              }}
            >
              <Search className="h-5 w-5 text-black" />
            </button>
            <button
              className="grid h-9 w-9 place-content-center rounded-md bg-white"
              onClick={() => setOpenMobile((v) => !v)}
            >
              {openMobile ? (
                <X className="h-5 w-5 text-black" />
              ) : (
                <Menu className="h-5 w-5 text-black" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ---- Thanh menu chính ---- */}
      <div className="border-b border-neutral-200 bg-white">
        {/* Desktop menu */}
        <div className="mx-auto hidden items-center px-4 md:flex justify-center">
          <ul className="flex items-center gap-2 py-3 text-sm font-bold">
            {primaryNav.map((item) => (
              <li key={item.label} className="shrink-0 group relative">
                <Link
                  to={item.href}
                  className="inline-flex items-center gap-1 rounded px-3 py-2 hover:bg-neutral-100"
                >
                  {item.label === "HÀNG MỚI" && (
                    <span role="img" aria-hidden className="mr-0.5">
                      🔎
                    </span>
                  )}
                  <span className="uppercase tracking-wide">{item.label}</span>
                  {item.children && (
                    <ChevronDown className="h-4 w-4 text-neutral-500 group-hover:rotate-180 transition" />
                  )}
                  {item.badge}
                </Link>
                {item.children && (
                  <div className="invisible absolute mt-1 w-56 rounded-md border border-neutral-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 z-10">
                    <ul className="flex flex-col">
                      {item.children.map((c) => (
                        <li key={c.label}>
                          <Link
                            to={c.href}
                            className="block rounded px-3 py-2 text-sm hover:bg-neutral-100"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ---- Mobile menu ---- */}
        <div className="md:hidden">
          <div className="px-4 py-2">
            <div className="relative">
              <input
                id="m-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Bạn đang tìm gì..."
                className="w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 text-sm focus:outline-none"
              />
              <Search className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>

          {openMobile && (
            <ul className="space-y-1 border-t border-neutral-200 p-2">
              {primaryNav.map((item) => (
                <MobileItem key={item.label} item={item} />
              ))}
              <li className="mt-2 flex items-center justify-between rounded-md bg-black px-3 py-3 text-white">
                <Link to="/gio-hang" className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Giỏ hàng</span>
                </Link>
                {cartCount > 0 && (
                  <span className="grid h-5 min-w-5 place-content-center rounded-full bg-white px-1 text-xs font-semibold text-black">
                    {cartCount}
                  </span>
                )}
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}

function MobileItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.children?.length;

  return (
    <li className="rounded-md">
      <div className="flex items-center">
        <Link
          to={item.href}
          className="flex-1 rounded-md px-3 py-3 text-sm font-semibold hover:bg-neutral-100"
        >
          <span className="uppercase">{item.label}</span>
          {item.badge}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="mr-1 rounded p-2 text-neutral-600"
            aria-label="Mở danh mục"
          >
            <ChevronDown
              className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>
      {hasChildren && open && (
        <ul className="mb-1 ml-2 space-y-1 rounded-md border-l border-neutral-200 pl-2">
          {item.children!.map((c) => (
            <li key={c.label}>
              <Link
                to={c.href}
                className="block rounded px-3 py-2 text-sm hover:bg-neutral-100"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
