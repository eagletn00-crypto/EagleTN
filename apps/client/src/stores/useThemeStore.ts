import { create } from 'zustand';

interface ThemeState {
  accentColor: 'amber' | 'slate';
  isPremiumMode: boolean;
  setAccentColor: (color: 'amber' | 'slate') => void;
  togglePremiumMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  accentColor: 'amber',
  isPremiumMode: true,
  setAccentColor: (color) => set({ accentColor: color }),
  togglePremiumMode: () => set((state) => ({ isPremiumMode: !state.isPremiumMode })),
}));
