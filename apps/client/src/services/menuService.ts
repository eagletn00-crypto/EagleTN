import { supabase } from '../lib/supabase';

export interface MenuItem {
  id: string;
  partner_id: string;
  category_id: string;
  name: string;
  name_fr: string;
  name_ar: string;
  description_fr: string | null;
  description_ar: string | null;
  price: number;
  img: string | null;
  badge: string | null;
  is_popular: boolean;
  is_spicy: boolean;
}

export interface CategoryWithItems {
  id: string;
  code: string;
  name_fr: string;
  name_ar: string;
  sort_order: number;
  menu_items: MenuItem[];
}

export interface Partner {
  id: string;
  name: string;
  name_ar?: string;
  rating?: number;
  reviews_count?: number;
  opening_hours?: string;
  address?: string;
  cover_url?: string;
  is_open?: boolean;
}

export const fetchPartnerDetails = async (partnerId: string | null): Promise<Partner | null> => {
  let query = supabase.from('partners').select('*');
  
  if (partnerId) {
    query = query.eq('id', partnerId);
  } else {
    query = query.limit(1);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    console.error('Error fetching partner:', error);
    return null;
  }
  return data;
};

export const fetchStructuredMenu = async (partnerId?: string): Promise<CategoryWithItems[]> => {
  // جلب جميع التصنيفات وكافة الـ 31 وجبة بدون تقييد صارم بالـ partner_id المفقود
  const [catRes, itemsRes] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('menu_items')
      .select('*')
      .range(0, 999)
  ]);

  if (catRes.error) throw catRes.error;
  if (itemsRes.error) throw itemsRes.error;

  const categories = catRes.data || [];
  const items = itemsRes.data || [];

  return categories.map((cat) => ({
    ...cat,
    menu_items: items.filter((item) => item.category_id === cat.id)
  }));
};
