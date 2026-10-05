import { supabase } from '../lib/supabase';
import { Partner } from '../types/partner';

export interface MenuItem {
  id: string;
  partner_id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  is_available?: boolean;
}

export const MOCK_PARTNERS: Partner[] = [
  {
    id: 'a1b2c3d4-a5f6-7890-abcd-111122223333',
    name: 'Chez Am Ali - عم علي',
    category: 'Cuisine Tunisienne',
    rating: 4.9,
    review_count: 128,
    delivery_time: '20-30 min',
    delivery_fee: 2.500,
    min_order: 10.000,
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    latitude: 36.8065,
    longitude: 10.1815,
  }
];

export const fetchPartners = async (): Promise<Partner[]> => {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('is_active', true);

    if (error || !data || data.length === 0) {
      return MOCK_PARTNERS;
    }
    return data as unknown as Partner[];
  } catch {
    return MOCK_PARTNERS;
  }
};

export const fetchMenuItemsByPartner = async (partnerId: string): Promise<MenuItem[]> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('partner_id', partnerId);

    if (error || !data) {
      return [];
    }
    return data as MenuItem[];
  } catch {
    return [];
  }
};
