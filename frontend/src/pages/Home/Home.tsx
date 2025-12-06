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

  // FILTER STATE
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [sortType, setSortType] = useState<
    "default" | "asc" | "desc" | "az" | "za" | "stock_desc"
  >("default");

  const limit = 12;

  // Fetch products
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

  // FILTER + SORT
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchName.trim() !== "") {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (quantity !== "") {
      list = list.filter((p) => p.stock_quantity >= Number(quantity));
    }

    const min = priceMin ? Number(priceMin) : 0;
    const max = priceMax ? Number(priceMax) : Infinity;
    list = list.filter((p) => p.price >= min && p.price <= max);

    if (sortType === "asc") list.sort((a, b) => a.price - b.price);
    if (sortType === "desc") list.sort((a, b) => b.price - a.price);
    if (sortType === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortType === "za") list.sort((a, b) => b.name.localeCompare(a.name));
    if (sortType === "stock_desc") list.sort((a, b) => (b.stock_quantity ?? 0) - (a.stock_quantity ?? 0));

    return list;
  }, [products, searchName, quantity, priceMin, priceMax, sortType]);

  // PAGINATION
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredProducts.slice(start, start + limit);
  }, [filteredProducts, page]);

  const totalPages = Math.ceil(filteredProducts.length / limit);

  if (loading)
    return (
      <div className="text-center py-10">
        <Hero />
        <p>Đang tải sản phẩm...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        <Hero />
        <p>{error}</p>
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100 pb-10 pt-4">
      <Hero />

    
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="bg-[#FFFAE5]   flex items-center justify-between">
          {/* left: reserved for additional filters (currently commented) */}
          <div className="flex flex-wrap gap-4 items-end">
            {/* Search
            <div className="flex flex-col">
              <label className="font-medium text-sm">Tên</label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  setPage(1);
                }}
                className="border rounded p-2 w-40"
                placeholder="Tìm sản phẩm..."
              />
            </div> */}

            {/* other filters are intentionally kept commented out */}
          </div>

          {/* right: sort control */}
            <div className="flex items-center gap-2 ml-4">
  <label className="font-bold text-sm">Sắp xếp: </label>
  <select
    value={sortType}
    onChange={(e) => {
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

    
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <h2 className="text-2xl font-bold mb-4">Tất cả sản phẩm</h2>

        {paginatedProducts.length === 0 ? (
          <p>Không tìm thấy sản phẩm nào.</p>
        ) : (
         <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">

            {paginatedProducts.map((p) => (
              <ProductCard key={p.product_id} item={p} />
            ))}
          </div>
        )}

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
    </div>
  );
}
