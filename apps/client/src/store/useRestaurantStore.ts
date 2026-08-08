import { create } from 'zustand';
import { Partner } from '../types';

export type { Partner };

interface RestaurantStore {
  partners: Partner[];
  activeCategoryFilter: string | null;
  isLoading: boolean;
  error: string | null;
  setActiveCategory: (category: string | null) => void;
  fetchPartners: () => void;
}

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  partners: [
    {
      id: 'chez-am-ali',
      name: 'Chez Am Ali',
      name_fr: 'Chez Am Ali (Cité Ibn Khaldoun)',
      rating: 4.9,
      reviewsCount: 142,
      time: '20-30 min',
      fee: '2.000 DT',
      isOpen: true,
      isAvailable: true,
      tag: 'ROI DU HERGMA',
      isRoyalBadge: true,
      image: '/eagle-bg.png'
    },
    {
      id: 'plan-b',
      name: 'Plan B Tunis',
      name_fr: 'Plan B',
      rating: 4.7,
      reviewsCount: 310,
      time: '15-25 min',
      fee: '1.500 DT',
      isOpen: true,
      isAvailable: true,
      tag: 'BAGUETTE FARCIE',
      isRoyalBadge: false,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800'
    }
  ],
  activeCategoryFilter: null,
  isLoading: false,
  error: null,
  setActiveCategory: (category) => set({ activeCategoryFilter: category }),
  fetchPartners: () => {},
}));
