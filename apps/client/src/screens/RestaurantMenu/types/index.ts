export interface MenuItem {
  id: string;
  partner_id: string;
  category_id?: string;
  name: string;
  name_ar?: string;
  name_fr?: string;
  description?: string;
  description_ar?: string;
  description_fr?: string;
  price: number;
  img?: string;
  is_available: boolean;
  badge?: string;
  is_popular?: boolean;
  is_spicy?: boolean;
  display_type?: 'hero' | 'standard' | 'compact';
}

export interface Category {
  id: string;
  name: string;
  count?: number;
}
