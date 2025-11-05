import { Product } from '../services/product.service';

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  selected_size?: string;
  selected_color?: string;
  added_at: string;
}

export interface Cart {
  id: string;
  user_id?: string; // null for session carts
  items: CartItem[];
  total_items: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface CartSummary {
  total_items: number;
  total_amount: number;
  subtotal: number;
  tax?: number;
  shipping?: number;
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
  selected_size?: string;
  selected_color?: string;
}

export interface UpdateCartItemRequest {
  cart_item_id: string;
  quantity: number;
  selected_size?: string;
  selected_color?: string;
}

// Local storage cart structure for session users
export interface LocalCartItem {
  product_id: string;
  quantity: number;
  selected_size?: string;
  selected_color?: string;
  added_at: string;
}

export interface LocalCart {
  items: LocalCartItem[];
  updated_at: string;
}