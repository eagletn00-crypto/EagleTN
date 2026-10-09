import { supabase } from '../lib/supabase';

export interface MenuItem {
  id: string;
  partner_id: string;
  category_id?: string;
  name: string;
  name_fr?: string;
  name_ar?: string;
  description?: string;
  description_fr?: string;
  description_ar?: string;
  price: number;
  current_price?: number;
  image_url?: string;
  current_photo_url?: string;
  img?: string;
  is_available?: boolean;
  is_popular?: boolean;
  is_recommended?: boolean;
  badge?: string;
}

export async function fetchPartners() {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*');

    if (error) {
      console.error('Error fetching partners:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Fetch partners exception:', err);
    return [];
  }
}

export async function fetchMenuItemsByPartner(partnerId: string): Promise<MenuItem[]> {
  try {
    // 1. جلب المنتجات بواسطة partner_id المباشر
    let { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('partner_id', partnerId);

    if (error || !data || data.length === 0) {
      // 2. المحاولة عبر slug لعم علي
      const { data: amAliPartner } = await supabase
        .from('partners')
        .select('id')
        .eq('slug', 'chez-am-ali')
        .maybeSingle();

      if (amAliPartner?.id) {
        const { data: amAliItems } = await supabase
          .from('menu_items')
          .select('*')
          .eq('partner_id', amAliPartner.id);

        if (amAliItems && amAliItems.length > 0) {
          return amAliItems as MenuItem[];
        }
      }
    }

    return (data as MenuItem[]) || [];
  } catch (err) {
    console.error('Error fetching menu items:', err);
    return [];
  }
}
