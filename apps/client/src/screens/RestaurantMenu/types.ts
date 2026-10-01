export interface MenuItem {
  id: string;
  partner_id?: string;
  category_id?: string;
  name: string;
  name_fr?: string | null;
  name_ar?: string | null;
  description?: string | null;
  description_fr?: string | null;
  description_ar?: string | null;
  price: number;
  current_price?: number | null;
  img?: string | null;
  image_url?: string | null;
  current_photo_url?: string | null;
  photo_status?: string | null;
  badge?: string | null;
  is_available?: boolean;
  is_popular?: boolean;
  is_spicy?: boolean;
  is_out_of_stock?: boolean;
  display_order?: number;
}

export interface Category {
  id: string;
  name: string;
  name_fr?: string | null;
  name_ar?: string | null;
  display_order?: number;
}
