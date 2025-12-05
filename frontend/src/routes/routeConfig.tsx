import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import Layout from "../components/Layout/Layout";
import { PATHS } from "./paths";

// --- Public (lazy) ---
const Home = lazy(() => import("../pages/Home/Home"));
const ProductsPage = lazy(() => import("../pages/Products/ProductsPage"));
const CategoryPage = lazy(() => import("../pages/Category/CategoryPage"));
const ProductDetail = lazy(() => import("../pages/ProductDetail/ProductDetail"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const StoreLocator = lazy(() => import("../pages/Stores/StoreLocator"));
const Cart = lazy(() => import("../pages/Cart/Cart"));
const Search = lazy(() => import("../pages/Search/Search"));
const FashionNewsPage = lazy(() => import("../pages/FashionNews/FashionNewsPage"));
const OrderPolicy = lazy(() => import("../pages/policy/OrderPolicy")); 
const PrivacyPolicy = lazy(() => import("../pages/policy/PrivacyPolicy"));
const ExchangeWarrantyPolicy = lazy(() => import("../pages/policy/ExchangeWarrantyPolicy"));
const PaymentResult = lazy(() => import("../pages/payment/PaymentResult"));
const OrderHistory = lazy(() => import("../pages/payment/orderHistory"));

// --- User Account (lazy) ---
const UserLayout = lazy(() => import("../pages/User/UserLayout"));
const UserProfile = lazy(() => import("../pages/User/UserProfile"));
const UserOrders = lazy(() => import("../pages/User/UserOrders"));
const ChangePassword = lazy(() => import("../pages/User/ChangePassword"));

// --- Admin (lazy) ---
const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboard/AdminDashboard"));
const AdminOrders = lazy(() => import("../pages/Admin/Orders/AdminOrders"));
const AdminProducts = lazy(() => import("../pages/Admin/AdminProducts/AdminProducts"));
const AdminCustomers = lazy(() => import("../pages/Admin/AdminCustomers/AdminCustomers"));
const AdminChat = lazy(() => import("../pages/Admin/AdminChat/AdminChat"));
const AdminReviews = lazy(() => import("../pages/Admin/AdminReviews/AdminReviews"));
const AdminSettings = lazy(() => import("../pages/Admin/AdminSetting/AdminSetting"));

// --- Types ---
type PublicLayoutProps = Omit<React.ComponentProps<typeof Layout>, "children">;
type PageElement =
  | ComponentType<Record<string, unknown>>
  | LazyExoticComponent<ComponentType<Record<string, unknown>>>;
type LayoutWrapper =
  | { type: "none" }
  | { type: "public"; props?: PublicLayoutProps }
  | { type: "user" };

type RouteItem = {
  path: string;
  element: PageElement;
  layout?: LayoutWrapper;
  children?: Omit<RouteItem, "children">[];
};

export const ROUTES: RouteItem[] = [
  // --- Public Routes ---
  { 
    path: PATHS.HOME, 
    element: Home, 
    layout: { type: "public" } 
  },

  // Trang tất cả sản phẩm
  { 
    path: "/san-pham", 
    element: ProductsPage, 
    layout: { type: "public" } 
  },

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

  // Policies
  {
    path: "/huong-dan-dat-hang",
    element: OrderPolicy,
    layout: { type: "public", props: { noBanner: true } },
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

  // Other
  { 
    path: PATHS.PAYMENT_RESULT, 
    element: PaymentResult, 
    layout: { type: "public", props: { noBanner: true } },
  },
  {
    path: PATHS.FASHION_NEWS,
    element: FashionNewsPage,
    layout: { type: "public" },
  },
  {
    path: PATHS.ORDER_HISTORY, 
    element: OrderHistory, 
    layout: { type: "public" } 
  },

  // Auth
  { 
    path: PATHS.LOGIN, 
    element: Login, 
    layout: { type: "none" } 
  },
  { 
    path: PATHS.REGISTER, 
    element: Register, 
    layout: { type: "none" } 
  },
  { 
    path: "/forgot-password", 
    element: ForgotPassword, 
    layout: { type: "none" } 
  },
  { 
    path: "/reset-password", 
    element: ResetPassword, 
    layout: { type: "none" } 
  },

  // Store & Cart
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

  // --- User Account Routes (Nested) ---
  {
    path: PATHS.USER_ACCOUNT,
    element: UserLayout,
    layout: { type: "public", props: { noBanner: true } },
    children: [
     
      {
        path: PATHS.USER_ORDERS,
        element: UserOrders,
      },
      {
        path: PATHS.USER_CHANGE_PASSWORD,
        element: ChangePassword,

      },
    ],
  },
{
        path: PATHS.USER_PROFILE,
        element: UserProfile,
        layout: { type: "public", props: { noBanner: true, noFooter: true } },
      },
      {
        path: PATHS.USER_ORDERS,
        element: UserOrders,
        layout: { type: "public", props: { noBanner: true, noFooter: true } },
      },
      {
        path: PATHS.USER_CHANGE_PASSWORD,
        element: ChangePassword,
layout: { type: "public", props: { noBanner: true, noFooter: true } },
      },
  // --- Admin Routes ---
  { 
    path: PATHS.ADMIN, 
    element: AdminDashboard, 
    layout: { type: "none" } 
  },
  { 
    path: PATHS.ADMIN_ORDERS, 
    element: AdminOrders, 
    layout: { type: "none" } 
  },
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
    element: AdminSettings,
    layout: { type: "none" },
  },
  { 
    path: PATHS.ADMIN_CHAT, 
    element: AdminChat, 
    layout: { type: "none" } 
  },
  {
    path: PATHS.ADMIN_REVIEWS, 
    element: AdminReviews, 
    layout: { type: "none" }
  },  
];