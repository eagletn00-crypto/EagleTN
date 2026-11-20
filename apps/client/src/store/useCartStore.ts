import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Json } from '@eagletn/types';

export interface CartItemPayload {
  cartItemId: string;
  item_id: string; // Strictly aligns with MenuItem.id
  merchantId: string;
  name: string; // Strictly mapped from MenuItem.name
  price: number; // Strictly mapped from MenuItem.price
  quantity: number;
  options: Json; // Fully compatible with OrderItem options
  image_url?: string | null;
  notes?: string;
}

interface CartState {
  items: CartItemPayload[];
  promoCode: string | null;
  deliveryAddress: string | null;
  addItem: (item: Omit<CartItemPayload, 'cartItemId'>) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  setPromoCode: (code: string | null) => void;
  setAddress: (address: string | null) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      deliveryAddress: null,
      addItem: (item) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (i) => i.item_id === item.item_id && JSON.stringify(i.options) === JSON.stringify(item.options)
        );

        if (existingItemIndex > -1) {
          const newItems = [...items];
          newItems[existingItemIndex].quantity += item.quantity;
          set({ items: newItems });
        } else {
          const generateUUID = () => {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          };
          set({ items: [...items, { ...item, cartItemId: generateUUID() }] });
        }
      },
      updateQuantity: (cartItemId, delta) => {
        set({
          items: get().items.map((i) => {
            if (i.cartItemId === cartItemId) {
              const newQuantity = Math.max(1, i.quantity + delta);
              return { ...i, quantity: newQuantity };
            }
            return i;
          }),
        });
      },
      removeItem: (cartItemId) => {
        set({ items: get().items.filter((i) => i.cartItemId !== cartItemId) });
      },
      setPromoCode: (code) => set({ promoCode: code }),
      setAddress: (address) => set({ deliveryAddress: address }),
      clearCart: () => set({ items: [], promoCode: null }),
    }),
    {
      name: 'eagle-tn-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
