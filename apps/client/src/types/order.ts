export type OrderStatus = 
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'accepted'
  | 'picked_up'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  heading?: number;
}

export interface OrderItem {
  id?: string;
  menu_item_id?: string;
  name: string;
  quantity: number;
  price?: number;
  unit_price?: number;
  total_price: number;
  options?: string[];
}

export interface Order {
  id: string;
  created_at?: string;
  updated_at?: string;
  
  // الأطراف
  customer_id?: string;
  client_id?: string;
  partner_id?: string;
  driver_id?: string;

  // الحسابات المالية
  items: OrderItem[];
  subtotal?: number;
  delivery_fee?: number;
  tax_amount?: number;
  total_amount: number;
  payment_method?: string;
  payment_status?: string;

  // الحالة
  status: OrderStatus;

  // العناوين والمواقع
  delivery_address: string;
  delivery_lat?: number;
  delivery_lng?: number;
  client_location?: LocationCoordinates;
  partner_location?: LocationCoordinates;
  driver_location?: LocationCoordinates;

  // أمان الـ Handshake الميداني
  verification_pin?: string;
  pin_code?: string;
  qr_code_data?: string;
}

export type OrderDetails = Order;
