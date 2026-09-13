export interface Partner {
  id: string;
  name: string;
  logo: string | null;
  type: string | null;
  cover: string | null;
  phone: string | null;
  address: string | null;
  rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type Restaurant = Partner;

export interface Category {
  id: string;
  name?: string;
  name_fr?: string;
  name_ar?: string;
  label?: string;
  icon?: string;
  is_active?: boolean;
}

export interface MenuItem {
  id: string;
  item_id?: string;
  name: string;
  name_fr?: string;
  name_ar?: string;
  description?: string;
  description_fr?: string;
  description_ar?: string;
  price: number;
  base_price?: number;
  image_url?: string;
  category_id?: string;
  is_available?: boolean;
}
