import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export interface DisputeItem {
  id: string;
  order_id?: string;
  driver_name?: string;
  rawDriverId?: string;
  reason?: string;
  status?: string;
  [key: string]: any;
}

export interface AdminState {
  // 0. Base de données en temps réel
  orders: any[]; // 👈 أضفنا مصفوفة الطلبات هنا

  // 1. Finances & Metrics
  chiffreAffaires: number;
  activeDrivers: number;
  activeOrders: number;
  activePartners: number;
  pendingCash: number;
  cashInCirculation: number;
  commissionPlateforme: number;
  partPartenaires: number;
  flushFinancialBuffer: () => void;

  // 2. Realtime Engine
  fetchDashboardMetrics: () => Promise<void>;
  setupRealtimeSubscription: () => () => void;

  // 3. Auto-Dispatch Engine
  isAutoDispatchActive: boolean;
  toggleAutoDispatch: () => void;
  runDispatchCycle: () => Promise<void>;

  // 4. Disputes
  disputes: DisputeItem[];
  freezeDriverAccount: (driverId: string, disputeId?: string) => void;
  reassignOrderAction: (orderId: string, newDriverId?: string) => void;

  // 5. Governance
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  manualMode: boolean;
  toggleManualMode: () => void;
  systemPaused: boolean;
  toggleSystemPause: () => void;
  sosAlert: boolean;
  triggerSos: (value?: boolean) => void;
}

let dispatchInterval: any = null;

export const useAdminStore = create<AdminState>((set, get) => ({
  // --- ÉTAT INITIAL ---
  orders: [], // 👈 الحالة المبدئية فارغة
  chiffreAffaires: 0,
  activeDrivers: 0,
  activeOrders: 0,
  activePartners: 0,
  pendingCash: 0,
  cashInCirculation: 0,
  commissionPlateforme: 0,
  partPartenaires: 0,

  isAutoDispatchActive: false,
  disputes: [],
  selectedZone: 'GRAND_TUNIS',
  manualMode: false,
  systemPaused: false,
  sosAlert: false,

  // --- ACTIONS OPÉRATIONNELLES (Gouvernance & Conflits) ---
  flushFinancialBuffer: () => set({ pendingCash: 0 }),
  freezeDriverAccount: (driverId, disputeId) => console.log('Driver frozen:', driverId, disputeId),
  reassignOrderAction: (orderId, newDriverId) => console.log('Reassigned:', orderId, newDriverId),
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  toggleManualMode: () => set((state) => ({ manualMode: !state.manualMode })),
  toggleSystemPause: () => set((state) => ({ systemPaused: !state.systemPaused })),
  triggerSos: (value) => set((state) => ({ sosAlert: typeof value === 'boolean' ? value : !state.sosAlert })),

  // --- MOTEUR DE CALCUL FINANCIER ---
  fetchDashboardMetrics: async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: orders, error } = await supabase
        .from('orders')
        .select(`id, status, total_amount, created_at, driver_id, partner_id, partners ( created_at, commission_rate )`)
        .gte('created_at', today.toISOString());

      if (error) throw error;

      let ca = 0; let activeCount = 0; let calcCommission = 0; let calcPartnerPart = 0;
      const uniqueDrivers = new Set(); const uniquePartners = new Set();

      (orders || []).forEach(order => {
        const orderAmt = order.total_amount || 0;
        if (order.status === 'delivered') {
          ca += orderAmt;
          let dynamicRate = 0.10;
          const partnerData: any = Array.isArray(order.partners) ? order.partners[0] : order.partners;
          if (partnerData && partnerData.created_at) {
             const daysActive = (new Date(order.created_at).getTime() - new Date(partnerData.created_at).getTime()) / 86400000;
             if (daysActive <= 14) dynamicRate = 0.0;
             else if (partnerData.commission_rate !== undefined) dynamicRate = partnerData.commission_rate;
          }
          calcCommission += (orderAmt * dynamicRate);
          calcPartnerPart += (orderAmt * (1 - dynamicRate));
        }
        if (['pending', 'accepted', 'in_preparation', 'ready_for_pickup', 'on_the_way'].includes(order.status)) activeCount++;
        if (order.driver_id) uniqueDrivers.add(order.driver_id);
        if (order.partner_id) uniquePartners.add(order.partner_id);
      });

      // 👈 تم تحديث السطر التالي ليحفظ مصفوفة orders في الـ State
      set({
        orders: orders || [],
        chiffreAffaires: ca, activeOrders: activeCount,
        activeDrivers: uniqueDrivers.size, activePartners: uniquePartners.size,
        commissionPlateforme: calcCommission, partPartenaires: calcPartnerPart
      });
    } catch (err) {
      console.error('[EAGLE TN] Erreur Audit:', err);
    }
  },

  setupRealtimeSubscription: () => {
    get().fetchDashboardMetrics();
    const channel = supabase.channel('admin_audit_radar')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => get().fetchDashboardMetrics())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  },

  // --- AUTO-DISPATCH (Le Cerveau) ---
  runDispatchCycle: async () => {
    try {
      const { data: pendingOrders } = await supabase
        .from('orders')
        .select('*')
        .is('driver_id', null)
        .eq('status', 'ready_for_pickup');

      if (!pendingOrders || pendingOrders.length === 0) return;

      const { data: availableDrivers } = await supabase
        .from('drivers')
        .select('id')
        .eq('status', 'available')
        .limit(pendingOrders.length);

      if (!availableDrivers || availableDrivers.length === 0) return;

      for (let i = 0; i < Math.min(pendingOrders.length, availableDrivers.length); i++) {
        const order = pendingOrders[i];
        const driver = availableDrivers[i];

        await supabase
          .from('orders')
          .update({ driver_id: driver.id, status: 'on_the_way' })
          .eq('id', order.id);

        console.log(`[DISPATCH] Commande ${order.id} assignée au livreur ${driver.id}`);
      }
    } catch (error) {
      console.error('[DISPATCH ERROR]', error);
    }
  },

  toggleAutoDispatch: () => {
    const currentState = get().isAutoDispatchActive;
    if (!currentState) {
      dispatchInterval = setInterval(() => get().runDispatchCycle(), 10000);
      set({ isAutoDispatchActive: true });
      console.log('⚡ Moteur de dispatch AUTOMATIQUE activé.');
    } else {
      clearInterval(dispatchInterval);
      set({ isAutoDispatchActive: false });
      console.log('🛑 Moteur de dispatch AUTOMATIQUE désactivé.');
    }
  },
}));
