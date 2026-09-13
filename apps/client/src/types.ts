export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'e_dinar';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type UserRole = 'client' | 'driver' | 'partner' | 'admin';

export interface Category {
  id: string;
  name: string;
  slug?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  ArabicName?: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  categoryId?: string;
  isAvailable?: boolean;
}

export interface MenuItemWithCategory extends MenuItem {
  category_details?: Category;
}

export interface Partner {
  id: string;
  name: string;
  image?: string;
  logo?: string;
  cover?: string;
  address?: string;
  rating?: number;
  deliveryTime?: string;
  deliveryFee?: number;
  category?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  ArabicName?: string;
}

export interface DeliveryAddress {
  id?: string;
  street: string;
  city: string;
  notes?: string;
}

export interface Order {
  id: string;
  user_id?: string;
  client_id?: string;
  partner_id: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  total_amount: number;
  delivery_fee: number;
  items: OrderItem[];
  created_at?: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  phone?: string;
  role: UserRole;
}

export const normalizeOrderStatus = (status: string): OrderStatus => (status as OrderStatus) || 'pending';
export const normalizePaymentMethod = (method: string): PaymentMethod => (method as PaymentMethod) || 'cash';
export const normalizeUserRole = (role: string): UserRole => (role as UserRole) || 'client';
