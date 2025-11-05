import { useEffect, useState, useMemo } from "react";
import Hero from "../../components/Hero/Hero";
import ProductCard from "../../components/Products/ProductCard";
import Pagination from "../../components/Products/Pagination";
import { fetchProducts } from "../../api/products";
import type { Product } from "../../types/product";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const limit = 12; // ✅ 12 sản phẩm / trang

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * limit;
    return products.slice(start, start + limit);
  }, [products, page]);

  const totalPages = Math.ceil(products.length / limit);

  if (loading) {
    return (
      <div className="space-y-6 bg-gradient-to-b from-amber-50 to-amber-100 pb-10 pt-4">
        <Hero />
        <p className="text-center py-10">Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 bg-gradient-to-b from-amber-50 to-amber-100 pb-10 pt-4">
        <Hero />
        <p className="text-center text-red-500 py-10">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100 pb-10 pt-4">
      {/* ✅ Banner Hero */}
      <Hero />

      {/* ✅ Tiêu đề */}
      <div className="mx-auto max-w-6xl px-4 mt-8 mb-4">
        <h2 className="text-2xl font-bold text-gray-800 uppercase">
          Tất cả sản phẩm
        </h2>
      </div>

      {/* ✅ Danh sách sản phẩm */}
      <div className="mx-auto w-full max-w-6xl px-4">
        {paginatedProducts.length === 0 ? (
          <p>Không có sản phẩm nào.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedProducts.map((p) => (
              <ProductCard key={p.product_id} item={p} />
            ))}
          </div>
        )}
      </div>

      {/* ✅ Phân trang */}
      {totalPages > 1 && (
        <div className="mt-8">
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
