import { useState, useEffect } from 'react';
import { partnerService } from '../../../services/partnerService';
import { Partner, Category, MenuItem } from '../../../types/partner';

export const useRestaurantData = (partnerId: string) => {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await partnerService.getPartnerDetailsWithMenu(partnerId);
      setPartner(data.partner);
      setCategories(data.categories);
      setItems(data.items);
      setLoading(false);
    }
    loadData();
  }, [partnerId]);

  return { partner, categories, items, loading };
};
