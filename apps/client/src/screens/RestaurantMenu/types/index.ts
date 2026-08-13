export interface MenuItem {
  id: string;
  category_id?: string;
  name: string;
  name_ar?: string;
  name_fr?: string;
  description?: string;
  description_ar?: string;
  description_fr?: string;
  price: number;
  image_url?: string;
  img?: string;
  badge?: string;
  is_popular?: boolean;
  is_spicy?: boolean;
  is_epice?: boolean;
  is_available?: boolean;
}

export interface Category {
  id: string;
  name: string;
  name_ar?: string;
  name_fr?: string;
  icon?: string;
}

export interface RestaurantPartner {
  id: string;
  name: string;
  name_ar?: string;
  name_fr?: string;
  cover_url?: string;
  logo_url?: string;
  rating?: number;
  delivery_time?: string;
  delivery_fee?: number;
  is_open?: boolean;
}
