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
  const [page, setPage] = useState(1);

  const limit = 8; // ✅ mỗi trang hiển thị 8 sản phẩm

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`${API_URL}/api/v1/categorys/${id}`)
      .then((res) => setCategory(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // ✅ Phân trang phía frontend
  const paginatedProducts = useMemo(() => {
    if (!category?.products) return [];
    const start = (page - 1) * limit;
    return category.products.slice(start, start + limit);
  }, [category, page]);

  const totalPages = category?.products
    ? Math.ceil(category.products.length / limit)
    : 1;

  if (loading) return <p className="p-6">Đang tải...</p>;
  if (!category) return <p className="p-6">Không tìm thấy danh mục.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{category.name}</h1>

      {paginatedProducts.length === 0 ? (
        <p>Chưa có sản phẩm trong danh mục này.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedProducts.map((p) => (
            <ProductCard key={p.product_id} item={p} />
          ))}
        </div>
      )}

      {/* ✅ Gọi component phân trang */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          pageCount={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </div>
  );
}
