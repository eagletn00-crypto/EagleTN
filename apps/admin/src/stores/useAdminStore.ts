import { create } from 'zustand';

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
  // الحسابات والمالية
  chiffreAffaires: number;
  pendingCash: number;
  cashInCirculation: number;
  flushFinancialBuffer: () => void;

  // إدارة النزاعات
  disputes: DisputeItem[];
  freezeDriverAccount: (driverId: string, disputeId?: string) => void;
  reassignOrderAction: (orderId: string, newDriverId?: string) => void;

  // الحوكمة وعناصر التحكم بالمجال
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  manualMode: boolean;
  toggleManualMode: () => void;
  systemPaused: boolean;
  toggleSystemPause: () => void;
  sosAlert: boolean;
  triggerSos: (value?: boolean) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  // الحسابات
  chiffreAffaires: 0,
  pendingCash: 0,
  cashInCirculation: 0,
  flushFinancialBuffer: () => set({ pendingCash: 0 }),

  // النزاعات
  disputes: [],
  freezeDriverAccount: (driverId: string, disputeId?: string) => 
    console.log('Driver frozen:', driverId, 'Dispute:', disputeId),
  reassignOrderAction: (orderId: string, newDriverId?: string) => 
    console.log('Reassigned order:', orderId, newDriverId),

  // الحوكمة
  selectedZone: 'GRAND_TUNIS',
  setSelectedZone: (zone: string) => set({ selectedZone: zone }),
  manualMode: false,
  toggleManualMode: () => set((state) => ({ manualMode: !state.manualMode })),
  systemPaused: false,
  toggleSystemPause: () => set((state) => ({ systemPaused: !state.systemPaused })),
  sosAlert: false,
  triggerSos: (value?: boolean) => 
    set((state) => ({ sosAlert: typeof value === 'boolean' ? value : !state.sosAlert })),
}));
