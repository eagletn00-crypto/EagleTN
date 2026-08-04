import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export interface PartnerData {
  id: string;
  name: string;
  cover_url?: string;
  logo_url?: string;
  rating?: number;
  opening_time?: string;
  closing_time?: string;
  delivery_time_min?: number;
  delivery_time_max?: number;
  is_open?: boolean;
}

export function useRestaurantData(partnerId?: string) {
  const [partner, setPartner] = useState<PartnerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPartner() {
      try {
        setLoading(true);
        let query = supabase.from('partners').select('*');

        if (partnerId) {
          query = query.eq('id', partnerId);
        }

        const { data, error } = await query.limit(1).maybeSingle();

        if (error) throw error;
        setPartner(data);
      } catch (err) {
        console.error('Error fetching partner data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPartner();
  }, [partnerId]);

  return { partner, loading };
}
