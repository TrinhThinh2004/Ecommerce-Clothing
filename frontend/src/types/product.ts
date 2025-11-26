export type Product = {
  product_id: number;
  name: string;
  description?: string | null;
  price: number; // đơn vị VND
  stock_quantity: number;
 image_url?: string | null | undefined;


  category_id?: number | null;
  brand_id?: number | null;
  created_at?: string;
  updated_at?: string;
  isNew?: boolean;
  voucherText?: string; // ví dụ: "Voucher 30K"
  category?: string; // <-- thêm (optional để không vỡ các chỗ cũ)
  tags?: string[]; // <-- tùy, nếu bạn lọc theo tag
};
  