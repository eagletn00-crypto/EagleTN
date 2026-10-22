import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '../../../../packages/database/src/supabase';

interface UsePartnersParams {
  categoryId: string | null;
}

export interface MappedPartner {
  id: string;
  name: string;
  imageUrl?: string;
  rating?: number;
  reviewsCount?: number;
  deliveryTime?: string;
  deliveryFee?: string;
  isOpen?: boolean;
}

export const usePartners = ({ categoryId }: UsePartnersParams) => {
  return useInfiniteQuery({
    queryKey: ['partners', categoryId],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const limit = 10;
      const from = pageParam * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('partners')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category', categoryId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('🚨 [usePartners] Erreur Supabase:', error.message);
        throw new Error(error.message);
      }

      const mappedPartners: MappedPartner[] = (data || []).map((partner: any) => ({
        id: partner.id,
        name: partner.name,
        imageUrl: partner.image_url,
        rating: partner.rating,
        reviewsCount: partner.reviews_count || 0,
        deliveryTime: partner.delivery_time || "20-30 min",
        deliveryFee: partner.delivery_fee,
        isOpen: partner.is_open
      }));

      return {
        data: mappedPartners,
        nextPage: mappedPartners.length === limit ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
