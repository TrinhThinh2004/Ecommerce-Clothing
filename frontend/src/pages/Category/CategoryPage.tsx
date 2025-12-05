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
  const limit = 8;

  // Filter States
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");

  // Sort
  const [sortType, setSortType] = useState<"default" | "asc" | "desc">(
    "default"
  );

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    axios
      .get(`${API_URL}/api/v1/categorys/${id}`)
      .then((res) => setCategory(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // FILTER + SORT
  const filteredProducts = useMemo(() => {
    if (!category?.products) return [];

    let list = [...category.products];

    // Filter by price
    const min = priceMin ? Number(priceMin) : 0;
    const max = priceMax ? Number(priceMax) : Infinity;
    list = list.filter((p) => p.price >= min && p.price <= max);

    // Sort
    if (sortType === "asc") list.sort((a, b) => a.price - b.price);
    if (sortType === "desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [category, priceMin, priceMax, sortType]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredProducts.slice(start, start + limit);
  }, [filteredProducts, page]);

  const totalPages = Math.ceil(filteredProducts.length / limit);

  if (loading) return <p className="p-6">Đang tải...</p>;
  if (!category) return <p className="p-6">Không tìm thấy danh mục.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">{category.name}</h1>

      {/* FILTER BAR (Horizontal) */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col sm:flex-row items-center gap-4">

        {/* Price Min */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="font-medium text-sm">Giá Min</label>
          <input
            type="number"
            value={priceMin}
            onChange={(e) => {
              setPriceMin(e.target.value);
              setPage(1);
            }}
            className="border rounded w-full p-2"
            placeholder="0"
          />
        </div>

        {/* Price Max */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="font-medium text-sm">Giá Max</label>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => {
              setPriceMax(e.target.value);
              setPage(1);
            }}
            className="border rounded w-full p-2"
            placeholder="999999"
          />
        </div>

        {/* Sort */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="font-medium text-sm">Sắp xếp</label>
          <select
            value={sortType}
            onChange={(e) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setSortType(e.target.value as any);
              setPage(1);
            }}
            className="border p-2 rounded"
          >
            <option value="default">Mặc định</option>
            <option value="asc">Giá thấp → cao</option>
            <option value="desc">Giá cao → thấp</option>
          </select>
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
