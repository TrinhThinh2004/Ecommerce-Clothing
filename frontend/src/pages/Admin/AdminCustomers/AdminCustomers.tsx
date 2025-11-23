/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/Admin/AdminCustomers.tsx
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  UserPlus,
  Search,
  Pencil,
  Trash2,
  
  
  Mail,
  Phone,
  Tags,
} from "lucide-react";
import { formatVnd } from "../../../utils/format";
import AdminLayout from "../_Components/AdminLayout";
import {
  fetchAllCustomers,
  updateCustomer,
  deleteCustomer,
  toggleCustomerStatus,
  type AdminCustomer,
} from "../../../api/admin";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

export default function AdminCustomers() {
  const [items, setItems] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminCustomer | null>(null);

  // Load customers
  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllCustomers();
      setItems(data);
    } catch (err) {
      console.error("Error loading customers:", err);
      toast.error("Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Filter/search
  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return items.filter((c) => {
      const okText =
        !text ||
        c.username.toLowerCase().includes(text) ||
        c.email.toLowerCase().includes(text) ||
        (c.phone_number && c.phone_number.replace(/\s/g, "").includes(text.replace(/\s/g, "")));
      const okRole = roleFilter === "all" || c.role === roleFilter;
      return okText && okRole;
    });
  }, [items, q, roleFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [q, roleFilter]);

  const allCheckedOnPage = paged.length > 0 && paged.every((c) => checked[c.user_id]);
  const someCheckedOnPage = paged.some((c) => checked[c.user_id]);

  function toggleAllOnPage(e: ChangeEvent<HTMLInputElement>) {
    const on = e.target.checked;
    setChecked((prev) => {
      const next = { ...prev };
      paged.forEach((c) => {
        next[c.user_id] = on;
      });
      return next;
    });
  }

  function toggleOne(id: number, on: boolean) {
    setChecked((prev) => ({ ...prev, [id]: on }));
  }

  async function delSelected() {
    const ids = Object.keys(checked)
      .filter((k) => checked[Number(k)])
      .map(Number);
    if (!ids.length) return;
    if (!window.confirm(`Xóa ${ids.length} khách hàng đã chọn?`)) return;

    try {
      await Promise.all(ids.map((id) => deleteCustomer(id)));
      toast.success(`Đã xóa ${ids.length} khách hàng`);
      setChecked({});
      await loadCustomers();
     
    } catch (err) {
      toast.error("Có lỗi khi xóa khách hàng");
    }
  }

  async function toggleStatusSelected(active: boolean) {
    const ids = Object.keys(checked)
      .filter((k) => checked[Number(k)])
      .map(Number);
    if (!ids.length) return;

    try {
      await Promise.all(ids.map((id) => toggleCustomerStatus(id, active)));
      toast.success(`Đã ${active ? "mở chặn" : "chặn"} ${ids.length} khách hàng`);
      setChecked({});
      await loadCustomers();
     
    } catch (err) {
      toast.error("Có lỗi khi cập nhật trạng thái");
    }
  }

  async function removeOne(id: number) {
    if (!window.confirm("Xóa khách hàng này?")) return;
    try {
      await deleteCustomer(id);
      toast.success("Đã xóa khách hàng");
      await loadCustomers();
    } catch (err) {
      toast.error("Không thể xóa khách hàng");
    }
  }

  async function toggleActive(id: number) {
    const customer = items.find((c) => c.user_id === id);
    if (!customer) return;

    try {
      // Toggle based on current status (giả sử có trường is_active)
      await toggleCustomerStatus(id, !customer.role);
      toast.success("Đã cập nhật trạng thái");
      await loadCustomers();
    } catch (err) {
      toast.error("Không thể cập nhật trạng thái");
    }
  }

  async function onSubmitForm(payload: Partial<AdminCustomer>) {
    try {
      if (payload.user_id) {
        // Update
        await updateCustomer(payload.user_id, payload);
        toast.success("Đã cập nhật thông tin khách hàng");
      }
      // Note: Không hỗ trợ tạo mới user từ admin panel
      await loadCustomers();
    } catch (err) {
      toast.error("Không thể lưu thông tin khách hàng");
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Quản lý khách hàng">
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
    <AdminLayout
      title="Quản lý khách hàng"
      actions={
        <button
          onClick={() => {
            toast.info("Tính năng tạo user mới chưa được hỗ trợ. User đăng ký qua trang chủ.");
          }}
          className="inline-flex items-center gap-2 rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-black/90"
        >
          <UserPlus className="h-4 w-4" />
          Thêm khách hàng
        </button>
      }
    >
      <div className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Filters */}
          <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm theo tên, email hoặc SĐT…"
                className="h-10 w-full rounded-md border border-neutral-300 pl-10 pr-3 text-sm outline-none focus:border-black"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            </div>

            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
                className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="user">Khách hàng</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Bulk actions */}
            <div className="flex flex-wrap items-center gap-2 lg:col-span-2">
              <button
                onClick={() => toggleStatusSelected(true)}
                className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
                title="Mở chặn các KH đã chọn"
              >
                Mở chặn
              </button>
              <button
                onClick={() => toggleStatusSelected(false)}
                className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
                title="Chặn các KH đã chọn"
              >
                Chặn
              </button>
              <button
                onClick={delSelected}
                className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                title="Xóa các KH đã chọn"
              >
                <Trash2 className="h-4 w-4" />
                Xóa
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-[920px] w-full table-fixed">
                <thead className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                  <tr>
                    <th className="w-10 px-3 py-3">
                      <input
                        type="checkbox"
                        className="accent-black"
                        checked={allCheckedOnPage}
                        ref={(el) => {
                          if (el) el.indeterminate = !allCheckedOnPage && someCheckedOnPage;
                        }}
                        onChange={toggleAllOnPage}
                      />
                    </th>
                    <th className="px-3 py-3">Khách hàng</th>
                    <th className="w-[170px] px-3 py-3">Email</th>
                    <th className="w-[130px] px-3 py-3">Điện thoại</th>
                    <th className="w-[110px] px-3 py-3">Đơn hàng</th>
                    <th className="w-[140px] px-3 py-3">Tổng chi</th>
                    <th className="w-[120px] px-3 py-3">Vai trò</th>
                    <th className="w-[140px] px-3 py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {paged.map((c) => (
                    <tr key={c.user_id} className="hover:bg-neutral-50/50">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          className="accent-black"
                          checked={!!checked[c.user_id]}
                          onChange={(e) => toggleOne(c.user_id, e.target.checked)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="font-semibold">{c.username}</div>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500">
                          <Tags className="h-3.5 w-3.5" />
                          <span>{new Date(c.created_at).toLocaleDateString("vi-VN")}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 truncate">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-neutral-500" />
                          <span className="truncate">{c.email}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-neutral-500" />
                          <span>{c.phone_number || "-"}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">{c.total_orders || 0}</td>
                      <td className="px-3 py-2 font-semibold">
                        {formatVnd(c.total_spent || 0)}
                      </td>
                      <td className="px-3 py-2">
                        {c.role === "admin" ? (
                          <span className="rounded-full bg-purple-50 px-2 py-1 text-xs font-semibold text-purple-700">
                            Admin
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                            Khách hàng
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditing(c);
                              setShowForm(true);
                            }}
                            className="rounded-md border px-2 py-1.5 text-xs hover:bg-neutral-50"
                            title="Sửa"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeOne(c.user_id)}
                            className="rounded-md border px-2 py-1.5 text-xs text-red-600 hover:bg-red-50"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paged.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-3 py-10 text-center text-sm text-neutral-600">
                        Không có khách hàng phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer: paging info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t px-3 py-3 text-sm">
              <div>
                Hiển thị <b>{paged.length}</b> / <b>{filtered.length}</b> khách hàng
              </div>
              <PaginationSimple
                page={page}
                pageCount={pageCount}
                onChange={(p) => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setPage(p);
                }}
              />
            </div>
          </div>
        </div>

        {/* Modal form */}
        {showForm && (
          <CustomerFormModal
            initial={editing ?? undefined}
            onClose={() => setShowForm(false)}
            onSubmit={(payload) => {
              onSubmitForm(payload);
              setShowForm(false);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}

/* ================= Small components ================= */
function PaginationSimple({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
}) {
  if (pageCount <= 1) return null;

  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  const from = Math.max(1, page - half);
  const to = Math.min(pageCount, from + windowSize - 1);
  const pages = Array.from({ length: to - from + 1 }, (_, i) => from + i);

  const itemCls = "rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-40";

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        className={itemCls}
        onClick={() => onChange(1)}
        disabled={page === 1}
      >
        « Đầu
      </button>
      <button
        type="button"
        className={itemCls}
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        ‹ Trước
      </button>

      {from > 1 && <span className="px-1 text-neutral-500">…</span>}

      {pages.map((p) => (
        <button
          type="button"
          key={p}
          onClick={() => onChange(p)}
          className={
            p === page
              ? `${itemCls} border-black bg-black text-white hover:bg-black`
              : itemCls
          }
        >
          {p}
        </button>
      ))}

      {to < pageCount && <span className="px-1 text-neutral-500">…</span>}

      <button
        type="button"
        className={itemCls}
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
      >
        Sau ›
      </button>
      <button
        type="button"
        className={itemCls}
        onClick={() => onChange(pageCount)}
        disabled={page === pageCount}
      >
        Cuối »
      </button>
    </nav>
  );
}

function CustomerFormModal({
  initial,
  onClose,
  onSubmit,
}: {
  initial?: AdminCustomer;
  onClose: () => void;
  onSubmit: (payload: Partial<AdminCustomer>) => void;
}) {
  const [form, setForm] = useState<Partial<AdminCustomer>>(() => {
    if (initial) {
      return {
        user_id: initial.user_id,
        username: initial.username,
        email: initial.email,
        phone_number: initial.phone_number,
        role: initial.role,
      };
    }
    return {
      username: "",
      email: "",
      phone_number: "",
      role: "user",
    };
  });

  function handleChange<K extends keyof AdminCustomer>(key: K, val: AdminCustomer[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function submit() {
    if (!form.username?.trim()) return alert("Vui lòng nhập tên khách hàng");
    if (!form.email?.trim()) return alert("Vui lòng nhập email");
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 sm:items-center sm:p-6">
      <div className="w-full max-w-xl overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="border-b px-4 py-3">
          <h3 className="text-base font-extrabold">
            {form.user_id ? "Cập nhật khách hàng" : "Thêm khách hàng"}
          </h3>
        </div>

        <div className="space-y-3 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-600">Tên đăng nhập</label>
              <input
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-600">Số điện thoại</label>
              <input
                value={form.phone_number || ""}
                onChange={(e) => handleChange("phone_number", e.target.value)}
                className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-600">Email</label>
            <input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-600">Vai trò</label>
            <select
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value as "admin" | "user")}
              className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black"
            >
              <option value="user">Khách hàng</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
          <button
            onClick={onClose}
            className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
          >
            Hủy
          </button>
          <button
            onClick={submit}
            className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-black/90"
          >
            {form.user_id ? "Lưu thay đổi" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
}