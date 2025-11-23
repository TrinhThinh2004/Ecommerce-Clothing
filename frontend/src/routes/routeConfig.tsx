import { lazy, type ComponentType, type LazyExoticComponent } from "react";

import Layout from "../components/Layout/Layout";
import { PATHS } from "./paths";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import path from "path";

// --- Public (lazy) ---
const Home = lazy(() => import("../pages/Home/Home"));
const ProductsPage = lazy(() => import("../pages/Products/ProductsPage"));
const CategoryPage = lazy(() => import("../pages/Category/CategoryPage"));
const ProductDetail = lazy(
  () => import("../pages/ProductDetail/ProductDetail")
);
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const StoreLocator = lazy(() => import("../pages/Stores/StoreLocator"));
const Cart = lazy(() => import("../pages/Cart/Cart"));
const Search = lazy(() => import("../pages/Search/Search"));
const FashionNewsPage = lazy(
  () => import("../pages/FashionNews/FashionNewsPage")
);
const OrderPolicy = lazy(() => import("../pages/policy/OrderPolicy")); 
const PrivacyPolicy = lazy(() => import("../pages/policy/PrivacyPolicy"));
const ExchangeWarrantyPolicy = lazy(
  () => import("../pages/policy/ExchangeWarrantyPolicy")
);
const PaymentResult = lazy(() => import("../pages/payment/PaymentResult"));

// --- Admin (lazy) ---
const AdminDashboard = lazy(
  () => import("../pages/Admin/AdminDashboard/AdminDashboard")
);
const AdminOrders = lazy(() => import("../pages/Admin/Orders/AdminOrders"));
const AdminProducts = lazy(
  () => import("../pages/Admin/AdminProducts/AdminProducts")
);
const AdminCustomers = lazy(
  () => import("../pages/Admin/AdminCustomers/AdminCustomers")
);
const AdminChat = lazy(() => import("../pages/Admin/AdminChat/AdminChat"));
const orderHistory = lazy(
  () => import("../pages/payment/orderHistory")
);
const AdminReviews = lazy(
  () => import("../pages/Admin/AdminReviews/AdminReviews")
);
// --- Các định nghĩa Type ---
type PublicLayoutProps = Omit<React.ComponentProps<typeof Layout>, "children">;
type PageElement =
  | ComponentType<Record<string, unknown>>
  | LazyExoticComponent<ComponentType<Record<string, unknown>>>;
type LayoutWrapper =
  | { type: "none" }
  | { type: "public"; props?: PublicLayoutProps };
type RouteItem = {
  path: string;
  element: PageElement;
  layout?: LayoutWrapper;
};

export const ROUTES: RouteItem[] = [
  // --- Public Routes ---
  { path: PATHS.HOME, element: Home, layout: { type: "public" } },

  //  Trang tất cả sản phẩm
  { path: "/san-pham", element: ProductsPage, layout: { type: "public" } },

  // Trang danh mục
  {
    path: "/san-pham/danh-muc/:id",
    element: CategoryPage,
    layout: { type: "public" },
  },

  // Trang chi tiết sản phẩm
  {
    path: "/san-pham/:id",
    element: ProductDetail,
    layout: { type: "public", props: { noBanner: true } },
  },

  // Trang hướng dẫn đặt hàng
  {
    path: "/huong-dan-dat-hang",
    element: OrderPolicy,
    layout: { type: "public", props: { noBanner: true } },
  },
  { 
    path: "/payment-result", 
    element: PaymentResult, 
    layout: { type: "public" , props: {noBanner: true}} ,
  },
  {
    path: "/chinh-sach-bao-mat",
    element: PrivacyPolicy,
    layout: { type: "public", props: { noBanner: true } },
  },
  {
    path: "/chinh-sach-doi-tra",
    element: ExchangeWarrantyPolicy,
    layout: { type: "public", props: { noBanner: true } },
  },
  // Trang tin tức thời trang
  {
    path: PATHS.FASHION_NEWS,
    element: FashionNewsPage,
    layout: { type: "public" },
  },

  { path: PATHS.LOGIN, element: Login, layout: { type: "none" } },
  { path: PATHS.REGISTER, element: Register, layout: { type: "none" } },
  {
    path: PATHS.STORE_LOCATOR,
    element: StoreLocator,
    layout: { type: "public" },
  },
  {
    path: PATHS.CART,
    element: Cart,
    layout: { type: "public", props: { noBanner: true, noFooter: true } },
  },
  {
    path: PATHS.SEARCH,
    element: Search,
    layout: { type: "public", props: { noBanner: true, noFooter: true } },
  },

  // --- Admin Routes ---
  { path: PATHS.ADMIN, element: AdminDashboard, layout: { type: "none" } },
  { path: PATHS.ADMIN_ORDERS, element: AdminOrders, layout: { type: "none" } },
  {
    path: PATHS.ADMIN_PRODUCTS,
    element: AdminProducts,
    layout: { type: "none" },
  },
  {
    path: PATHS.ADMIN_CUSTOMERS,
    element: AdminCustomers,
    layout: { type: "none" },
  },
  {
    path: PATHS.ADMIN_SETTINGS,
    element: lazy(() => import("../pages/Admin/AdminSetting/AdminSetting")),
    layout: { type: "none" },
  },
  { path: "/admin/chat", element: AdminChat, layout: { type: "none" } },
  { path: "/order-history", element: orderHistory, layout: { type: "public" } },
  {path: PATHS.ADMIN_REVIEWS, element: AdminReviews, layout: { type: "none" }},  
];
