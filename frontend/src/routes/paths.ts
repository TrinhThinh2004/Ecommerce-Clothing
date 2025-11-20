// src/routes/paths.ts
export const PATHS = {
  HOME: "/",
  PRODUCT_DETAIL: "/san-pham/:id",
  LOGIN: "/dang-nhap",
  REGISTER: "/dang-ky",
  STORE_LOCATOR: "/he-thong-cua-hang",
  CART: "/gio-hang",
  SEARCH: "/tim-kiem",
FASHION_NEWS: "/tin-thoi-trang", 
  ADMIN: "/admin",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_CUSTOMERS: "/admin/customers",
  PAYMENT_RESULT: "/payment-result",
  ADMIN_SETTINGS: "/admin/settings",
  // ADMIN_SETTINGS: "/admin/settings", ...
} as const;
