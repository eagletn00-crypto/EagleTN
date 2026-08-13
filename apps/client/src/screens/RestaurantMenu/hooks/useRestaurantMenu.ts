import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function useRestaurantMenu() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchMenuData() {
      try {
        setLoading(true);
        const mockRestaurant = {
          id: id || '1',
          name: 'Chez Am Ali',
          name_ar: 'عند عم علي',
          image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop'
        };

        const mockCategories = [
          { category_id: '1', category_name_fr: 'PLATS', label: 'Plats' },
          { category_id: '2', category_name_fr: 'SANDWICHS', label: 'Sandwichs' },
          { category_id: '3', category_name_fr: 'BOISSONS', label: 'Boissons' }
        ];

        const mockItems = [
          {
            item_id: '101',
            category_id: '1',
            item_name_fr: 'Pâtes Poulet',
            item_name_ar: 'مقرونة دجاج',
            description_fr: 'Pâtes tunisiennes à la sauce tomate épicée et morceau de poulet.',
            base_price: 10.000,
            image_url: ''
          },
          {
            item_id: '102',
            category_id: '1',
            item_name_fr: 'Ojja Crevettes',
            item_name_ar: 'عجة شفرات',
            description_fr: 'Ojja tunisienne aux crevettes fraîches, œufs et sauce tomate.',
            base_price: 14.000,
            image_url: ''
          },
          {
            item_id: '103',
            category_id: '3',
            item_name_fr: 'Eau Minérale 1.5L',
            item_name_ar: 'ماء كبير',
            description_fr: 'Boisson rafraîchissante.',
            base_price: 1.500,
            image_url: ''
          }
        ];

        if (isMounted) {
          setRestaurant(mockRestaurant);
          setCategories(mockCategories);
          setMenuItems(mockItems);
        }
      } catch (err) {
        console.error("Error loading menu:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchMenuData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { restaurant, categories, menuItems, loading };
}
