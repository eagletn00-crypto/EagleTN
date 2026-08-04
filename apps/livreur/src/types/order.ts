export interface DeliveryOrder {
  id: string;
  order_code: string;
  short_code: string;
  restaurant_name: string;
  restaurant_phone: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  lat: number;
  lng: number;
  order_value: number; // الكاش المطلوب قبضة
  delivery_fee: number; // ربح السائق
  status: 'PREPARATION' | 'EN_ROUTE' | 'DELIVERED' | 'CANCELLED';
}

export type IssueReason = 'RESTAURANT_CLOSED' | 'CLIENT_UNREACHABLE' | 'WRONG_ADDRESS' | 'VEHICLE_BREAKDOWN' | 'OTHER';
