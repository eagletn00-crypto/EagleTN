import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface LivreurState {
  orders: any[];
  loading: boolean;
  isOnline: boolean;
  cashLimit: number;
  fetchOrders: () => Promise<void>;
  acceptOrder: (orderId: string) => Promise<void>;
  deliverOrder: (orderId: string) => Promise<void>;
  setOnlineStatus: (status: boolean) => void;
  setupRealtimeSync: () => void;
}

export const useLivreurStore = create<LivreurState>((set, get) => ({
  orders: [],
  loading: true,
  isOnline: navigator.onLine,
  cashLimit: 150.0,

  setOnlineStatus: (status) => set({ isOnline: status }),

  fetchOrders: async () => {
    try {
      set({ loading: true });
      const myDriverId = 'temp-driver-1'; 
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`and(status.eq.ready_for_pickup,livreur_id.is.null),livreur_id.eq.${myDriverId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOrders = (data || []).map(o => ({
        id: o.id,
        short_code: o.id.split('-')[0].substring(0, 8).toUpperCase(),
        restaurantName: `Partenaire ${o.partner_id?.substring(0,4) || ''}`,
        deliveryAddress: o.delivery_address || "Adresse Client",
        clientName: o.client_name || "Client", 
        clientPhone: o.client_phone || "20000000",
        deliveryFee: 3.500,
        totalAmount: o.total_amount || 0,
        status: o.status,
        pickupCoords: { lat: 36.8, lng: 10.18 },
        dropoffCoords: { lat: 36.81, lng: 10.19 }
      }));

      set({ orders: formattedOrders });
    } catch (error) {
      console.error("[EAGLE TN] Erreur fetch:", error);
    } finally {
      set({ loading: false });
    }
  },

  acceptOrder: async (orderId: string) => {
    const { orders, cashLimit } = get();
    const cashInHand = orders
      .filter(o => o.status !== 'delivered' && o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    if (cashInHand >= cashLimit) {
      alert("⚠️ Plafond de caisse atteint. Versement requis.");
      return;
    }

    try {
      const myDriverId = 'temp-driver-1';
      const { error } = await supabase
        .from('orders')
        .update({ status: 'on_the_way', livreur_id: myDriverId, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .is('livreur_id', null);

      if (error) throw error;
      
      set({ orders: get().orders.map(o => o.id === orderId ? { ...o, status: 'on_the_way' } : o) });
    } catch (err) {
      console.error("Échec d'acceptation:", err);
      alert("Erreur: Mission déjà acceptée.");
    }
  },

  deliverOrder: async (orderId: string) => {
    if (!get().isOnline) {
      // Offline Logic here (Queue mechanism)
      console.warn("Mode hors-ligne: Mise en attente de la livraison.");
    }
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'delivered', updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      set({ orders: get().orders.map(o => o.id === orderId ? { ...o, status: 'delivered' } : o) });
    } catch (err) {
      console.error("Échec livraison:", err);
    }
  },

  setupRealtimeSync: () => {
    const subscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        get().fetchOrders();
      })
      .subscribe();
      
    return () => supabase.removeChannel(subscription);
  }
}));
