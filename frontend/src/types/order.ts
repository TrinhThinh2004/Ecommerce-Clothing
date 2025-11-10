export type PaymentMethod = "cod" | "vnpay" | "momo";
export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipping"
  | "completed"
  | "cancelled";

export interface OrderItemInput {
  product_id: number;
  quantity: number;
  size?: string;
  unit_price: number;
}

export interface OrderInput {
  user_id: number;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
  ward?: string;
  note?: string;
  voucher_code?: string;
  discount_amount?: number;
  shipping_fee?: number;
  total_price: number;
  payment_method: PaymentMethod;
  items: OrderItemInput[];
}

export interface OrderItem {
  order_item_id: number;
  product_id: number;
  quantity: number;
  size?: string;
  unit_price: number;
  subtotal: number;
  product?: {
    product_id: number;
    name: string;
    image_url?: string;
  };
}

export interface Order {
  order_id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  district?: string;
  ward?: string;
  note?: string;
  voucher_code?: string;
  discount_amount: number;
  shipping_fee: number;
  total_price: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  data?: Order | Order[];
}
