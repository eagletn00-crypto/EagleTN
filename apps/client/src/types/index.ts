export interface MenuItem {
  id: string;
  partner_id?: string;
  category_id?: string;
  name: string;
  name_fr?: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available?: boolean;
}

export interface Partner {
  id: string;
  name: string;
  name_fr?: string;
  slug?: string;
  logo?: string;
  image?: string;
  cover_url?: string;
  rating?: number;
  reviewsCount?: number;
  delivery_time?: string;
  time?: string;
  delivery_fee?: string | number;
  fee?: string;
  category?: string;
  isOpen?: boolean;
  is_active?: boolean;
  isAvailable?: boolean;
  tag?: string;
  isRoyalBadge?: boolean;
}

export interface Category {
  id: string;
  name: string;
  label?: string;
  icon?: string;
}

export interface CartOption {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  partnerId: string;
  name: string;
  name_fr?: string;
  price: number;
  totalUnitPrice?: number;
  quantity: number;
  options?: CartOption[];
}
