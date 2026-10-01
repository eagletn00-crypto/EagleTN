export interface MenuItem {
  id: string;
  item_id?: string;
  name?: string;
  name_fr?: string;
  name_ar?: string;
  nameFr?: string;
  nameAr?: string;
  ArabicName?: string;
  arabic_name?: string;
  arabicName?: string;
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
  slug?: string;
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
  image?: string;
  image_url?: string;
  rating?: number;
  delivery_time?: string;
  deliveryTime?: string;
  deliveryFee?: number;
  delivery_fee?: number;
  address?: string;
  category?: string;
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

export interface OrderItem {
  id?: string;
  menu_item_id?: string;
  name?: string;
  price: number;
  quantity: number;
  options?: any;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  status: OrderStatus;
  items: CartItem[];
  totalAmount: number;
}
