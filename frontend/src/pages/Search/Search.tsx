import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../../components/Products/ProductGrid";
import axios from "axios";
import { toast } from "react-toastify";
import type { Product } from "../../types/product"; // ✅ import kiểu Product

export default function Search() {
  const [params] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const query = (params.get("q") ?? "").trim();

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get<{ data: Product[] }>(
          `http://localhost:5000/api/v1/products/search?query=${encodeURIComponent(
            query
          )}`
        );
        setProducts(res.data.data || []);
      } catch {
        toast.error("Không thể tìm sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Kết quả tìm kiếm</h1>
        <p className="text-neutral-600 mb-6">
          {query ? (
            <>
              Từ khóa: <b>“{query}”</b> —{" "}
            </>
          ) : null}
          Tìm thấy <b>{products.length}</b> sản phẩm
        </p>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <ProductGrid items={products} showSeeMore seeMoreText="Xem thêm" />
        )}
      </div>
    </div>
  );
}
