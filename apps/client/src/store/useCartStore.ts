import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem } from '../types';

export interface CartItem {
  id?: string;
  menu_item: MenuItem;
  quantity: number;
  customizations: Record<string, any>;
}

interface CartState {
  partnerId: string | null;
  items: CartItem[];
  addItem: (partnerId: string, item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      partnerId: null,
      items: [],

      addItem: (partnerId, newItem) => {
        const currentPartnerId = get().partnerId;
        const items = get().items;

        if (currentPartnerId && currentPartnerId !== partnerId) {
          set({
            partnerId,
            items: [{ id: `${newItem.id}-${Date.now()}`, menu_item: newItem, quantity: 1, customizations: {} }],
          });
          return;
        }

        const existingIndex = items.findIndex((i) => i.menu_item.id === newItem.id);
        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += 1;
          set({ partnerId, items: updated });
        } else {
          set({
            partnerId,
            items: [...items, { id: `${newItem.id}-${Date.now()}`, menu_item: newItem, quantity: 1, customizations: {} }],
          });
        }
      },

      removeItem: (id) => {
        const updated = get().items.filter((i) => i.menu_item.id !== id && i.id !== id);
        set({
          items: updated,
          partnerId: updated.length === 0 ? null : get().partnerId,
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        const updated = get().items.map((i) =>
          i.menu_item.id === id || i.id === id ? { ...i, quantity } : i
        );
        set({ items: updated });
      },

      clearCart: () => set({ partnerId: null, items: [] }),

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.menu_item.price * item.quantity, 0);
      },
    }),
    {
      name: 'eagle-tn-cart',
    }
  )
);
