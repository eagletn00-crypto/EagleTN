import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { RestaurantPartner, Category, MenuItem } from '../types';

export const useRestaurantData = (partnerId?: string) => {
  const [restaurant, setRestaurant] = useState<RestaurantPartner | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchMenuData() {
      try {
        setIsLoading(true);

        // 1. جلب أول مطعم إذا لم يتم تمرير partnerId
        let currentPartnerId = partnerId;

        if (!currentPartnerId) {
          const { data: firstPartner, error: partnerErr } = await supabase
            .from('partners')
            .select('*')
            .limit(1)
            .maybeSingle();

          if (partnerErr) console.error('Error fetching partner:', partnerErr);
          if (firstPartner) {
            currentPartnerId = firstPartner.id;
            if (isMounted) setRestaurant(firstPartner as RestaurantPartner);
          }
        } else {
          const { data: partnerData } = await supabase
            .from('partners')
            .select('*')
            .eq('id', currentPartnerId)
            .maybeSingle();

          if (partnerData && isMounted) setRestaurant(partnerData as RestaurantPartner);
        }

        // 2. جلب التصنيفات المرتبطة وقراءتها بـ sort_order أو created_at
        const { data: catData, error: catErr } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });

        if (catErr) console.error('Error fetching categories:', catErr);

        if (catData && catData.length > 0 && isMounted) {
          setCategories([
            { id: 'all', name: 'الكل', name_fr: 'Tout' },
            ...catData,
          ]);
        }

        // 3. جلب الوجبات الـ 31 الحقيقية مرتبة بـ display_order
        let query = supabase.from('menu_items').select('*').order('display_order', { ascending: true });

        if (currentPartnerId) {
          query = query.eq('partner_id', currentPartnerId);
        }

        const { data: itemsData, error: itemsErr } = await query;

        if (itemsErr) {
          console.error('Error fetching menu items:', itemsErr);
          // تجربة استعلام عام بدون فلترة المطعم في حال لم تكن الوجبات مرتبطة بـ partner_id المتردد
          const { data: allItems } = await supabase.from('menu_items').select('*').order('display_order', { ascending: true });
          if (allItems && isMounted) {
            setMenuItems(allItems as MenuItem[]);
          }
        } else if (itemsData && itemsData.length > 0 && isMounted) {
          setMenuItems(itemsData as MenuItem[]);
        }

      } catch (err) {
        console.error('Unexpected error in useRestaurantData:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchMenuData();

    return () => { isMounted = false; };
  }, [partnerId]);

  return { restaurant, categories, menuItems, isLoading };
};
