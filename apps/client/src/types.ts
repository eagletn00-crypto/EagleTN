export interface MenuItem {
  id: string;
  item_id?: string;
  name?: string;
  name_fr?: string;
  name_ar?: string;
  nameFr?: string;
  nameAr?: string;
  description?: string;
  description_fr?: string;
  description_ar?: string;
  descriptionFr?: string;
  descriptionAr?: string;
  price: number;
  base_price?: number;
  image_url?: string;
  imgUrl?: string;
  category_id?: string;
  categoryId?: string;
}

export interface Category {
  id: string;
  category_id?: string;
  name?: string;
  name_fr?: string;
  nameFr?: string;
  category_name_fr?: string;
  label?: string;
}

export type MenuCategory = Category;

export interface MenuItemWithCategory extends MenuItem {
  category?: Category;
}

export interface Partner {
  id: string;
  name: string;
  logo?: string;
  logo_url?: string;
  cover?: string;
  image_url?: string;
  rating?: number;
  delivery_time?: string;
  address?: string;
}

export interface DeliveryAddress {
  id?: string;
  street?: string;
  city?: string;
  details?: string;
  description?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  price: number;
}

// Import canonical types from shared database package
export type { OrderStatus, PaymentMethod, PaymentStatus, UserRole } from '@eagle/database';
export type { Order, OrderItem, OrderStatusHistory, Profile } from '@eagle/database';
