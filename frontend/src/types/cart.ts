export interface CartItem {
  cart_id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  size?: string | null;
  price_snapshot: number;
  created_at?: string | Date;
  updated_at?: string | Date;
  product?: {
    product_id: number;
    name: string;
    image?: string | null;
    price: number;
  };
}

export interface AddToCartDTO {
  product_id: number;
  quantity: number; // >=1
  size?: string;
}

export interface UpdateCartDTO {
  quantity?: number; // <=0 sẽ xóa item
  size?: string;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  data?: CartItem[];
  item?: CartItem; // cho add/update API
}
