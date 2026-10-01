import { create } from 'zustand';
import { MenuItem, OrderItem } from '../types';

interface CartState {
  items: OrderItem[];
  addItem: (item: MenuItem | OrderItem) => void;
  addToCart: (item: MenuItem | OrderItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const itemId = item.id || (item as any).item_id || Math.random().toString();
      const itemName = item.name || (item as any).name_fr || (item as any).name_ar || 'Article';
      const existing = state.items.find((i) => i.id === itemId);

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { id: itemId, name: itemName, price: item.price || 0, quantity: 1 },
        ],
      };
    }),
  addToCart: (item) =>
    set((state) => {
      const itemId = item.id || (item as any).item_id || Math.random().toString();
      const itemName = item.name || (item as any).name_fr || (item as any).name_ar || 'Article';
      const existing = state.items.find((i) => i.id === itemId);

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { id: itemId, name: itemName, price: item.price || 0, quantity: 1 },
        ],
      };
    }),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  updateQuantity: (id, delta) =>
    set((state) => ({
      items: state.items
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0),
    })),
  clearCart: () => set({ items: [] }),
}));
