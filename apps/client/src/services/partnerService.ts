import { supabase } from '../lib/supabase';
import { Partner, MenuItem, Restaurant } from '../types/schema';

export const partnerService = {
  async getActivePartners(): Promise<Partner[]> {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data || []) as Partner[];
  },

  async getPartnerById(id: string): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Restaurant;
  },

  async getMenuByPartnerId(partnerId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('partner_id', partnerId)
      .eq('is_available', true)
      .order('display_order', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data || []) as MenuItem[];
  }
};
