export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'picking_up' | 'delivering' | 'completed' | 'cancelled';

export interface OrderItem {
  id?: string;
  menu_item_id?: string;
  name: string;
  quantity: number;
  price?: number;
  unit_price?: number;
  total_price?: number;
  options?: any[];
  [key: string]: any;
}

export interface Order {
  id: string;
  customer_id: string;
  partner_id: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  tax_amount: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  status: OrderStatus | string;
  delivery_address: string;
  verification_pin?: string;
  qr_code_data?: string;
  created_at: string;

  // الحقول الميدانية الحية للتتبع والتنسيق
  courier_id?: string | null;
  courier_name?: string | null;
  courier_phone?: string | null;
  courier_vehicle?: string | null;
  courier_lat?: number | null;
  courier_lng?: number | null;
  partner_lat?: number | null;
  partner_lng?: number | null;
  client_lat?: number | null;
  client_lng?: number | null;
  eta_minutes?: number | null;
  [key: string]: any;
}
