import type { Product } from "./product";

export interface Category {
  category_id: number;
  name: string;
  description?: string;
  parent_id?: number | null;
  created_at?: string;
  updated_at?: string;
  products?: Product[];
  children?: Category[];
}
