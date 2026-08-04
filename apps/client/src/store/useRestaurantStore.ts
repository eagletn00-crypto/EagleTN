import { create } from 'zustand';
import { Partner, Category } from '../types';

interface RestaurantStore {
  partners: Partner[];
  categories: Category[];
  selectedCategory: string | null;
  activeCategoryFilter: string | null;
  searchQuery: string;
  setPartners: (partners: Partner[]) => void;
  setSelectedCategory: (category: string | null) => void;
  setActiveCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  partners: [],
  categories: [],
  selectedCategory: null,
  activeCategoryFilter: null,
  searchQuery: '',
  setPartners: (partners) => set({ partners }),
  setSelectedCategory: (category) => set({ selectedCategory: category, activeCategoryFilter: category }),
  setActiveCategory: (category) => set({ activeCategoryFilter: category, selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
