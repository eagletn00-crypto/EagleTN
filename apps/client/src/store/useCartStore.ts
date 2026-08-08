import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartOption {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  name_fr?: string;
  price: number;
  totalUnitPrice?: number;
  quantity: number;
  partnerId?: string;
  instructions?: string;
  options?: CartOption[];
}

interface AddItemResult {
  success: boolean;
  message?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (
    item: Omit<CartItem, 'quantity'>,
    quantity?: number,
    options?: CartOption[],
    partnerId?: string
  ) => AddItemResult;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1, options = [], partnerId) => {
        const state = get();
        const effectivePartnerId = partnerId || item.partnerId;

        // Check if mixing items from different partners
        if (
          effectivePartnerId &&
          state.items.length > 0 &&
          state.items.some((i) => i.partnerId && i.partnerId !== effectivePartnerId)
        ) {
          return {
            success: false,
            message: 'لا يمكن دمج مطاعم مختلفة في نفس السلة',
          };
        }

        const calculatedUnitPrice =
          item.totalUnitPrice ?? (item.price + options.reduce((sum, opt) => sum + opt.price, 0));
        const itemId = item.id;
        const existingIndex = state.items.findIndex((i) => i.id === itemId);

        if (existingIndex > -1) {
          const updatedItems = [...state.items];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          set({
            items: [
              ...state.items,
              {
                ...item,
                partnerId: effectivePartnerId,
                totalUnitPrice: calculatedUnitPrice,
                quantity,
                options,
              },
            ],
          });
        }

        return { success: true };
      },
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, delta) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
            .filter((i) => i.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
      getSubtotal: () =>
        get().items.reduce((acc, item) => acc + (item.totalUnitPrice || item.price) * item.quantity, 0),
    }),
    {
      name: 'eagle-tn-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
