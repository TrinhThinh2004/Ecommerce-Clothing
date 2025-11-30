import { useMemo, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logout } from "../../api/auth";
import axios from "axios";
import type { Product } from "../../types/product";
import {
  Search,
  MapPin,
  User2,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  Loader2,
  ShoppingBag,
  Lock,
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
      { label: "Áo thun", href: "/san-pham/danh-muc/1" },
      { label: "Sơ mi", href: "/san-pham/danh-muc/2" },
      { label: "Áo khoác", href: "/san-pham/danh-muc/3" },
    ],
  },
  {
    label: "QUẦN NAM",
    href: "",
    children: [
      { label: "Jeans", href: "/san-pham/danh-muc/4" },
      { label: "Kaki", href: "/san-pham/danh-muc/5" },
      { label: "Jogger", href: "/san-pham/danh-muc/6" },
    ],
  },
  {
    label: "PHỤ KIỆN",
    href: "",
    children: [
      { label: "Dây Nịt", href: "/san-pham/danh-muc/7" },
      { label: "Mũ", href: "/san-pham/danh-muc/8" },
    ],
  },
  { label: "TIN THỜI TRANG", href: "/tin-thoi-trang" },
  {
    label: "Chính Sách",
    href: "",
    children: [
      { label: "Hướng dẫn đặt hàng", href: "/huong-dan-dat-hang" },
      { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
      { label: "Chính sách đổi trả", href: "/chinh-sach-doi-tra" },
    ],
  },
];

const CATEGORY_KEYWORDS: Record<number, string[]> = {
  1: [
    "áo thun", "ao thun","áo", "t-shirt", "tshirt", "thun", 
    "áo phông", "ao phong", "round neck", "crew neck"
  ],
  2: [
    "sơ mi", "so mi", "shirt", "áo sơ mi", "ao so mi",
    "formal shirt", "dress shirt", "caro", "sọc"
  ],
  3: [
    "áo khoác", "ao khoac", "jacket", "hoodie", "cardigan",
    "blazer", "coat", "vest", "gile"
  ],
  4: [
    "jeans", "jean", "quần jean","quần", "quan jean", "denim",
    "quần bò", "quan bo"
  ],
  5: [
    "kaki", "khaki", "quần kaki", "quan kaki", "chinos"
  ],
  6: [
    "jogger", "quần jogger", "quan jogger", "thể thao",
    "the thao", "sport", "track pants"
  ],
  7: [
    "dây nịt", "day nit", "thắt lưng", "that lung", "belt",
    "dây lưng", "day lung"
  ],
  8: [
    "mũ", "mu", "nón", "non", "hat", "cap", "mũ lưỡi trai"
  ]
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const detectCategoryFromQuery = (query: string): number | null => {
  const normalizedQuery = query.toLowerCase().trim();
  
  for (const [categoryId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalizedQuery.includes(keyword)) {
        return Number(categoryId);
      }
    }
  }
  
  return null;
};

export default function Header() {
  const navigate = useNavigate();
  const [openMobile, setOpenMobile] = useState(false);
  const [query, setQuery] = useState("");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState<number | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const cartCount = 0;

  const primaryNav = useMemo(() => NAV_ITEMS, []);
  
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const username = storedUser?.username || storedUser?.name || null;

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      setDetectedCategory(null);
      return;
    }

    const categoryId = detectCategoryFromQuery(query);
    setDetectedCategory(categoryId);

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await axios.get<{ data: Product[] }>(
          `${API_URL}/api/v1/products/search?query=${encodeURIComponent(query)}`
        );
        setSearchResults(res.data.data || []);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = query.trim();
    
    if (!q) return;

    if (detectedCategory) {
      navigate(`/san-pham/danh-muc/${detectedCategory}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
    
    setQuery("");
    setShowResults(false);
    setOpenMobile(false);
    setDetectedCategory(null);
  };

  const handleSearchClick = () => {
    handleSearch();
  };

  const handleViewAllResults = () => {
    if (detectedCategory) {
      navigate(`/san-pham/danh-muc/${detectedCategory}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
    setQuery("");
    setShowResults(false);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/san-pham/${productId}`);
    setQuery("");
    setShowResults(false);
  };

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getCategoryName = (categoryId: number): string => {
    const categoryNames: Record<number, string> = {
      1: "Áo thun",
      2: "Sơ mi",
      3: "Áo khoác",
      4: "Jeans",
      5: "Kaki",
      6: "Jogger",
      7: "Dây Nịt",
      8: "Mũ"
    };
    return categoryNames[categoryId] || "Danh mục";
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full">
      {/* Top Bar */}
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link to="/" className="shrink-0">
            <img
              src="/logo.png"
              alt="160STORE"
              className="h-7 w-auto object-contain"
            />
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block md:flex-1 relative" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="mx-auto w-full max-w-[520px] lg:max-w-[480px]">
                <div className="flex items-stretch overflow-hidden rounded-md bg-white ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-white/40">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query && setShowResults(true)}
                    placeholder="Bạn đang tìm gì..."
                    className="h-10 flex-1 bg-transparent px-4 text-sm text-black placeholder:text-neutral-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSearchClick}
                    aria-label="Tìm kiếm"
                    className="grid h-10 w-10 place-content-center bg-black hover:bg-gray-800"
                  >
                    {isSearching ? (
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                    ) : (
                      <Search className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-full max-w-[520px] lg:max-w-[480px] bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[500px] overflow-y-auto z-50">
                {detectedCategory && (
                  <div className="p-3 bg-blue-50 border-b border-blue-100">
                    <p className="text-sm text-blue-800">
                      🔍 Đang tìm trong danh mục: <span className="font-semibold">{getCategoryName(detectedCategory)}</span>
                    </p>
                  </div>
                )}

                {searchResults.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    {isSearching ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Đang tìm kiếm...</span>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-2">Không tìm thấy sản phẩm nào</p>
                        {detectedCategory && (
                          <button
                            onClick={handleViewAllResults}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Xem tất cả sản phẩm trong danh mục {getCategoryName(detectedCategory)} →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="p-3 border-b bg-gray-50">
                      <p className="text-sm font-semibold text-gray-700">
                        Tìm thấy {searchResults.length} sản phẩm
                      </p>
                    </div>
                    <div className="divide-y">
                      {searchResults.slice(0, 5).map((product) => (
                        <button
                          key={product.product_id}
                          onClick={() => handleProductClick(product.product_id)}
                          className="w-full p-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
                        >
                          <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                            <img
                              src={
                                product.image_url
                                  ? `${API_URL}${product.image_url}`
                                  : "https://via.placeholder.com/100"
                              }
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/100?text=No+Image";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {product.name}
                            </h4>
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {product.description || "Không có mô tả"}
                            </p>
                            <p className="text-sm font-bold text-black mt-1">
                              {formatCurrency(product.price)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleViewAllResults}
                      className="w-full p-3 text-center text-sm font-semibold text-black hover:bg-gray-50 border-t"
                    >
                      {detectedCategory 
                        ? `Xem tất cả trong danh mục ${getCategoryName(detectedCategory)} →`
                        : `Xem tất cả ${searchResults.length} kết quả →`
                      }
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Icons */}
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
                  <span className="text-sm font-semibold">
                    Xin chào, {username || "Người dùng"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isMenuOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-lg bg-white text-black shadow-2xl ring-1 ring-black ring-opacity-5 z-10 overflow-hidden">
                    {/* User Info Header */}
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-content-center rounded-full bg-white/20 text-lg font-bold backdrop-blur-sm">
                          {username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{username}</p>
                          <p className="text-xs text-white/80 truncate">{storedUser?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        to="/tai-khoan/ho-so"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                      >
                        <div className="grid h-8 w-8 place-content-center rounded-lg bg-blue-50">
                          <User2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">Hồ sơ của tôi</p>
                          <p className="text-xs text-neutral-500">Quản lý thông tin cá nhân</p>
                        </div>
                      </Link>

                      <Link
                        to="/tai-khoan/don-hang"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                      >
                        <div className="grid h-8 w-8 place-content-center rounded-lg bg-green-50">
                          <ShoppingBag className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">Đơn hàng của tôi</p>
                          <p className="text-xs text-neutral-500">Xem lịch sử mua hàng</p>
                        </div>
                      </Link>

                      <Link
                        to="/tai-khoan/doi-mat-khau"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                      >
                        <div className="grid h-8 w-8 place-content-center rounded-lg bg-purple-50">
                          <Lock className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">Đổi mật khẩu</p>
                          <p className="text-xs text-neutral-500">Bảo mật tài khoản</p>
                        </div>
                      </Link>
                    </div>

                    {/* Divider & Logout */}
                    <div className="border-t border-neutral-200 p-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <div className="grid h-8 w-8 place-content-center rounded-lg bg-red-50">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <span className="font-semibold">Đăng xuất</span>
                      </button>
                    </div>
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

          {/* Mobile Icons */}
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

      {/* Main Menu */}
      <div className="border-b border-neutral-200 bg-white">
        {/* Desktop Menu */}
        <div className="mx-auto hidden items-center px-4 md:flex justify-center">
          <ul className="flex items-center gap-2 py-3 text-sm font-bold">
            {primaryNav.map((item) => (
              <li key={item.label} className="shrink-0 group relative">
                <Link
                  to={item.href}
                  className="inline-flex items-center gap-1 rounded px-3 py-2 hover:bg-neutral-100"
                >
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

        {/* Mobile Menu */}
        <div className="md:hidden">
          <div className="px-4 py-2">
            <div className="relative">
              <input
                id="m-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Bạn đang tìm gì..."
                className="w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 text-sm focus:outline-none"
              />
              <button
                onClick={handleSearchClick}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Search className="h-5 w-5 text-neutral-600" />
              </button>
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