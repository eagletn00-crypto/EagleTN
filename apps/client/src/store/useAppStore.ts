import { create } from 'zustand';
import { Partner } from '../types/partner';
import { Order } from '../types/order';
import { MenuItem } from '../types';

export type ScreenType = 'SPLASH' | 'HOME' | 'RESTAURANT_MENU' | 'CHECKOUT' | 'ORDER_TRACKING' | 'PROFILE';
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
  
  addToCart: (item: CartItem | MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (id: string, delta: number) => void;
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
    const itemId = item.id; 
    if (!itemId) {
       console.error("🚨 Item must have an ID to be added to cart");
       return;
    }

    const existingIndex = cartItems.findIndex((i) => i.id === itemId);
    const itemName = item.name || (item as any).name_fr || 'Article';
    const unitPrice = (item as any).unit_price || item.price || 0;
    const addQty = (item as any).quantity || 1;

    if (existingIndex > -1) {
      const updated = [...cartItems];
      const newQty = updated[existingIndex].quantity + addQty;
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        total_price: Number((newQty * unitPrice).toFixed(3)),
      };
      set({ cartItems: updated });
    } else {
      set({
        cartItems: [
          ...cartItems,
          {
            id: itemId,
            name: itemName,
            price: item.price,
            quantity: addQty,
            unit_price: unitPrice,
            total_price: Number((addQty * unitPrice).toFixed(3)),
            menu_item_id: (item as any).menu_item_id || itemId,
          },
        ],
      });
    }
  },

  removeFromCart: (itemId) => {
     const { cartItems } = get();
     set({ cartItems: cartItems.filter((i) => i.id !== itemId) });
  },

  updateQuantity: (id, delta) => {
    const { cartItems } = get();
    set({
      cartItems: cartItems
        .map((i) => {
          if (i.id === id) {
             const newQty = i.quantity + delta;
             const unitPrice = i.unit_price || i.price;
             return {
                 ...i,
                 quantity: newQty,
                 total_price: Number((newQty * unitPrice).toFixed(3))
             };
          }
          return i;
        })
        .filter((i) => i.quantity > 0),
    });
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
  setCustomerAddress: (address) => set({ customerAddress: address }),
  setIsSupportOpen: (isOpen) => set({ isSupportOpen: isOpen }),
}));

export default useAppStore;
