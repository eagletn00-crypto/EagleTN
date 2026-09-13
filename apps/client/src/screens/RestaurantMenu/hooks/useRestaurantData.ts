import { useState, useEffect } from 'react';
import { partnerService, Partner, Category, MenuItem } from '../../../services/partnerService';

export function useRestaurantData(partnerId: string) {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!partnerId) return;

    setLoading(true);
    partnerService.getPartnerDetailsWithMenu(partnerId)
      .then((data: { partner: Partner; categories: Category[]; items: MenuItem[] }) => {
        setPartner(data.partner);
        setCategories(data.categories);
        setItems(data.items);
        setError(null);
      })
      .catch((err: Error) => {
        console.error('Error fetching restaurant data:', err);
        setError(err.message || 'Failed to load restaurant menu');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [partnerId]);

  return { partner, categories, items, loading, error };
}
