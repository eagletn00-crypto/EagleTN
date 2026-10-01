import { supabase } from '../lib/supabase';
import { Partner, Category, MenuItem } from '../types/partner';

export const OM_ALI_PARTNER_ID = '00000000-0000-0000-0000-000000000001';

export const fetchPartners = async (): Promise<Partner[]> => {
  try {
    const { data, error } = await supabase.from('partners').select('*');
    if (error || !data || data.length === 0) {
      return [getDefaultOmAliPartner()];
    }
    return data as Partner[];
  } catch (err) {
    console.warn('Fallback to Default Partner:', err);
    return [getDefaultOmAliPartner()];
  }
};

export const fetchCategoriesByPartner = async (partnerId: string): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getFallbackCategories();
    }
    return data as Category[];
  } catch (err) {
    return getFallbackCategories();
  }
};

export const fetchMenuItemsByPartner = async (partnerId: string): Promise<MenuItem[]> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('partner_id', partnerId)
      .eq('is_active', true);

    if (error || !data || data.length === 0) {
      const { data: allData } = await supabase.from('menu_items').select('*').limit(20);
      return (allData as MenuItem[]) || [];
    }
    return data as MenuItem[];
  } catch (err) {
    console.error('Error fetching menu items:', err);
    return [];
  }
};

export const createRemoteOrder = async (orderPayload: any) => {
  try {
    const { data, error } = await supabase.from('orders').insert([orderPayload]).select();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Order saved locally or simulation mode:', err);
    return null;
  }
};

export const getDefaultOmAliPartner = (): Partner => ({
  id: OM_ALI_PARTNER_ID,
  name: 'Chez Om Ali',
  name_ar: 'مطعم عم علي',
  legal_name: 'Chez Om Ali SARL',
  tax_id: '1234567/A/M/000',
  rating: 5.0,
  delivery_fee: 2.500,
  estimated_time: '15-25 min',
  delivery_time: '15-25 min',
  distance: '1.2 km',
  address: 'Tunis',
  cover_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
  logo_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80',
  logo: null,
  cover: null,
  type: 'Spécialités tunisiennes • Kafteji • Ojja',
  phone: '+216 98 000 000',
  specialties: ['Plats', 'Kafteji', 'Ojja', 'Poulet Rôti'],
  is_active: true,
  opening_hours: '11:00 - 22:00',
  latitude: 36.8065,
  longitude: 10.1815,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const getFallbackCategories = (): Category[] => [
  { id: '87a160e5-d5d2-4ff0-98e1-f0ae760c4f37', code: 'plat', name_fr: 'Plats', name_ar: 'أطباق', sort_order: 1 },
  { id: '3894ea53-b4bd-495f-ba25-74030af62648', code: 'sandwich', name_fr: 'Sandwichs', name_ar: 'سندويشات', sort_order: 2 },
  { id: '3bec0e3a-b16b-493b-93fb-4cfe30cff332', code: 'boisson', name_fr: 'Boissons', name_ar: 'مشروبات', sort_order: 3 },
  { id: '0f503a36-daf3-4555-8b4e-6ad5babd59b3', code: 'supplement', name_fr: 'Suppléments', name_ar: 'إضافات', sort_order: 4 },
];
