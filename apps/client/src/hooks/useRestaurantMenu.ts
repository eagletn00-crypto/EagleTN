import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface MenuItem {
  item_id: string;
  item_name_ar: string;
  item_name_fr: string;
  item_description_ar?: string;
  item_description_fr?: string;
  item_price: number;
  item_img_url?: string;
  is_available: boolean;
  category_id: string;
  category_name_ar: string;
  category_name_fr: string;
  category_sort_order: number;
  partner_id?: string;
  restaurant_name?: string;
}

export const useRestaurantMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('v_active_menu')
          .select('*');

        if (fetchError) throw fetchError;

        if (data && data.length > 0) {
          setItems(data);
        } else {
          console.warn('v_active_menu returned empty data');
          setItems([]);
        }
      } catch (err: any) {
        console.error('Error fetching from v_active_menu:', err);
        setError(err.message || 'Error loading menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return { items, loading, error };
};
