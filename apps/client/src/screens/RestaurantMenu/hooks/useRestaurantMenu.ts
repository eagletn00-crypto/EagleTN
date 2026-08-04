import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

// دالة للتحقق مما إذا كان النص عبارة عن UUID صالح
function isValidUUID(uuidStr?: string) {
  if (!uuidStr) return false;
  const regexExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[0-89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regexExp.test(uuidStr);
}

export function useRestaurantMenu(partnerId?: string) {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        setError(null);

        let targetUuid = partnerId;

        // إذا كان partnerId ممرر ولكن ليس صيغة UUID (مثل "am-ali")
        if (partnerId && !isValidUUID(partnerId)) {
          // جلب الـ UUID الحقيقي من جدول الشركاء عبر الـ slug أو الـ id
          const { data: partnerData } = await supabase
            .from('partners')
            .select('id')
            .or(`slug.eq.${partnerId},id.eq.${partnerId}`)
            .maybeSingle();

          if (partnerData?.id && isValidUUID(partnerData.id)) {
            targetUuid = partnerData.id;
          } else {
            // إذا لم نجد الشريك بهذا الاسم، نلغي الفلترة لتجنب الخطأ
            targetUuid = undefined;
          }
        }

        // 1. Fetch Categories
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*');

        if (catError) throw catError;

        // 2. Fetch Menu Items
        let query = supabase.from('menu_items').select('*');
        if (targetUuid && isValidUUID(targetUuid)) {
          query = query.eq('partner_id', targetUuid);
        }

        const { data: itemsData, error: itemsError } = await query;
        if (itemsError) throw itemsError;

        const fetchedItems = itemsData || [];

        // حساب عدد الأطباق لكل تصنيف
        const categoryMap: { [key: string]: number } = {};
        fetchedItems.forEach((item) => {
          if (item.category_id) {
            categoryMap[item.category_id] = (categoryMap[item.category_id] || 0) + 1;
          }
        });

        // تشكيل قائمة التصنيفات
        const formattedCategories = [
          { id: 'all', name: 'Tous', count: fetchedItems.length },
          ...(catData || []).map((cat) => ({
            id: cat.id,
            name: cat.name_fr || cat.name_ar || cat.title || 'Catégorie',
            count: categoryMap[cat.id] || 0,
          })),
        ];

        setCategories(formattedCategories);

        // الفلترة حسب التصنيف والبحث
        let filtered = fetchedItems;
        if (selectedCategoryId !== 'all') {
          filtered = filtered.filter((i) => i.category_id === selectedCategoryId);
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (i) =>
              (i.name_fr && i.name_fr.toLowerCase().includes(q)) ||
              (i.name && i.name.toLowerCase().includes(q)) ||
              (i.name_ar && i.name_ar.includes(q))
          );
        }

        setMenuItems(filtered);
      } catch (err: any) {
        console.error('Error fetching menu:', err);
        setError(err.message || 'Impossible de charger le menu');
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, [partnerId, selectedCategoryId, searchQuery]);

  return {
    menuItems,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    loading,
    error,
  };
}
