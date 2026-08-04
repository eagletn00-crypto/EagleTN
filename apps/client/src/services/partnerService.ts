import { supabase } from '../lib/supabase';
import { Partner, Category, MenuItem } from '../types';

export const partnerService = {
  async getPartnerByIdOrSlug(identifier: string): Promise<Partner | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    const column = isUuid ? 'id' : 'slug';

    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq(column, identifier)
      .single();

    if (error) {
      console.error('Error fetching partner:', error);
      return null;
    }
    return data as Partner;
  },

  async getCategories(partnerId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('partner_id', partnerId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    return data as Category[];
  },

  async getMenuItems(partnerId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('partner_id', partnerId)
      .eq('is_available', true);

    if (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      partner_id: item.partner_id,
      category_id: item.category_id,
      name: item.name_fr || item.name || '',
      arName: item.name_ar || '',
      description: item.description_fr || item.description || '',
      price: Number(item.price || 0),
      image_url: item.image_url || '',
      is_available: item.is_available ?? true
    }));
  }
};
