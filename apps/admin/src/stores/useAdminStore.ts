import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export interface DisputeItem {
  id: string;
  orderId: string;
  driverName: string;
  driverId: string;
  partnerName: string;
  zone: string;
  amount: number;
  reason: string;
  status: 'OPEN' | 'RESOLVED' | 'REASSIGNED';
  rawDriverId?: string;
}

interface AdminState {
  chiffreAffaires: number;
  pendingCash: number;
  cashInCirculation: number;
  selectedZone: string;
  manualMode: boolean;
  systemPaused: boolean;
  sosAlert: boolean;
  disputes: DisputeItem[];

  setSelectedZone: (zone: string) => void;
  toggleManualMode: () => void;
  toggleSystemPause: () => void;
  triggerSos: (status: boolean) => void;
  
  freezeDriverAccount: (driverProfileId: string, disputeId: string) => Promise<void>;
  reassignOrderAction: (orderId: string, disputeId: string) => Promise<void>;
  fetchActiveIncidents: () => Promise<void>;
  subscribeToRealtimeIncidents: () => () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  chiffreAffaires: 48590.00,
  pendingCash: 0,
  cashInCirculation: 12450.50,
  selectedZone: 'Grand Tunis',
  manualMode: false,
  systemPaused: false,
  sosAlert: false,

  disputes: [],

  setSelectedZone: (zone) => set({ selectedZone: zone }),
  toggleManualMode: () => set((s) => ({ manualMode: !s.manualMode })),
  toggleSystemPause: () => set((s) => ({ systemPaused: !s.systemPaused })),
  triggerSos: (status) => set({ sosAlert: status }),

  freezeDriverAccount: async (driverProfileId, disputeId) => {
    try {
      if (supabase) {
        await supabase
          .from('incidents')
          .update({ status: 'RESOLVED' })
          .eq('id', disputeId);
      }
      set((s) => ({ disputes: s.disputes.filter((d) => d.id !== disputeId) }));
    } catch (err) {
      console.error('Error freezing driver:', err);
    }
  },

  reassignOrderAction: async (orderId, disputeId) => {
    try {
      if (supabase) {
        await supabase
          .from('incidents')
          .update({ status: 'REASSIGNED' })
          .eq('id', disputeId);
      }
      set((s) => ({ disputes: s.disputes.filter((d) => d.id !== disputeId) }));
    } catch (err) {
      console.error('Error reassigning:', err);
    }
  },

  // 🎯 الاستعلام الدقيق من جدول incidents حسب المخطط
  fetchActiveIncidents: async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('incidents')
        .select(`
          id,
          order_id,
          driver_id,
          type,
          status,
          description,
          amount_disputed,
          partners ( name ),
          profiles:driver_id ( first_name, last_name )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching incidents:', error.message);
        return;
      }

      if (data) {
        const mapped: DisputeItem[] = data.map((item: any) => ({
          id: item.id,
          orderId: item.order_id ? `ORD-${item.order_id.slice(0, 5)}` : 'N/A',
          driverName: item.profiles ? `${item.profiles.first_name || ''} ${item.profiles.last_name?.[0] || ''}.` : 'غير محدد',
          driverId: item.driver_id ? `#${item.driver_id.slice(0, 3)}` : '#000',
          partnerName: item.partners?.name || 'Partenaire',
          zone: 'Grand Tunis',
          amount: item.amount_disputed || 0,
          reason: item.description || item.type || 'Litige en cours',
          status: item.status === 'RESOLVED' ? 'RESOLVED' : 'OPEN',
          rawDriverId: item.driver_id
        }));

        set({ disputes: mapped });
      }
    } catch (err) {
      console.error('Fetch exception:', err);
    }
  },

  subscribeToRealtimeIncidents: () => {
    if (!supabase) return () => {};

    const channel = supabase
      .channel('incidents_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'incidents' },
        () => { get().fetchActiveIncidents(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }
}));
