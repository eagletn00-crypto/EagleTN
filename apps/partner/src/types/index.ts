export interface Partner {
  id: string;
  slug?: string;
  name: string;
  phone?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  logo_url?: string;
  cover_url?: string;
  banner_url?: string;
  delivery_time?: string;
  delivery_fee?: number;
  rating?: number;
  is_active?: boolean;
}

export interface MenuItem {
  id: string;
  partner_id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available?: boolean;
  category_id?: string;
}

export * from './order';
