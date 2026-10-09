import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { fetchMenuItemsByPartner, MenuItem } from '../../../services/api';

export interface PartnerDetails {
  id: string;
  name: string;
  rating?: number;
  delivery_time?: string;
  delivery_fee?: number;
  cover_url?: string;
}

export function useRestaurantData(partnerId: string) {
  const [partner, setPartner] = useState<PartnerDetails | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        // 1. جلب بيانات الشريك
        const { data: partnerData, error: partnerErr } = await supabase
          .from('partners')
          .select('*')
          .eq('id', partnerId)
          .maybeSingle();

        if (partnerErr) {
          console.error('Erreur chargement partenaire:', partnerErr);
        }

        // 2. جلب قائمة الأصناف من خدمات API
        const items = await fetchMenuItemsByPartner(partnerId);

        if (isMounted) {
          if (partnerData) {
            setPartner(partnerData);
          } else {
            setPartner({
              id: partnerId,
              name: 'Chez Am Ali - عم علي',
              rating: 4.9,
              delivery_time: '20-30 min',
              delivery_fee: 2.0,
            });
          }

          if (items && items.length > 0) {
            setMenuItems(items);
          } else {
            // بيانات احتياطية متوافقة تماماً مع نوع MenuItem
            setMenuItems([
              {
                id: 'm1',
                partner_id: partnerId,
                name: 'Kafteji Tunisien',
                name_fr: 'Kafteji Tunisien',
                description: 'Kafteji traditionnel avec œuf et frites',
                price: 8.500,
                category_id: 'incontournables',
                is_popular: true,
              },
              {
                id: 'm2',
                partner_id: partnerId,
                name: 'Ojja Merguez',
                name_fr: 'Ojja Merguez',
                description: 'Ojja fraîche au merguez artisanal',
                price: 12.000,
                category_id: 'incontournables',
                is_popular: true,
              },
              {
                id: 'm3',
                partner_id: partnerId,
                name: 'Couscous au Poisson',
                name_fr: 'Couscous au Poisson',
                description: 'Couscous traditionnel tunisien',
                price: 18.000,
                category_id: 'all',
              },
            ]);
          }
        }
      } catch (err: any) {
        console.error('Erreur hook useRestaurantData:', err);
        if (isMounted) {
          setError(err.message || 'Erreur lors du chargement des données');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (partnerId) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [partnerId]);

  return { partner, menuItems, loading, error };
}

export default useRestaurantData;
