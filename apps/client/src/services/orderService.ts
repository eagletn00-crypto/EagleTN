import { supabase } from '../lib/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface OrderPayload {
  partner_id: string;
  items: unknown[];
  total_amount: number;
  delivery_address?: string;
  notes?: string;
}

export const orderService = {
  async createOrder(orderData: OrderPayload) {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getOrderById(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  },

  subscribeToOrderStatus(orderId: string, callback: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void) {
    return supabase
      .channel(`order-status-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          callback(payload);
        }
      )
      .subscribe();
  },
};
