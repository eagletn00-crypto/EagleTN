export type OrderStatus = 
  | 'pending' 
  | 'in_preparation' 
  | 'ready_for_pickup' 
  | 'in_transit' 
  | 'delivered' 
  | 'completed'
  | 'cancelled';

export interface RawOrderFromSupabase {
  id: string;
  partner_id: string;
  client_id: string;
  courier_id: string | null;
  status: OrderStatus;
  subtotal_ht: number;
  tva_amount: number;
  delivery_fee: number;
  total_amount: number;
  verification_code: string;
  delivery_address: string;
  client_name: string;
  client_phone: string;
  pickup_lat: number | null;
  pickup_lng: number | null;
  delivery_lat: number | null;
  delivery_lng: number | null;
  created_at: string;
  driver_name?: string;
  driver_phone?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MappedLivreurOrder {
  id: string;
  order_code: string;
  short_code: string;
  partnerId: string;
  restaurantName: string;
  restaurant_name: string;
  restaurant_phone?: string;
  clientName: string;
  customer_name: string;
  clientPhone: string;
  customer_phone: string;
  deliveryAddress: string;
  customer_address: string;
  delivery_address: string;
  totalAmount: number;
  total_amount: number;
  order_value: number;
  deliveryFee: number;
  delivery_fee: number;
  status: OrderStatus | string;
  verificationCode: string;
  pickupCoords: Coordinates;
  dropoffCoords: Coordinates;
  lat: number;
  lng: number;
  createdAt: string;
  created_at: string;
  driver_name?: string;
  driver_phone?: string;
}

export type DeliveryOrder = MappedLivreurOrder;
