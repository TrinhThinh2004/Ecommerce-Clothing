import { useEffect, useState, ChangeEvent } from "react";
import {
  UserPlus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Tags,
} from "lucide-react";
import AdminLayout from "../_Components/AdminLayout";
import { formatVnd } from "../../../utils/format";

import {
  getAdminCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  setCustomersActive,
  type Customer,
} from "../../../api/admin";

/* ================= Page ================= */
const PAGE_SIZE = 10;

export default function AdminCustomers() {
  const [items, setItems] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "blocked">("all");
  const [page, setPage] = useState(1);

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  /* ============= Load from API ============= */
  async function load() {
    setLoading(true);
    try {
      const res = await getAdminCustomers({
        q,
        status,
        page,
        pageSize: PAGE_SIZE,
      });

      setItems(res.items);
      setTotal(res.total);
      setPageCount(res.pageCount);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [q, status, page]);

  /* ============= Checkbox logic ============= */
  const allCheckedOnPage =
    items.length > 0 && items.every((c) => checked[c.id]);
  const someCheckedOnPage = items.some((c) => checked[c.id]);

  function toggleAllOnPage(e: ChangeEvent<HTMLInputElement>) {
    const on = e.target.checked;
    const next = { ...checked };
    items.forEach((c) => (next[c.id] = on));
    setChecked(next);
  }

  function toggleOne(id: string, on: boolean) {
    setChecked((prev) => ({ ...prev, [id]: on }));
  }

  /* ============= Bulk actions ============= */
  async function delSelected() {
    const ids = Object.keys(checked).filter((k) => checked[k]);
    if (!ids.length) return;
    if (!confirm(`Xoá ${ids.length} khách hàng đã chọn?`)) return;

    for (const id of ids) await deleteCustomer(id);

    setChecked({});
    load();
  }

  async function setActiveSelectedItems(active: boolean) {
    const ids = Object.keys(checked).filter((k) => checked[k]);
    if (!ids.length) return;
    await setCustomersActive(ids, active);
    setChecked({});
    load();
  }

  /* ============= Row actions ============= */
  async function removeOne(id: string) {
    if (!confirm("Xoá khách hàng này?")) return;
    await deleteCustomer(id);
    load();
  }

  async function toggleActive(id: string, current: boolean) {
    await setCustomersActive([id], !current);
    load();
  }

  /* ============= Create & Update ============= */
  async function onSubmitForm(data: {
    id?: string;
    name: string;
    phone: string;
    email: string;
    active: boolean;
  }) {
    if (!data.id) {
      await createCustomer({
        name: data.name,
        phone: data.phone,
        email: data.email,
        active: data.active,
      });
    } else {
      await updateCustomer(data.id, data);
    }
    load();
  }

  return (
    <AdminLayout
      title="Quản lý khách hàng"
      actions={
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
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
                onChange={(e) => {
                  setPage(1);
                  setQ(e.target.value);
                }}
                placeholder="Tìm theo tên, email hoặc SĐT…"
                className="h-10 w-full rounded-md border border-neutral-300 pl-10 pr-3 text-sm outline-none focus:border-black"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            </div>

            <div>
              <select
                value={status}
                onChange={(e) => {
                  setPage(1);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setStatus(e.target.value as any);
                }}
                className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="blocked">Đã chặn</option>
              </select>
            </div>

            {/* Bulk actions */}
            <div className="flex flex-wrap items-center gap-2 lg:col-span-2">
              <button
                onClick={() => setActiveSelectedItems(true)}
                className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
              >
                Mở chặn
              </button>
              <button
                onClick={() => setActiveSelectedItems(false)}
                className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
              >
                Chặn
              </button>
              <button
                onClick={delSelected}
                className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Xoá
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
                        checked={allCheckedOnPage}
                        ref={(el) => {
                          if (el)
                            el.indeterminate =
                              !allCheckedOnPage && someCheckedOnPage;
                        }}
                        onChange={toggleAllOnPage}
                        className="accent-black"
                      />
                    </th>
                    <th className="px-3 py-3">Khách hàng</th>
                    <th className="w-[170px] px-3 py-3">Email</th>
                    <th className="w-[130px] px-3 py-3">Điện thoại</th>
                    <th className="w-[110px] px-3 py-3">Đơn hàng</th>
                    <th className="w-[140px] px-3 py-3">Tổng chi</th>
                    <th className="w-[120px] px-3 py-3">Trạng thái</th>
                    <th className="w-[140px] px-3 py-3">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y text-sm">
                  {loading && (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-neutral-500">
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    items.map((c) => (
                      <tr key={c.id} className="hover:bg-neutral-50/50">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={!!checked[c.id]}
                            onChange={(e) => toggleOne(c.id, e.target.checked)}
                            className="accent-black"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <div className="font-semibold">{c.name}</div>
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500">
                            <Tags className="h-3.5 w-3.5" />
                            <span>
                              {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                            </span>
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
                            {c.phone}
                          </div>
                        </td>
                        <td className="px-3 py-2">{c.totalOrders}</td>
                        <td className="px-3 py-2 font-semibold">
                          {formatVnd(c.totalSpent)}
                        </td>
                        <td className="px-3 py-2">
                          {c.active ? (
                            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                              Đang hoạt động
                            </span>
                          ) : (
                            <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-700">
                              Đã chặn
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
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toggleActive(c.id, c.active)}
                              className="rounded-md border px-2 py-1.5 text-xs hover:bg-neutral-50"
                            >
                              {c.active ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => removeOne(c.id)}
                              className="rounded-md border px-2 py-1.5 text-xs text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {!loading && items.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-neutral-500">
                        Không có khách hàng phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t px-3 py-3 text-sm">
              <div>
                Hiển thị <b>{items.length}</b> / <b>{total}</b> khách hàng
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

        {showForm && (
          <CustomerFormModal
            initial={editing ?? undefined}
            onClose={() => setShowForm(false)}
            onSubmit={(data) => {
              onSubmitForm(data);
              setShowForm(false);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}

/* ============================================================================
   Pagination
============================================================================ */
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

  const itemCls =
    "rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-40";

  return (
    <nav className="flex items-center gap-2">
      <button disabled={page === 1} className={itemCls} onClick={() => onChange(1)}>
        « Đầu
      </button>

      <button
        disabled={page === 1}
        className={itemCls}
        onClick={() => onChange(page - 1)}
      >
        ‹ Trước
      </button>

      {from > 1 && <span className="px-1 text-neutral-500">…</span>}

      {pages.map((p) => (
        <button
          key={p}
          className={
            p === page
              ? `${itemCls} bg-black text-white border-black`
              : itemCls
          }
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      {to < pageCount && <span className="px-1 text-neutral-500">…</span>}

      <button
        disabled={page === pageCount}
        className={itemCls}
        onClick={() => onChange(page + 1)}
      >
        Sau ›
      </button>
      <button
        disabled={page === pageCount}
        className={itemCls}
        onClick={() => onChange(pageCount)}
      >
        Cuối »
      </button>
    </nav>
  );
}

/* ============================================================================
   Modal Form
============================================================================ */
function CustomerFormModal({
  initial,
  onClose,
  onSubmit,
}: {
  initial?: Customer;
  onClose: () => void;
  onSubmit: (payload: {
    id?: string;
    name: string;
    phone: string;
    email: string;
    active: boolean;
  }) => void;
}) {
  const [form, setForm] = useState(() =>
    initial
      ? {
          id: initial.id,
          name: initial.name,
          phone: initial.phone,
          email: initial.email,
          active: initial.active,
        }
      : { name: "", phone: "", email: "", active: true }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleChange(key: string, value: any) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function submit() {
    if (!form.name.trim()) return alert("Vui lòng nhập tên");
    if (!form.phone.trim()) return alert("Vui lòng nhập số điện thoại");
    if (!form.email.trim()) return alert("Vui lòng nhập email");
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 sm:items-center sm:p-6">
      <div className="w-full max-w-xl overflow-hidden bg-white rounded-t-2xl shadow-xl sm:rounded-2xl">
        <div className="border-b px-4 py-3">
          <h3 className="font-bold">
            {form.id ? "Cập nhật khách hàng" : "Thêm khách hàng"}
          </h3>
        </div>

        <div className="p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold">Họ tên</label>
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="border h-10 w-full rounded-md px-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Số điện thoại</label>
              <input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="border h-10 w-full rounded-md px-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold">Email</label>
            <input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="border h-10 w-full rounded-md px-3 text-sm"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => handleChange("active", e.target.checked)}
              className="accent-black"
            />
            Đang hoạt động
          </label>
        </div>

        <div className="border-t px-4 py-3 flex justify-end gap-2">
          <button onClick={onClose} className="border px-3 py-2 text-sm rounded-md">
            Huỷ
          </button>
          <button
            onClick={submit}
            className="bg-black text-white px-3 py-2 text-sm rounded-md"
          >
            {form.id ? "Lưu thay đổi" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
}
