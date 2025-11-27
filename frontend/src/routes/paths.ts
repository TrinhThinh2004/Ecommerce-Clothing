// src/routes/paths.ts
export const PATHS = {
  // Public routes
  HOME: "/",
  LOGIN: "/dang-nhap",
  REGISTER: "/dang-ky",
  PRODUCTS: "/san-pham",
  PRODUCT_DETAIL: "/san-pham/:id",
  CATEGORY: "/san-pham/danh-muc/:id",
  CART: "/gio-hang",
  SEARCH: "/search",
  STORE_LOCATOR: "/he-thong-cua-hang",
  FASHION_NEWS: "/tin-thoi-trang",
  PAYMENT_RESULT: "/payment/result",
  ORDER_HISTORY: "/lich-su-don-hang",

  // Policies
  ORDER_POLICY: "/huong-dan-dat-hang",
  PRIVACY_POLICY: "/chinh-sach-bao-mat",
  EXCHANGE_WARRANTY_POLICY: "/chinh-sach-doi-tra",

  // User Account Routes
  USER_ACCOUNT: "/tai-khoan",
  USER_PROFILE: "/tai-khoan/ho-so",
  USER_ORDERS: "/tai-khoan/don-hang",
  USER_CHANGE_PASSWORD: "/tai-khoan/doi-mat-khau",

  // Admin routes
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_CUSTOMERS: "/admin/customers",
  ADMIN_SETTINGS: "/admin/settings",
  ADMIN_CHAT: "/admin/chat",
  ADMIN_REVIEWS: "/admin/reviews",
} as const;