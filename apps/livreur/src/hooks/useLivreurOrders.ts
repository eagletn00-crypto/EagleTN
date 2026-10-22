import { useEffect } from 'react';
import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export interface OrderLocation {
  lat: number;
  lng: number;
}

export interface LivreurOrder {
  id: string;
  short_code: string;
  verificationCode: string;
  restaurantName: string;
  deliveryAddress: string;
  clientName: string;
  clientPhone: string;
  deliveryFee: number;
  totalAmount: number;
  status: 'ready_for_pickup' | 'on_the_way' | 'delivered' | 'cancelled';
  pickupCoords: OrderLocation;
  dropoffCoords: OrderLocation;
}

interface LivreurState {
  orders: LivreurOrder[];
  loading: boolean;
  driverId: string | null;
  isInitialized: boolean;
  initDriverSession: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  acceptOrder: (orderId: string) => Promise<void>;
  deliverOrder: (orderId: string) => Promise<void>;
  setupRealtime: () => void;
}

let realtimeChannel: any = null;

// 1. إنشاء محرك Zustand الاحترافي كمركز قيادة أحادي
const useLivreurStore = create<LivreurState>((set, get) => ({
  orders: [],
  loading: true,
  driverId: null,
  isInitialized: false,

  initDriverSession: async () => {
    if (get().isInitialized) return;
    try {
      // جلب سائق حقيقي من القاعدة لتجنب أخطاء PostgreSQL
      const { data } = await supabase.from('drivers').select('id').eq('status', 'available').limit(1).single();
      if (data) {
        set({ driverId: data.id, isInitialized: true });
        get().fetchOrders();
        get().setupRealtime();
      }
    } catch (err) {
      console.error("[EAGLE TN] Erreur init:", err);
    }
  },

  fetchOrders: async () => {
    const { driverId } = get();
    if (!driverId) return;

    try {
      set({ loading: true });
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, status, total_amount, delivery_fee, delivery_address,
          customer_name, client_name, client_phone, verification_code,
          pin_code, pickup_lat, pickup_lng, delivery_lat, delivery_lng, created_at
        `)
        .gte('created_at', last24Hours)
        .or(`status.eq.ready_for_pickup,and(driver_id.eq.${driverId},status.in.("on_the_way","delivered"))`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOrders: LivreurOrder[] = (data || []).map(o => ({
        id: o.id,
        short_code: o.id.split('-')[0].toUpperCase(),
        verificationCode: o.verification_code || o.pin_code || '0000',
        restaurantName: "Partenaire EAGLE",
        deliveryAddress: o.delivery_address || 'Adresse non spécifiée',
        clientName: o.customer_name || o.client_name || 'Client VIP',
        clientPhone: o.client_phone || '20000000',
        deliveryFee: o.delivery_fee || 2.500,
        totalAmount: o.total_amount || 0,
        status: o.status as any,
        pickupCoords: { lat: o.pickup_lat || 36.8065, lng: o.pickup_lng || 10.1815 },
        dropoffCoords: { lat: o.delivery_lat || 36.8188, lng: o.delivery_lng || 10.1658 }
      }));

      set({ orders: formattedOrders, loading: false });
    } catch (err) {
      console.error("[EAGLE TN] Erreur fetch:", err);
      set({ loading: false });
    }
  },

  setupRealtime: () => {
    if (realtimeChannel) supabase.removeChannel(realtimeChannel);
    realtimeChannel = supabase
      .channel('livreur_radar_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        get().fetchOrders();
      })
      .subscribe();
  },

  acceptOrder: async (orderId: string) => {
    const { driverId, fetchOrders } = get();
    if (!driverId) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: 'on_the_way', driver_id: driverId })
        .eq('id', orderId)
        .eq('status', 'ready_for_pickup')
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        alert("Mission déjà attribuée !");
        fetchOrders();
        return;
      }

      set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, status: 'on_the_way' } : o)
      }));
    } catch (err) {
      console.error("[EAGLE TN] Échec affectation:", err);
      fetchOrders();
    }
  },

  deliverOrder: async (orderId: string) => {
    const { driverId } = get();
    if (!driverId) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('id', orderId)
        .eq('driver_id', driverId);

      if (error) throw error;

      set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, status: 'delivered' } : o)
      }));
    } catch (err) {
      console.error("[EAGLE TN] Échec livraison:", err);
    }
  }
}));

// 2. تغليف المحرك بخطاف وهمي لضمان عمل الواجهات دون تعديلها
export function useLivreurOrders() {
  const store = useLivreurStore();
  
  useEffect(() => {
    store.initDriverSession();
  }, []);
  
  return store;
}
