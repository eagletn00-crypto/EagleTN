import { create } from 'zustand';
import { supabase } from './supabaseClient';

export interface Order {
  id: string;
  partner_id?: string;
  client_name?: string;
  client_phone?: string;
  total_amount?: number;
  delivery_fee?: number;
  status: string;
  verification_code?: string;
  created_at: string;
  updated_at?: string;
  order_items?: any[];
  delivery_address?: string;
}

interface PartnerState {
  ordersMap: Record<string, Order>;
  isLoading: boolean;
  activeTab: 'orders' | 'wallet' | 'menu' | 'store' | 'settings';
  setActiveTab: (tab: 'orders' | 'wallet' | 'menu' | 'store' | 'settings') => void;
  fetchInitialOrders: () => Promise<void>;
  upsertOrder: (order: Order) => void;
  removeOrder: (orderId: string) => void;
  subscribeToRealtime: () => () => void;
  playNotificationSound: () => void;
}

const playAudioAlert = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.error('Audio error:', e);
  }
};

export const usePartnerStore = create<PartnerState>((set, get) => ({
  ordersMap: {},
  isLoading: false,
  activeTab: 'orders',

  setActiveTab: (tab) => set({ activeTab: tab }),

  playNotificationSound: () => {
    playAudioAlert();
  },

  upsertOrder: (incomingOrder) => {
    set((state) => ({
      ordersMap: {
        ...state.ordersMap,
        [incomingOrder.id]: {
          ...(state.ordersMap[incomingOrder.id] || {}),
          ...incomingOrder
        }
      }
    }));
  },

  removeOrder: (orderId) => {
    set((state) => {
      const updatedMap = { ...state.ordersMap };
      delete updatedMap[orderId];
      return { ordersMap: updatedMap };
    });
  },

  fetchInitialOrders: async () => {
    set({ isLoading: true });
    try {
      // جلب جميع الطلبات دون تصفية لمعاينة كافة السجلات المتوفرة
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      console.log('SUPABASE ORDERS FETCHED:', data, 'ERROR:', error);

      if (error) {
        console.error('Error fetching orders:', error);
      } else if (data) {
        const initialMap: Record<string, Order> = {};
        data.forEach((ord: Order) => {
          initialMap[ord.id] = ord;
        });
        set({ ordersMap: initialMap });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  subscribeToRealtime: () => {
    get().fetchInitialOrders();

    const channel = supabase
      .channel('partner-global-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('REALTIME EVENT RECEIVED:', payload);
          if (payload.eventType === 'DELETE') {
            get().removeOrder(payload.old.id);
          } else if (payload.new) {
            get().upsertOrder(payload.new as Order);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}));
