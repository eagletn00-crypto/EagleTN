import { supabase } from '../lib/supabase';
import { Partner, Category, MenuItem } from '../types/partner';

export type { Partner, Category, MenuItem };

export const partnerService = {
  async getPartners(): Promise<Partner[]> {
    const { data, error } = await supabase.from('partners').select('*').eq('is_active', true);
    if (error) {
      console.warn('Supabase fetch partners failed:', error);
      return [];
    }
    return data || [];
  },

  async getActivePartners(): Promise<Partner[]> {
    return this.getPartners();
  },

  async getPartnerById(partnerId: string): Promise<Partner | null> {
    const { data, error } = await supabase.from('partners').select('*').eq('id', partnerId).single();
    if (error) return null;
    return data;
  },

  async getPartnerDetailsWithMenu(partnerId: string): Promise<{
    partner: Partner | null;
    categories: Category[];
    items: MenuItem[];
  }> {
    try {
      const [partnerRes, categoriesRes, itemsRes] = await Promise.all([
        supabase.from('partners').select('*').eq('id', partnerId).single(),
        supabase.from('categories').select('*'),
        supabase.from('menu_items').select('*').eq('partner_id', partnerId)
      ]);

      return {
        partner: partnerRes.data || null,
        categories: categoriesRes.data || [],
        items: itemsRes.data || []
      };
    } catch (err) {
      console.error('Error fetching partner details:', err);
      return { partner: null, categories: [], items: [] };
    }
  }
};
