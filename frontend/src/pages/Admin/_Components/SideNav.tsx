import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  ShoppingBag,
  Package,
  Users2,
  TicketPercent,
  MessageSquare,
  Settings,
} from "lucide-react";

type Props = { onNavigate?: () => void };

export default function SideNav({ onNavigate }: Props) {
  const { pathname } = useLocation();

  const items = [
    { to: "/admin", label: "Tổng quan", icon: <LayoutGrid /> },
    { to: "/admin/orders", label: "Đơn hàng", icon: <ShoppingBag /> },
    { to: "/admin/products", label: "Sản phẩm", icon: <Package /> },
    { to: "/admin/customers", label: "Khách hàng", icon: <Users2 /> },
    { to: "/admin/chat", label: "Chat", icon: <MessageSquare /> },
    { to: "/admin/vouchers", label: "Mã giảm giá", icon: <TicketPercent /> },
    { to: "/admin/reviews", label: "Đánh giá", icon: <MessageSquare /> },
    // { to: "/admin/settings", label: "Cấu hình", icon: <Settings /> },
  ];

  return (
    <nav className="grid gap-1">
      {items.map((it) => {
        const active =
          pathname === it.to ||
          (it.to !== "/admin" && pathname.startsWith(it.to));
        return (
          <Link
            key={it.to}
            to={it.to}
            onClick={onNavigate}
            className={[
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold",
              active
                ? "bg-black text-white"
                : "text-neutral-800 hover:bg-neutral-100",
            ].join(" ")}
          >
            <span className={active ? "text-white" : "text-neutral-700"}>
              {it.icon}
            </span>
            <span>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
