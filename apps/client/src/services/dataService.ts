import { supabase } from '../lib/supabase';
import { Partner, Category, MenuItem } from '../types';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });

      if (error || !data || data.length === 0) {
        return [
          { id: '1', name: 'RESTAURANTS', slug: 'restaurants' },
          { id: '2', name: 'PÂTISSERIE', slug: 'patisserie' },
          { id: '3', name: 'MODE & SHOPPING', slug: 'mode' },
          { id: '4', name: 'COSMÉTIQUE', slug: 'cosmetique' },
        ];
      }
      return data;
    } catch (e) {
      console.warn('Supabase fetch fallback for categories:', e);
      return [
        { id: '1', name: 'RESTAURANTS', slug: 'restaurants' },
        { id: '2', name: 'PÂTISSERIE', slug: 'patisserie' },
        { id: '3', name: 'MODE & SHOPPING', slug: 'mode' },
        { id: '4', name: 'COSMÉTIQUE', slug: 'cosmetique' },
      ];
    }
  }
};

export const partnerService = {
  async getAll(): Promise<Partner[]> {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*');

      if (error || !data || data.length === 0) {
        return [
          {
            id: 'p1',
            name: 'Chez Om Ali (عند عم علي)',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
            rating: 4.8,
            deliveryTime: '15-25 min',
            deliveryFee: 2.500,
            address: 'Avenue Habib Bourguiba, Tunis',
            category: 'RESTAURANTS'
          },
          {
            id: 'p2',
            name: 'Roi du Hergma',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
            rating: 4.9,
            deliveryTime: '20-30 min',
            deliveryFee: 2.000,
            address: 'Avenue Habib Bourguiba, Tunis',
            category: 'RESTAURANTS'
          }
        ];
      }
      return data;
    } catch (e) {
      console.warn('Supabase fetch fallback for partners:', e);
      return [
        {
          id: 'p1',
          name: 'Chez Om Ali (عند عم علي)',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
          rating: 4.8,
          deliveryTime: '15-25 min',
          deliveryFee: 2.500,
          address: 'Avenue Habib Bourguiba, Tunis',
          category: 'RESTAURANTS'
        }
      ];
    }
  }
};
