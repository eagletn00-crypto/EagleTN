import { create } from 'zustand';

interface AdminState {
  chiffreAffaires: number;
  pendingCash: number;
  cashInCirculation: number;
  flushFinancialBuffer: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  chiffreAffaires: 0,
  pendingCash: 0,
  cashInCirculation: 0,
  flushFinancialBuffer: () => set({ pendingCash: 0 }),
}));
