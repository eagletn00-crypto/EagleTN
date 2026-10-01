export interface MenuItem {
  id: string;
  partner_id?: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string | null;
  is_available?: boolean;
  options?: any[];
  [key: string]: any;
}

export interface Category {
  id: string;
  code?: string;
  partner_id?: string;
  name?: string;
  name_fr?: string;
  name_ar?: string;
  sort_order?: number;
  icon?: string;
  items?: MenuItem[];
  [key: string]: any;
}

export interface Restaurant {
  id: string;
  name: string;
  type?: string | null;
  logo_url?: string | null;
  cover_url?: string | null;
  rating?: number | null;
  review_count?: number;
  delivery_time?: string;
  delivery_fee?: number | null;
  min_order?: number;
  address?: string;
  [key: string]: any;
}

export interface Partner {
  id: string;
  name: string;
  type?: string | null;
  logo_url?: string | null;
  cover_url?: string | null;
  rating?: number | null;
  badge?: string | null;
  address?: string;
  latitude?: number;
  longitude?: number;
  delivery_time?: string;
  delivery_fee?: number | null;
  is_active?: boolean;
  [key: string]: any;
}
