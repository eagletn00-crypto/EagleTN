export interface Partner {
  id: string;
  name: string;
  name_fr?: string;
  name_ar?: string;
  logo_url?: string;
  cover_url?: string;
  category?: string;
  rating?: number;
  delivery_time?: string;
  delivery_fee?: number;
  is_active?: boolean;
}

export interface Category {
  id: string;
  name: string;
  name_fr?: string;
  name_ar?: string;
  partner_id?: string;
}

export interface MenuItem {
  id: string;
  partner_id?: string;
  category_id?: string;
  name: string;
  name_fr?: string;
  name_ar?: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available?: boolean;
}

export interface CartItem {
  id: string;
  menuItemId?: string;
  name: string;
  name_fr?: string;
  name_ar?: string;
  price: number;
  totalUnitPrice?: number;
  quantity: number;
  partnerId?: string;
  partner_id?: string;
  selectedOptions?: any[];
}
