export type OrderStatus = 
  | 'pending' 
  | 'accepted' 
  | 'preparing' 
  | 'ready' 
  | 'delivering' 
  | 'delivered' 
  | 'cancelled';

export interface Partner {
  id: string;
  name: string;
  name_ar?: string;
  name_fr?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  logo_url?: string;
  is_active?: boolean;
}

export interface MenuItem {
  id: string;
  partner_id: string;
  category_id: string;
  name: string;
  name_ar?: string;
  name_fr?: string;
  description?: string;
  price: number;
  img?: string;
  is_available?: boolean;
  is_popular?: boolean;
  badge?: string;
}

export interface CreateOrderPayload {
  partner_id: string;
  client_id?: string;
  subtotal_ht: number;
  tva_amount: number;
  timbre_fiscal: number;
  delivery_fee: number;
  platform_fee: number;
  driver_earning: number;
  partner_payout: number;
  total_amount: number;
  delivery_address: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
  change_needed_for?: number;
  notes?: string;
  cgu_accepted: boolean;
  inpdp_accepted: boolean;
  items: {
    item_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    options?: Record<string, any>;
  }[];
}
