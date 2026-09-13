export type OrderStatus = 
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'accepted'
  | 'picked_up'
  | 'delivering'
  | 'delivered'
  | 'cancelled'
  | 'EN_ROUTE'
  | string;

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
  total_price?: number;
  options?: string[];
}

export interface Order {
  id: string;
  created_at?: string;
  updated_at?: string;
  
  order_code?: string;
  short_code?: string;
  
  customer_id?: string;
  client_id?: string;
  partner_id?: string;
  driver_id?: string;

  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;

  partner_name?: string;
  partner_address?: string;
  restaurant_name?: string;
  restaurant_phone?: string;

  items?: OrderItem[];
  subtotal?: number;
  delivery_fee: number;
  tax_amount?: number;
  total_amount?: number;
  order_value: number;
  payment_method?: string;
  payment_status?: string;

  status: OrderStatus;

  delivery_address?: string;
  delivery_lat?: number;
  delivery_lng?: number;
  lat: number;
  lng: number;
  client_location?: LocationCoordinates;
  partner_location?: LocationCoordinates;
  driver_location?: LocationCoordinates;

  verification_pin?: string;
  pin_code?: string;
  qr_code_data?: string;
}

export type DeliveryOrder = Order;

export function normalizeOrderStatus(status: string): OrderStatus {
  if (!status) return 'pending';
  const upper = status.toUpperCase();
  if (upper === 'EN_ROUTE') return 'EN_ROUTE';
  
  const normalized = status.toLowerCase() as OrderStatus;
  const validStatuses: OrderStatus[] = [
    'pending', 'preparing', 'ready', 'accepted', 
    'picked_up', 'delivering', 'delivered', 'cancelled'
  ];
  return validStatuses.includes(normalized) ? normalized : 'pending';
}
