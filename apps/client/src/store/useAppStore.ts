import { create } from 'zustand';
import { Partner } from '../types/partner';
import { Order } from '../types/order';

export type ScreenType = 
  | 'SPLASH' 
  | 'HOME' 
  | 'RESTAURANT_MENU' 
  | 'CHECKOUT' 
  | 'ORDER_TRACKING' 
  | 'PROFILE';

export type TabType = 'home' | 'accueil' | 'search' | 'recherche' | 'profile' | 'profil' | 'orders' | 'commandes';

export interface CartItem {
  id: string;
  menu_item_id?: string;
  name: string;
  price: number;
  quantity: number;
  unit_price?: number;
  total_price?: number;
}

interface AppState {
  currentScreen: ScreenType;
  activeTab: TabType;
  partners: Partner[];
  selectedPartner: Partner | null;
  cartItems: CartItem[];
  currentOrder: Order | null;
  customerAddress: string;
  isSupportOpen: boolean;

  setCurrentScreen: (screen: ScreenType) => void;
  setActiveTab: (tab: TabType) => void;
  setPartners: (partners: Partner[]) => void;
  setSelectedPartner: (partner: Partner | null) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  selectPartnerWithIsolation: (partner: Partner) => boolean;
  setCurrentOrder: (order: Order | null) => void;
  setCustomerAddress: (address: string) => void;
  setIsSupportOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentScreen: 'SPLASH',
  activeTab: 'home',
  partners: [],
  selectedPartner: null,
  cartItems: [],
  currentOrder: null,
  customerAddress: 'Tunis, Tunisie',
  isSupportOpen: false,

  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setPartners: (partners) => set({ partners }),
  setSelectedPartner: (partner) => set({ selectedPartner: partner }),

  addToCart: (item) => {
    const { cartItems } = get();
    const existingIndex = cartItems.findIndex((i) => i.id === item.id);
    if (existingIndex > -1) {
      const updated = [...cartItems];
      const newQty = updated[existingIndex].quantity + (item.quantity || 1);
      const unitPrice = item.unit_price || item.price;
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        total_price: Number((newQty * unitPrice).toFixed(3)),
      };
      set({ cartItems: updated });
    } else {
      const unitPrice = item.unit_price || item.price;
      const qty = item.quantity || 1;
      set({
        cartItems: [
          ...cartItems,
          {
            ...item,
            quantity: qty,
            unit_price: unitPrice,
            total_price: Number((qty * unitPrice).toFixed(3)),
          },
        ],
      });
    }
  },

  removeFromCart: (itemId) => {
    const { cartItems } = get();
    const existing = cartItems.find((i) => i.id === itemId);
    if (!existing) return;

    if (existing.quantity > 1) {
      const unitPrice = existing.unit_price || existing.price;
      set({
        cartItems: cartItems.map((i) =>
          i.id === itemId
            ? {
                ...i,
                quantity: i.quantity - 1,
                total_price: Number(((i.quantity - 1) * unitPrice).toFixed(3)),
              }
            : i
        ),
      });
    } else {
      set({ cartItems: cartItems.filter((i) => i.id !== itemId) });
    }
  },

  clearCart: () => set({ cartItems: [] }),

  selectPartnerWithIsolation: (partner) => {
    const { selectedPartner, cartItems } = get();
    if (selectedPartner && selectedPartner.id !== partner.id && cartItems.length > 0) {
      return false;
    }
    set({ selectedPartner: partner, currentScreen: 'RESTAURANT_MENU' });
    return true;
  },

  setCurrentOrder: (order) => set({ currentOrder: order }),
  setCustomerAddress: (customerAddress) => set({ customerAddress }),
  setIsSupportOpen: (isSupportOpen) => set({ isSupportOpen }),
}));

export default useAppStore;
