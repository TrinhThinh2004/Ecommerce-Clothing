import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ProductCard from "../../components/Products/ProductCard";
import Pagination from "../../components/Products/Pagination";

interface Product {
  product_id: number;
  name: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  category_id?: number;
}

interface Category {
  id: number;
  name: string;
  products?: Product[];
}

const API_URL = import.meta.env.VITE_API_URL;

export default function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 12;

  // (No filters) — only sorting

  // Sort (match Home.tsx options)
  const [sortType, setSortType] = useState<
    "default" | "asc" | "desc" | "az" | "za" | "stock_desc"
  >("default");

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    axios
      .get(`${API_URL}/api/v1/categorys/${id}`)
      .then((res) => setCategory(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // Only sort products (no filters)
  const filteredProducts = useMemo(() => {
    if (!category?.products) return [];

    const list = [...category.products];
    if (sortType === "asc") list.sort((a, b) => a.price - b.price);
    if (sortType === "desc") list.sort((a, b) => b.price - a.price);
    if (sortType === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortType === "za") list.sort((a, b) => b.name.localeCompare(a.name));
    if (sortType === "stock_desc") list.sort((a, b) => (b.stock_quantity ?? 0) - (a.stock_quantity ?? 0));
    return list;
  }, [category, sortType]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredProducts.slice(start, start + limit);
  }, [filteredProducts, page]);

  const totalPages = Math.ceil(filteredProducts.length / limit);

  if (loading) return <p className="p-6">Đang tải...</p>;
  if (!category) return <p className="p-6">Không tìm thấy danh mục.</p>;

  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100 pb-10 pt-4">

      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* <h1 className="text-2xl font-bold mb-4">{category.name}</h1> */}

         <div className="bg-[#FFFAE5] p-4  flex items-center justify-between">
          {/* left: reserved for additional filters (currently commented) */}
          <div className="flex flex-wrap gap-4 items-end">
            {/* reserved for future filters */}
          </div>

          {/* right: sort control */}
          <div className="flex items-center gap-2 ml-4">
            <label className="font-bold text-sm">Sắp xếp: </label>
            <select
              value={sortType}
              onChange={(e) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setSortType(e.target.value as any);
                setPage(1);
              }}
              className="border rounded p-2 w-40"
            >
              <option value="default">Mặc định</option>
              <option value="asc">Giá: tăng dần</option>
              <option value="desc">Giá: giảm dần</option>
              <option value="az">Tên: A → Z</option>
              <option value="za">Tên: Z → A</option>
              <option value="stock_desc">Tồn kho:giảm</option>
            </select>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      {paginatedProducts.length === 0 ? (
        <p>Không tìm thấy sản phẩm phù hợp.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedProducts.map((p) => (
            <ProductCard key={p.product_id} item={p} />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            page={page}
            pageCount={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

    </div>
  );
}
