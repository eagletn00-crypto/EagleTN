import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Category } from '@eagletn/types';

// Strict Local Interfaces to bypass Supabase 'never' inference
interface DbPartnerRow {
  category?: string | null;
  status?: string | null;
}

interface DbCategoryRow {
  name?: string | null;
  cover_image_url?: string | null;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data: dbCats } = await supabase.from('categories').select('*');
      const { data: partnerData, error: pError } = await supabase
        .from('partners')
        .select('category, status');
        
      if (pError) throw new Error(pError.message);

      const counts: Record<string, number> = {
        'Restaurant': 0, 'Pâtisserie': 0, 'Shopping': 0, 'Cosmétique': 0, 'Boutique': 0
      };
      
      // Safe Cast to Local Interface
      const partners = (partnerData || []) as DbPartnerRow[];
      
      partners.forEach(p => {
        if (p.status === 'active' || p.status === 'open') {
          const cat = String(p.category || '').toLowerCase();
          if (cat.includes('patisserie') || cat.includes('gâteau') || cat.includes('sucre')) counts['Pâtisserie']++;
          else if (cat.includes('shopping') || cat.includes('course') || cat.includes('epicerie')) counts['Shopping']++;
          else if (cat.includes('cosmetique') || cat.includes('beaute') || cat.includes('soin')) counts['Cosmétique']++;
          else if (cat.includes('boutique') || cat.includes('mode') || cat.includes('cadeau')) counts['Boutique']++;
          else counts['Restaurant']++; 
        }
      });

      const CORE_UNIVERSES = [
        { id: 'restaurant', name: 'Restaurant', coverImageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80' },
        { id: 'patisserie', name: 'Pâtisserie', coverImageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80' },
        { id: 'shopping', name: 'Shopping', coverImageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80' },
        { id: 'cosmetique', name: 'Cosmétique', coverImageUrl: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&w=600&q=80' },
        { id: 'boutique', name: 'Boutique', coverImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80' }
      ];

      // Safe Cast to Local Interface
      const categoriesData = (dbCats || []) as DbCategoryRow[];

      return CORE_UNIVERSES.map(core => {
        const dbMatch = categoriesData.find(c => c.name?.toLowerCase() === core.name.toLowerCase());
        return {
          ...core,
          localLabel: core.name, // Expand based on locales if needed
          coverImageUrl: dbMatch?.cover_image_url || core.coverImageUrl,
          merchantCount: counts[core.name] || 0
        };
      }) as Category[];
    },
    staleTime: 1000 * 60 * 15,
  });
};
