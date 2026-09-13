export interface Partner {
  id: string;
  name: string;
  legal_name?: string;
  tax_id?: string;
  logo_url?: string;
  cover_url?: string;
  rating: number;
  delivery_fee: number;
  estimated_time: string;
  is_active: boolean;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  partner_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  category: string;
}
