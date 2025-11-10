export interface OrderItem {
  order_item_id: number;
  order_id: number;
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

export interface OrderItemResponse {
  success: boolean;
  message?: string;
  data?: OrderItem | OrderItem[]; 
}
