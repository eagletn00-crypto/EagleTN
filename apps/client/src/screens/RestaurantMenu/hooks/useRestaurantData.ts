import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Partner } from '../../../types/partner';
import { MenuItem } from '../../../services/api';

const DEFAULT_AM_ALI_ID = 'a1b2c3d4-a5f6-7890-abcd-111122223333';

export const useRestaurantData = (partnerProp?: Partner) => {
  const [partner, setPartner] = useState<Partner>(() => ({
    id: DEFAULT_AM_ALI_ID,
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
    ...partnerProp,
    ...(partnerProp?.id === 'partner-royal-hergma' ? { id: DEFAULT_AM_ALI_ID, name: 'Chez Am Ali - عم علي' } : {})
  }));

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      const targetId = partner.id === 'partner-royal-hergma' ? DEFAULT_AM_ALI_ID : partner.id;

      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('partner_id', targetId);

        if (isMounted) {
          if (!error && data && data.length > 0) {
            setMenuItems(data as MenuItem[]);
          } else {
            // قائمة أطباق افتراضية لمطعم عم علي في حال كانت قاعدة البيانات فارغة
            setMenuItems([
              { id: 'm1', name: 'Kafteji Tunisien', description: 'Kafteji traditionnel avec œuf et frites', price: 8.500, category: 'Incontournables' },
              { id: 'm2', name: 'Ojja Markouz', description: 'Ojja frappe au merguez artisanal', price: 12.000, category: 'Incontournables' },
              { id: 'm3', name: 'Couscous au Poisson', description: 'Couscous traditionnel tunisien', price: 18.000, category: 'Tous les plats' }
            ]);
          }
        }
      } catch (e) {
        if (isMounted) {
          setMenuItems([
            { id: 'm1', name: 'Kafteji Tunisien', description: 'Kafteji traditionnel avec œuf et frites', price: 8.500, category: 'Incontournables' }
          ]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [partner.id]);

  return { partner, menuItems, loading };
};
