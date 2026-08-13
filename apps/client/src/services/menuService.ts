import { supabase } from '../lib/supabase';
import { Category, MenuItemWithCategory } from '../types';

export const menuService = {
  /**
   * جلب كافة التصنيفات المتاحة
   */
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name_fr')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return (data || []).map((cat) => ({
      id: cat.id,
      nameFr: cat.name_fr,
    }));
  },

  /**
   * جلب كافة الأطباق مع إمكانية التصفية بحسب التصنيف
   */
  async getMenuItems(categoryId?: string): Promise<MenuItemWithCategory[]> {
    let query = supabase
      .from('menu_items')
      .select('id, category_id, name_ar, name_fr, description_ar, description_fr, price, img_url, is_available')
      .eq('is_available', true);

    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }

    return (data || []).map((item) => ({
      id: item.id,
      categoryId: item.category_id,
      nameAr: item.name_ar,
      nameFr: item.name_fr,
      descriptionAr: item.description_ar,
      descriptionFr: item.description_fr,
      price: Number(item.price),
      imgUrl: item.img_url,
    }));
  },
};
