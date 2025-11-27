// src/pages/User/UserLayout.tsx
import { Outlet, Link, useLocation } from "react-router-dom";
import { User, ShoppingBag, Lock, MapPin, Heart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

type SideNavItem = {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string;
};

const NAV_ITEMS: SideNavItem[] = [
  {
    icon: User,
    label: "Hồ sơ của tôi",
    path: "/tai-khoan/ho-so",
  },
  {
    icon: ShoppingBag,
    label: "Đơn hàng của tôi",
    path: "/tai-khoan/don-hang",
  },
  {
    icon: MapPin,
    label: "Địa chỉ",
    path: "/tai-khoan/dia-chi",
  },
  {
    icon: Lock,
    label: "Đổi mật khẩu",
    path: "/tai-khoan/doi-mat-khau",
  },
  {
    icon: Heart,
    label: "Sản phẩm yêu thích",
    path: "/tai-khoan/yeu-thich",
  },
];

export default function UserLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto close mobile menu khi đổi route (tránh lỗi UI)
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lấy thông tin user từ localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const username = storedUser?.username || "Người dùng";
  const email = storedUser?.email || "";

  // Kiểm tra route có active hay không
  const checkActive = (path: string): boolean => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Tài khoản của bạn</h1>
            <p className="text-sm text-neutral-600 mt-1">
              Hi, <span className="font-semibold">{username}</span>
            </p>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-lg border border-neutral-300 bg-white p-2 hover:bg-neutral-50"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Layout Grid */}
        <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
          
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              
              {/* User Info */}
              <div className="mb-4 border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-content-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white shadow">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-800 truncate">{username}</p>
                    <p className="text-xs text-neutral-500 truncate">{email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = checkActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-black text-white shadow-md"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1">{item.label}</span>

                      {item.badge && (
                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Sidebar - Mobile */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Sidebar */}
              <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-4">
                  <h2 className="text-lg font-bold">Menu</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg p-2 hover:bg-neutral-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-4">
                  
                  {/* User Info */}
                  <div className="mb-4 border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-content-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white shadow">
                        {username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-800 truncate">{username}</p>
                        <p className="text-xs text-neutral-500 truncate">{email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const isActive = checkActive(item.path);

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                            isActive
                              ? "bg-black text-white shadow-md"
                              : "text-neutral-700 hover:bg-neutral-100"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="flex-1">{item.label}</span>

                          {item.badge && (
                            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
