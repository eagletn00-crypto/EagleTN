import { supabase } from '../lib/supabase';
import { Partner as SchemaPartner } from '../types/schema';

export type Partner = SchemaPartner;

export interface MenuItem {
  id: string;
  partner_id: string;
  category_id: string;
  name_fr: string;
  name_ar?: string;
  description_fr?: string;
  current_price: number;
  image_url?: string;
  is_available: boolean;
}

export interface Category {
  id: string;
  name_fr: string;
  name_ar: string;
  sort_order: number;
}

export async function getPartnerDetailsWithMenu(partnerId: string) {
  const [partnerRes, categoriesRes, itemsRes] = await Promise.all([
    supabase.from('partners').select('*').eq('id', partnerId).single(),
    supabase.from('categories').select('*').order('sort_order', { ascending: true }),
    supabase.from('menu_items').select('*').eq('partner_id', partnerId).eq('is_available', true)
  ]);

  if (partnerRes.error) throw partnerRes.error;
  if (categoriesRes.error) throw categoriesRes.error;
  if (itemsRes.error) throw itemsRes.error;

  return {
    partner: partnerRes.data as unknown as Partner,
    categories: categoriesRes.data as Category[],
    items: itemsRes.data as MenuItem[],
  };
}

export async function getActivePartners(): Promise<Partner[]> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return data as unknown as Partner[];
}

export const partnerService = {
  getPartnerDetailsWithMenu,
  getActivePartners,
  getPartners: getActivePartners,
  getPartnerById: async (id: string) => {
    const { data, error } = await supabase.from('partners').select('*').eq('id', id).single();
    if (error) throw error;
    return data as unknown as Partner;
  }
};
