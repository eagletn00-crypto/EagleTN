import { create } from 'zustand';

// 1. تعريف واجهة الطلب (Order Interface)
export interface Order {
  id: string;
  status: 'pending' | 'preparing' | 'ready' | 'on_the_way' | 'delivered' | 'cancelled';
  totalAmount: number;
  customerName: string;
  deliveryAddress: string;
}

// 2. تعريف واجهة حالة المخزن (Store State Interface)
export interface LivreurState {
  isOnline: boolean;
  orders: Order[];
  setOnlineStatus: (status: boolean) => void;
  setOrders: (orders: Order[]) => void;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  getActiveOrders: () => Order[];
  getTotalEarnings: () => number;
}

// 3. إنشاء المخزن مع أنواع صارمة
export const useLivreurStore = create<LivreurState>((set, get) => ({
  isOnline: false,
  orders: [],
  
  setOnlineStatus: (status: boolean) => set({ isOnline: status }),
  
  setOrders: (orders: Order[]) => set({ orders }),
  
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => 
    set({
      orders: get().orders.map((o: Order) => 
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    }),
    
  getActiveOrders: () => {
    return get().orders.filter((o: Order) => 
      o.status !== 'delivered' && o.status !== 'cancelled'
    );
  },
  
  getTotalEarnings: () => {
    return get().orders
      .filter((o: Order) => o.status === 'delivered')
      .reduce((sum: number, o: Order) => sum + o.totalAmount, 0);
  }
}));
