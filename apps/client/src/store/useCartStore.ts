import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartOption {
  id: string;
  name: string;
  name_fr?: string;
  name_ar?: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItemId?: string;
  name: string;
  name_fr?: string;
  name_ar?: string;
  price: number;
  totalUnitPrice?: number;
  quantity: number;
  partnerId?: string;
  partner_id?: string;
  selectedOptions?: CartOption[];
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number, selectedOptions?: CartOption[]) => { success: boolean; message?: string };
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem, quantity = 1, selectedOptions = []) => {
        const currentItems = get().items;
        
        // التحقق من توافق الشريك (Partner ID) لعدم خلط منتجات مطاعم مختلفة في نفس السلة
        const incomingPartnerId = newItem.partnerId || newItem.partner_id;
        if (currentItems.length > 0) {
          const existingPartnerId = currentItems[0].partnerId || currentItems[0].partner_id;
          if (existingPartnerId && incomingPartnerId && existingPartnerId !== incomingPartnerId) {
            return { success: false, message: 'لا يمكنك طلب منتجات من مطاعم مختلفة في نفس السلة.' };
          }
        }

        const optionsTotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
        const totalUnitPrice = newItem.price + optionsTotal;

        const cartItem: CartItem = {
          ...newItem,
          quantity,
          totalUnitPrice,
          selectedOptions,
        };

        set({ items: [...currentItems, cartItem] });
        return { success: true };
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)),
        }),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, item) => sum + (item.totalUnitPrice || item.price) * item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
export type { CartStore };
