// src/pages/Admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  ShoppingBag,
  Users2,
  TicketPercent,
  Package,
  MessageSquare,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Settings,
  BarChart3,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import AdminLayout from "../_Components/AdminLayout";
import { fetchAllOrders, type AdminOrder } from "../../../api/admin";
import { fetchAllCustomers, type AdminCustomer } from "../../../api/admin";
import { formatVnd } from "../../../utils/format";

type TimeRange = "day" | "week" | "month";
type ChartPoint = { label: string; value: number; revenue: number };

type DashboardStats = {
  todayOrders: number;
  todayRevenue: number;
  totalCustomers: number;
  newCustomers: number;
  pendingOrders: number;
  completedOrders: number;
  avgOrderValue: number;
  conversionRate: number;
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    todayRevenue: 0,
    totalCustomers: 0,
    newCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    avgOrderValue: 0,
    conversionRate: 0,
  });
  const [range, setRange] = useState<TimeRange>("day");
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      generateChartData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, orders]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, customersData] = await Promise.all([
        fetchAllOrders(),
        fetchAllCustomers(),
      ]);
      
      setOrders(ordersData);
      setCustomers(customersData);
      calculateStats(ordersData, customersData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      toast.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData: AdminOrder[], customersData: AdminCustomer[]) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Today's orders
    const todayOrders = ordersData.filter(
      (o) => new Date(o.created_at) >= todayStart
    );
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total_price, 0);

    // New customers (last 30 days)
    const newCustomers = customersData.filter(
      (c) => new Date(c.created_at) >= last30Days
    ).length;

    // Order status counts
    const pendingOrders = ordersData.filter(
      (o) => o.status === "pending" || o.status === "processing"
    ).length;
    const completedOrders = ordersData.filter(
      (o) => o.status === "completed"
    ).length;

    // Average order value
    const totalRevenue = ordersData.reduce((sum, o) => sum + o.total_price, 0);
    const avgOrderValue = ordersData.length > 0 ? totalRevenue / ordersData.length : 0;

    // Conversion rate (completed / total orders)
    const conversionRate =
      ordersData.length > 0 ? (completedOrders / ordersData.length) * 100 : 0;

    setStats({
      todayOrders: todayOrders.length,
      todayRevenue,
      totalCustomers: customersData.length,
      newCustomers,
      pendingOrders,
      completedOrders,
      avgOrderValue,
      conversionRate,
    });
  };

  const generateChartData = () => {
    const data: ChartPoint[] = [];
    const now = new Date();

    if (range === "day") {
      // Last 24 hours
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hourStart = new Date(
          hour.getFullYear(),
          hour.getMonth(),
          hour.getDate(),
          hour.getHours()
        );
        const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);

        const hourOrders = orders.filter((o) => {
          const orderTime = new Date(o.created_at);
          return orderTime >= hourStart && orderTime < hourEnd;
        });

        data.push({
          label: `${String(hourStart.getHours()).padStart(2, "0")}:00`,
          value: hourOrders.length,
          revenue: hourOrders.reduce((sum, o) => sum + o.total_price, 0),
        });
      }
    } else if (range === "week") {
      // Last 7 days
      const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

        const dayOrders = orders.filter((o) => {
          const orderTime = new Date(o.created_at);
          return orderTime >= dayStart && orderTime < dayEnd;
        });

        data.push({
          label: days[dayStart.getDay()],
          value: dayOrders.length,
          revenue: dayOrders.reduce((sum, o) => sum + o.total_price, 0),
        });
      }
    } else {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

        const dayOrders = orders.filter((o) => {
          const orderTime = new Date(o.created_at);
          return orderTime >= dayStart && orderTime < dayEnd;
        });

        data.push({
          label: String(dayStart.getDate()),
          value: dayOrders.length,
          revenue: dayOrders.reduce((sum, o) => sum + o.total_price, 0),
        });
      }
    }

    setChartData(data);
  };

  const recentOrders = orders
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 6);

  if (loading) {
    return (
      <AdminLayout title="Tổng quan">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-neutral-600">Đang tải...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tổng quan">
      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Đơn hôm nay"
          value={stats.todayOrders}
          sub={`${stats.pendingOrders} đang xử lý`}
          icon={<ShoppingBag className="h-5 w-5" />}
          trend={stats.todayOrders > 0 ? "up" : undefined}
        />
        <KpiCard
          title="Doanh thu hôm nay"
          value={formatVnd(stats.todayRevenue)}
          sub={`TB: ${formatVnd(stats.avgOrderValue)}/đơn`}
          icon={<BarChart3 className="h-5 w-5" />}
          trend={stats.todayRevenue > 0 ? "up" : undefined}
        />
        <KpiCard
          title="Khách hàng"
          value={stats.totalCustomers}
          sub={`${stats.newCustomers} khách mới (30 ngày)`}
          icon={<Users2 className="h-5 w-5" />}
        />
        <KpiCard
          title="Tỉ lệ hoàn thành"
          value={stats.conversionRate.toFixed(1)}
          suffix="%"
          sub={`${stats.completedOrders} đơn hoàn thành`}
          icon={<LayoutGrid className="h-5 w-5" />}
        />
      </div>

      {/* Quick links */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <h2 className="mb-3 text-base font-extrabold">Quản lý nhanh</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ManageTile
            to="/admin/orders"
            title="Quản lý Đơn hàng"
            desc="Xem, đổi trạng thái, in hóa đơn"
          >
            <ShoppingBag className="h-5 w-5" />
          </ManageTile>
          <ManageTile
            to="/admin/products"
            title="Quản lý Sản phẩm"
            desc="Tạo mới, chỉnh sửa, tồn kho"
          >
            <Package className="h-5 w-5" />
          </ManageTile>
          <ManageTile
            to="/admin/customers"
            title="Quản lý Khách hàng"
            desc="Thông tin, phân nhóm, ghi chú"
          >
            <Users2 className="h-5 w-5" />
          </ManageTile>
          <ManageTile
            to="/admin/vouchers"
            title="Mã giảm giá"
            desc="Tạo chiến dịch, theo dõi dùng mã"
          >
            <TicketPercent className="h-5 w-5" />
          </ManageTile>
          <ManageTile
            to="/admin/reviews"
            title="Đánh giá"
            desc="Duyệt/ẩn, phản hồi khách hàng"
          >
            <MessageSquare className="h-5 w-5" />
          </ManageTile>
          <ManageTile
            to="/admin/chat"
            title="Chat với khách hàng"
            desc="Xem và trả lời tin nhắn"
          >
            <MessageSquare className="h-5 w-5" />
          </ManageTile>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold">Phân tích đơn hàng</h2>
            <p className="text-sm text-neutral-600">
              Số lượng đơn theo{" "}
              {range === "day"
                ? "giờ (24h qua)"
                : range === "week"
                ? "ngày (7 ngày qua)"
                : "ngày (30 ngày qua)"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RangeBtn active={range === "day"} onClick={() => setRange("day")}>
              Ngày
            </RangeBtn>
            <RangeBtn
              active={range === "week"}
              onClick={() => setRange("week")}
            >
              Tuần
            </RangeBtn>
            <RangeBtn
              active={range === "month"}
              onClick={() => setRange("month")}
            >
              Tháng
            </RangeBtn>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ left: 8, right: 8, top: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="currentColor"
                    stopOpacity={0.25}
                  />
                  <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  borderColor: "rgb(229 231 235)",
                }}
                formatter={(val: number, name: string) => {
                  if (name === "value") return [val, "Đơn"];
                  if (name === "revenue") return [formatVnd(val), "Doanh thu"];
                  return [val, name];
                }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="currentColor"
                fill="url(#g)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-extrabold">Đơn hàng gần đây</h2>
          <Link
            to="/admin/orders"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Xem tất cả
          </Link>
        </div>
        <ul className="divide-y">
          {recentOrders.map((order) => (
            <li
              key={order.order_id}
              className="flex items-center justify-between py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  #{order.order_id} • {order.full_name} •{" "}
                  {order.items?.length || 0} sản phẩm
                </p>
                <p className="text-xs text-neutral-600">
                  {order.phone} • {order.payment_method.toUpperCase()} •{" "}
                  {formatVnd(order.total_price)}
                </p>
              </div>
              <div className="ml-3 flex items-center gap-3">
                <StatusBadge status={order.status} />
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </div>
            </li>
          ))}
          {recentOrders.length === 0 && (
            <li className="py-8 text-center text-sm text-neutral-600">
              Chưa có đơn hàng nào
            </li>
          )}
        </ul>
      </div>
    </AdminLayout>
  );
}

/* ================= Small components ================= */
function KpiCard({
  title,
  value,
  sub,
  icon,
  suffix,
  trend,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  suffix?: string;
  trend?: "up" | "down";
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-600">{title}</p>
        <span className="rounded-lg bg-neutral-100 p-2 text-neutral-700">
          {icon}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-2xl font-extrabold">
          {value}
          {suffix ? (
            <span className="ml-1 text-lg font-bold">{suffix}</span>
          ) : null}
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
              trend === "up" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
          </span>
        )}
      </div>
      {sub && <p className="mt-1 text-xs text-neutral-500">{sub}</p>}
    </div>
  );
}

function ManageTile({
  to,
  title,
  desc,
  children,
}: {
  to: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-3 rounded-lg border border-neutral-200 p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
    >
      <span className="rounded-lg bg-neutral-100 p-3 text-neutral-700">
        {children}
      </span>
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        <p className="truncate text-sm text-neutral-600">{desc}</p>
      </div>
    </Link>
  );
}

function RangeBtn({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-md px-3 py-1.5 text-sm font-semibold transition",
        active
          ? "bg-black text-white"
          : "border border-neutral-200 hover:bg-neutral-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", label: "Chờ xử lý" },
    processing: { bg: "bg-sky-50", text: "text-sky-700", label: "Đang xử lý" },
    shipping: { bg: "bg-indigo-50", text: "text-indigo-700", label: "Đang giao" },
    completed: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Hoàn thành" },
    cancelled: { bg: "bg-red-50", text: "text-red-700", label: "Đã hủy" },
  };
  const style = map[status] || map.pending;
  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}