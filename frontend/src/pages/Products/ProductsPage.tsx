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

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const limit = 8; 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${API_URL}/api/v1/products`);

        //  Kiểm tra dữ liệu trả về từ API
        const data = res.data?.data;
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
          console.warn("API không trả về danh sách hợp lệ:", res.data);
        }
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  //  Phân trang phía frontend
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * limit;
    return products.slice(start, start + limit);
  }, [products, page]);

  const totalPages = Math.ceil(products.length / limit);

  // --- UI hiển thị ---
  if (loading) return <p className="p-6">Đang tải sản phẩm...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 uppercase">Tất cả sản phẩm</h1>

      {paginatedProducts.length === 0 ? (
        <p>Chưa có sản phẩm nào.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedProducts.map((p) => (
            <ProductCard key={p.product_id} item={p} />
          ))}
        </div>
      )}

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
