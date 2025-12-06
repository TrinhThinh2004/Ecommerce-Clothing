/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState, type ChangeEvent, type FC } from "react";
import {
  PackagePlus, Search, Pencil, Trash2, Image as ImageIcon,
  DollarSign, Package, Archive, AlertTriangle,
   
  CheckCircle2, XCircle, Eye, EyeOff, ServerCrash, RefreshCw, FileText, UploadCloud
} from "lucide-react";
import { formatVnd } from "../../../utils/format";
import type { Category } from "../../../types/categorys";
import AdminLayout from "../_Components/AdminLayout";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../../../api/products"; 
import { fetchCategories } from "../../../api/categorys";
import { toast } from 'react-toastify';


type Product = {
  product_id: number;
  name: string;
  description?: string | null;
  price: number | string; 
  stock_quantity: number;
  image_url?: string | null;
  category_id?: number | null;
  brand_id?: number | null;
  active?: boolean; 
  created_at?: string;
  updated_at?: string;
};

type EditPayload = Omit<Product, "product_id" | "created_at" | "updated_at">;

const PAGE_SIZE = 10;
const LOW_STOCK_THRESHOLD = 5;


const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [stockFilter, setStockFilter] = useState<"all" | "inStock" | "out" | "low">("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    loadData();
    let mounted = true;
    fetchCategories()
      .then((list) => {
        if (!mounted) return;
        console.log("Loaded categories (AdminProducts):", list);
        setCategories(list);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts();
      setItems(data);
    } catch (err) {
      setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const totalValue = items.reduce((sum, p) => {
        const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
        return sum + price * Math.max(0, p.stock_quantity);
    }, 0);
    const lowStockCount = items.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= LOW_STOCK_THRESHOLD).length;
    const outOfStockCount = items.filter((p) => p.stock_quantity <= 0).length;
    return { productCount: items.length, totalValue, lowStockCount, outOfStockCount };
  }, [items]);
  
  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return items.filter((p) => {
      const normalizedStock = Math.max(0, p.stock_quantity);
      const okText = !text || p.name.toLowerCase().includes(text);
      const okStatus = status === "all" || (status === "active" ? (p.active ?? true) : !(p.active ?? true));
      const okStock =
        stockFilter === "all" ||
        (stockFilter === "inStock" && normalizedStock > LOW_STOCK_THRESHOLD) ||
        (stockFilter === "low" && normalizedStock > 0 && normalizedStock <= LOW_STOCK_THRESHOLD) ||
        (stockFilter === "out" && normalizedStock === 0);
      const okCategory =
        categoryFilter === "all" || (p.category_id !== null && p.category_id !== undefined && String(p.category_id) === categoryFilter);
      return okText && okStatus && okStock && okCategory;
    });
  }, [items, q, status, stockFilter, categoryFilter]);

  const categoriesMap = useMemo(() => {
    const m: Record<number, string> = {};
    categories.forEach((c) => { if (c && typeof c.category_id === 'number') m[c.category_id] = c.name; });
    return m;
  }, [categories]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => setPage(1), [q, status, stockFilter, categoryFilter]);

  const allCheckedOnPage = paged.length > 0 && paged.every((p) => checked[p.product_id]);
  const someCheckedOnPage = paged.some((p) => checked[p.product_id]);

  function toggleAllOnPage(e: ChangeEvent<HTMLInputElement>) {
    const on = e.target.checked;
    setChecked((prev) => {
      const next = { ...prev };
      paged.forEach((p) => { next[String(p.product_id)] = on; });
      return next;
    });
  }
  function toggleOne(id: string | number, on: boolean) { setChecked((prev) => ({ ...prev, [String(id)]: on })); }

  async function handleFormSubmit(payload: Partial<EditPayload>, imageFile: File | null, id?: number) {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (id) {
        const updatedProduct = await updateProduct(id, formData);
        setItems(prev => prev.map(p => p.product_id === updatedProduct.product_id ? updatedProduct : p));
      } else {
        const newProduct = await createProduct(formData);
        setItems(prev => [newProduct, ...prev]);
      }
      setShowForm(false);
      toast.success(id ? 'Cập nhật sản phẩm thành công' : 'Tạo sản phẩm thành công');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Đã xảy ra lỗi: ${message}`);
    }
  }

  async function handleRemoveOne(id: number) {
    if (!confirm("Bạn có chắc muốn xoá sản phẩm này?")) return;
    try {
      const success = await deleteProduct(id);
      if (success) {
        setItems(prev => prev.filter(p => p.product_id !== id));
        toast.success('Xoá sản phẩm thành công');
      }
    } catch(err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Đã xảy ra lỗi khi xoá: ${message}`);
    }
  }

  async function handleDelSelected() {
    const idsToDelete = Object.keys(checked).filter((k) => checked[k]);
    if (!idsToDelete.length || !confirm(`Xoá ${idsToDelete.length} sản phẩm đã chọn?`)) return;
    
    try {
      await Promise.all(idsToDelete.map(id => deleteProduct(id)));
      setItems(prev => prev.filter(p => !idsToDelete.includes(String(p.product_id))));
      setChecked({});
      toast.success(`Đã xoá ${idsToDelete.length} sản phẩm thành công`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Đã xảy ra lỗi khi xoá hàng loạt: ${message}`);
    }
  }
  
  return (
    <AdminLayout
      title="Quản lý sản phẩm"
      actions={
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PackagePlus className="h-4 w-4" />
          Thêm sản phẩm
        </button>
      }
    >
      {loading ? (
        <div className="flex h-64 items-center justify-center text-neutral-500">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Đang tải dữ liệu...
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 text-red-600 bg-red-50 rounded-lg">
           <ServerCrash className="h-10 w-10 mb-2" />
          <p className="font-semibold">{error}</p>
          <button onClick={loadData} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Thử lại</button>
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Package} title="Tổng sản phẩm" value={stats.productCount} />
            <StatCard icon={DollarSign} title="Tổng giá trị kho" value={formatVnd(stats.totalValue)} />
            <StatCard icon={Archive} title="Hết hàng" value={stats.outOfStockCount} color="red" />
            <StatCard icon={AlertTriangle} title="Sắp hết hàng" value={stats.lowStockCount} color="yellow" />
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b p-4">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên sản phẩm…" className="h-10 w-full rounded-lg border border-neutral-300 bg-neutral-50 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-64" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="h-10 rounded-lg border border-neutral-300 bg-neutral-50 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang bán</option>
                        <option value="inactive">Đã ẩn</option>
                    </select>
                      <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value as typeof stockFilter)} className="h-10 rounded-lg border border-neutral-300 bg-neutral-50 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <option value="all">Tồn kho: Tất cả</option>
                        <option value="inStock">Còn hàng</option>
                        <option value="low">Sắp hết</option>
                        <option value="out">Hết hàng</option>
                    </select>
                      <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="h-10 rounded-lg border border-neutral-300 bg-neutral-50 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <option value="all">Tất cả danh mục</option>
                        {categories.map((c) => (<option key={c.category_id} value={String(c.category_id)}>{c.name}</option>))}
                      </select>
                    {someCheckedOnPage && (
                        <div className="flex items-center gap-2">
                            <button onClick={handleDelSelected} className="action-btn-danger" title="Xoá các sản phẩm đã chọn"><Trash2 className="h-4 w-4" /></button>
                        </div>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                  <thead className="bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-600">
                    <tr>
                      <th className="w-10 px-4 py-3"><input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500" checked={allCheckedOnPage} ref={(el) => { if (el) el.indeterminate = !allCheckedOnPage && someCheckedOnPage; }} onChange={toggleAllOnPage}/></th>
                      <th className="px-4 py-3">Sản phẩm</th>
                      <th className="w-40 px-4 py-3">Giá bán</th>
                      <th className="w-32 px-4 py-3">Tồn kho</th>
                      <th className="w-36 px-4 py-3">Trạng thái</th>
                      <th className="w-28 px-4 py-3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                      {paged.map((p) => (
                      <tr key={p.product_id} className="hover:bg-neutral-50">
                          <td className="px-4 py-3"><input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500" checked={!!checked[String(p.product_id)]} onChange={(e) => toggleOne(p.product_id, e.target.checked)}/></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                                <img src={p.image_url ? `${API_BASE_URL}${p.image_url}` : 'https://placehold.co/100x100/e2e8f0/adb5bd?text=N/A'} alt={p.name} className="h-12 w-12 flex-shrink-0 rounded-md bg-neutral-100 object-cover" />
                                <div>
                                <div className="font-semibold text-neutral-800">{p.name}</div>
                                <div className="mt-1 text-xs text-neutral-500">{categoriesMap[p.category_id ?? -1] ?? (p.category_id ? `Category ID: ${p.category_id}` : 'N/A')}</div>
                                </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-neutral-800">{formatVnd(Number(p.price))}</td>
                          <td className="px-4 py-3"><StockBadge stock={p.stock_quantity} /></td>
                          <td className="px-4 py-3"><StatusBadge active={p.active ?? true} /></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                                <button onClick={() => { setEditing(p); setShowForm(true); }} className="action-btn" title="Sửa"><Pencil className="h-4 w-4" /></button>
                                <button onClick={() => handleRemoveOne(p.product_id)} className="action-btn-danger" title="Xoá"><Trash2 className="h-4 w-4" /></button>
                            </div>
                          </td>
                      </tr>
                      ))}
                      {paged.length === 0 && (
                      <tr><td colSpan={6} className="py-16 text-center text-neutral-500">Không tìm thấy sản phẩm nào.</td></tr>
                      )}
                  </tbody>
              </table>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-t p-4">
                <div className="text-xs text-neutral-600">Hiển thị <b>{paged.length}</b> trong tổng số <b>{filtered.length}</b> sản phẩm</div>
                <PaginationSimple page={page} pageCount={pageCount} onChange={(p) => { window.scrollTo({ top: 0, behavior: "smooth" }); setPage(p); }} />
            </div>
          </div>
        </>
      )}

      {showForm && (
        <ProductFormModal
          initial={editing ?? undefined}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </AdminLayout>
  );
}


 
const StatCard: FC<{ icon: FC<any>, title: string, value: string | number, color?: 'red' | 'yellow' }> = ({ icon: Icon, title, value, color }) => {
    const colors = { red: "text-red-600 bg-red-50", yellow: "text-yellow-600 bg-yellow-50", default: "text-blue-600 bg-blue-50" };
    return (<div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"><div className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg ${colors[color || 'default']}`}><Icon className="h-5 w-5" /></div><h3 className="text-xs font-medium uppercase text-neutral-500">{title}</h3><p className="text-2xl font-bold text-neutral-800">{value}</p></div>);
};
const StatusBadge: FC<{ active: boolean }> = ({ active }) => active ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />Đang bán</span> : <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-600"><XCircle className="h-3.5 w-3.5" />Đã ẩn</span>;
const StockBadge: FC<{ stock: number }> = ({ stock }) => {
  const normalized = Math.max(0, stock);
  if (normalized === 0) return <span className="font-semibold text-red-600">Hết hàng</span>;
  if (normalized <= LOW_STOCK_THRESHOLD) return <span className="font-semibold text-yellow-600">{normalized} (Sắp hết)</span>;
  return <span>{normalized}</span>;
}
function PaginationSimple({ page, pageCount, onChange }: { page: number, pageCount: number, onChange: (p: number) => void; }) {
  if (pageCount <= 1) return null;
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  let from = Math.max(1, page - half);
  // eslint-disable-next-line prefer-const
  let to = Math.min(pageCount, from + windowSize - 1);
  if (to - from + 1 < windowSize) { from = Math.max(1, to - windowSize + 1); }
  const pages = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  const itemCls = "h-8 w-8 grid place-content-center rounded-lg border text-xs transition-colors disabled:opacity-50";
  return (
    <nav className="flex items-center gap-2" aria-label="Pagination">
      <button type="button" className={itemCls} onClick={() => onChange(1)} disabled={page === 1}>«</button>
      <button type="button" className={itemCls} onClick={() => onChange(page - 1)} disabled={page === 1}>‹</button>
      {from > 1 && <span className="px-1 text-neutral-500">…</span>}
      {pages.map((p) => (<button type="button" key={p} onClick={() => onChange(p)} className={p === page ? `${itemCls} border-blue-600 bg-blue-600 text-white` : `${itemCls} hover:bg-neutral-100`}>{p}</button>))}
      {to < pageCount && <span className="px-1 text-neutral-500">…</span>}
      <button type="button" className={itemCls} onClick={() => onChange(page + 1)} disabled={page === pageCount}>›</button>
      <button type="button" className={itemCls} onClick={() => onChange(pageCount)} disabled={page === pageCount}>»</button>
    </nav>
  );
}


function ProductFormModal({ initial, onClose, onSubmit, }: { 
  initial?: Product; 
  onClose: () => void; 
  onSubmit: (payload: Partial<EditPayload>, imageFile: File | null, id?: number) => void; 
}) {
  const [form, setForm] = useState<Partial<EditPayload>>(() => {
    if (initial) {
      const { product_id, created_at, updated_at, ...editableFields } = initial;
      return {
        ...editableFields,
        price: Number(editableFields.price)
      };
    }
    return { name: "", description: "", image_url: "", price: 0, stock_quantity: 0, active: true, category_id: null };
  });


  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initial?.image_url ? `${API_BASE_URL}${initial.image_url}` : null);

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchCategories().then((list) => {
      if (!mounted) return;
      setCategories(list);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
    }
  };

   
  function handleChange(key: keyof EditPayload, val: any) { 
    setForm((prev) => ({ ...prev, [key]: val })); 
  }
  
  function submit() {
  if (!form.name?.trim()) { toast.error("Vui lòng nhập tên sản phẩm"); return; }
  if (form.price === undefined || Number(form.price) <= 0) { toast.error("Giá bán phải lớn hơn 0"); return; }
    
    const payload: EditPayload = {
      name: form.name,
      description: form.description || null,
      price: Number(form.price),
      stock_quantity: form.stock_quantity || 0,
      image_url: form.image_url || null,
      active: form.active ?? true,
      category_id: form.category_id ?? null,
    };

    onSubmit(payload, imageFile, initial?.product_id);
  }

  return (
  <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" onClick={onClose}>
    <div className="w-full max-w-3xl rounded-t-2xl bg-white shadow-xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b px-6 py-4">
                <h3 className="text-lg font-bold">{initial?.product_id ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</h3>
                <button onClick={onClose} className="rounded-full p-1.5 hover:bg-neutral-100"><XCircle className="h-5 w-5" /></button>
            </div>
      <div className="grid max-h-[70vh] gap-6 overflow-y-auto p-6 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="space-y-4">
          
            <FormInput label="Tên sản phẩm" value={form.name} onChange={(e:any) => handleChange("name", e.target.value)} icon={Package} required />
            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-600">Mô tả</label>
              <textarea
                value={form.description || ''}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-neutral-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-600">Danh mục</label>
              <select
                value={form.category_id ?? ""}
                onChange={(e) => handleChange("category_id", e.target.value ? Number(e.target.value) : null)}
                className="w-full rounded-lg border border-neutral-300 p-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              
              <FormInput label="Giá bán (VND)" type="number" value={form.price} onChange={(e:any) => handleChange("price", e.target.valueAsNumber)} icon={DollarSign} required />
              <FormInput label="Tồn kho" type="number" value={form.stock_quantity} onChange={(e:any) => handleChange("stock_quantity", e.target.valueAsNumber)} icon={Archive} required />
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-neutral-600">Ảnh sản phẩm</label>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-neutral-50 p-4">
            <div className="aspect-square w-full mb-4">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full rounded-lg object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-neutral-100"><ImageIcon className="h-10 w-10 text-neutral-400" /></div>
              )}
            </div>
            <label htmlFor="image-upload" className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-700 border border-neutral-300 hover:bg-neutral-50">
              <UploadCloud className="h-4 w-4" />
              <span>{imageFile ? "Đổi ảnh" : "Chọn ảnh"}</span>
            </label>
            <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {imageFile && <p className="text-xs text-neutral-500 mt-2 truncate">{imageFile.name}</p>}
          </div>
        </div>
      </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t bg-neutral-50 px-6 py-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500" checked={form.active} onChange={(e) => handleChange("active", e.target.checked)} />
                    {form.active ? "Đang bán" : "Tạm ẩn"}
                </label>
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">Huỷ</button>
                    <button onClick={submit} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">{initial?.product_id ? "Lưu thay đổi" : "Tạo sản phẩm"}</button>
                </div>
            </div>
        </div>
    </div>
  );
}

const FormInput: FC<any> = ({ label, icon: Icon, ...props }) => (
  <div>
    <label className="mb-1 block text-xs font-semibold text-neutral-600">{label}</label>
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"><Icon className="h-4 w-4" /></span>
      <input
        className="h-10 w-full rounded-lg border border-neutral-300 bg-transparent pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        {...props}
      />
    </div>
  </div>
);

