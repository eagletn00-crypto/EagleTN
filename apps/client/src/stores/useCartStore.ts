import { create } from 'zustand';

export type TndAmount = number;

export interface CartItem {
  id: number;
  name: string;
  priceTnd: TndAmount;
  quantity: number;
  description?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  getTotal: () => TndAmount;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((current) => current.id === item.id);
      if (existing) {
        return {
          items: state.items.map((current) =>
            current.id === item.id
              ? { ...current, quantity: current.quantity + 1 }
              : current
          ),
        };
      }

      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ items: [] }),

  getTotal: () =>
    get().items.reduce((sum, item) => sum + item.priceTnd * item.quantity, 0),

  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
