export interface MenuItemOption {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name?: string;
  name_fr?: string;
  name_ar?: string;
  description?: string;
  description_fr?: string;
  description_ar?: string;
  price: number;
  image_url?: string;
  img?: string;
  category_id?: string;
  category_name?: string;
  is_popular?: boolean;
  is_available?: boolean;
}

export interface Category {
  id: string;
  name: string;
  count?: number;
}
