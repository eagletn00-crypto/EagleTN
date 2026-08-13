import { create } from 'zustand';
import { Restaurant, Partner } from '../types/schema';
import { partnerService } from '../services/partnerService';

interface RestaurantState {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  isLoading: boolean;
  error: string | null;
  fetchRestaurants: () => Promise<void>;
  selectRestaurant: (restaurant: Restaurant | null) => void;
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurants: [],
  selectedRestaurant: null,
  isLoading: false,
  error: null,
  fetchRestaurants: async () => {
    set({ isLoading: true, error: null });
    try {
      const data: Partner[] = await partnerService.getActivePartners();
      set({ restaurants: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch restaurants', isLoading: false });
    }
  },
  selectRestaurant: (restaurant) => set({ selectedRestaurant: restaurant })
}));
