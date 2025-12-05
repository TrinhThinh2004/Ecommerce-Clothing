export type Product = {
  product_id: number;
  name: string;
  description?: string | null;
  price: number; 
  stock_quantity: number;
  image_url?: string | null;

  category_id?: number | null;
  brand_id?: number | null;
  created_at?: string;
  updated_at?: string;
  isNew?: boolean;
  voucherText?: string;
  category?: string;
  tags?: string[];
};
