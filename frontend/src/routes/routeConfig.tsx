import { lazy, type ComponentType, type LazyExoticComponent } from "react";

import Layout from "../components/Layout/Layout";
import { PATHS } from "./paths";
const ProductsPage = lazy(() => import("../pages/Products/ProductsPage"));

// --- Public (lazy) ---
const Home = lazy(() => import("../pages/Home/Home"));
const CategoryPage = lazy(() => import("../pages/Category/CategoryPage")); // ✅ TRANG DANH MỤC
const ProductDetail = lazy(
  () => import("../pages/ProductDetail/ProductDetail")
);
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const StoreLocator = lazy(() => import("../pages/Stores/StoreLocator"));
const Cart = lazy(() => import("../pages/Cart/Cart"));
const Search = lazy(() => import("../pages/Search/Search"));

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

  // ✅ ROUTE MỚI — hiển thị sản phẩm theo danh mục
  {
    path: "/san-pham/:id",
    element: CategoryPage,
    layout: { type: "public" },
  },
  // ✅ Hiển thị tất cả sản phẩm
  {
    path: "/san-pham",
    element: ProductsPage,
    layout: { type: "public" },
  },

  {
    path: PATHS.PRODUCT_DETAIL,
    element: ProductDetail,
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
];
