import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { normalizePartner } from '../utils/mappers';

export const usePartners = (filters?: any) => {
  return useQuery({
    queryKey: ['partners_list', filters],
    queryFn: async () => {
      // جلب المطاعم النشطة فقط من الجدول المباشر
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('status', 'active');
        
      if (error) {
        console.error("🚨 Error fetching partners:", error);
        throw new Error('Erreur lors du chargement des partenaires');
      }
      
      return (data || []).map(normalizePartner);
    },
    // إجبار التطبيق على جلب بيانات جديدة فوراً (إلغاء الكاش مؤقتاً للتطوير)
    staleTime: 0, 
    refetchOnMount: true,
  });
};
