import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';
import type { Database } from '@eagletn/types';

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderStatus = Order['status'];

interface UseOrderStreamOptions {
  readonly userId?: string;
  readonly partnerId?: string;
  readonly initialStatus?: OrderStatus[];
}

interface OrderStreamResult {
  readonly orders: Order[];
  readonly isLoading: boolean;
  readonly error: Error | null;
}

export const useOrderStream = (options?: UseOrderStreamOptions): OrderStreamResult => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInitialOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      let query = supabase.from('orders').select('*');

      if (options?.userId) query = query.eq('user_id', options.userId);
      if (options?.partnerId) query = query.eq('partner_id', options.partnerId);
      if (options?.initialStatus && options.initialStatus.length > 0) {
        query = query.in('status', options.initialStatus);
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) throw new Error(fetchError.message);
      setOrders(data as Order[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch initial orders'));
    } finally {
      setIsLoading(false);
    }
  }, [options?.userId, options?.partnerId, JSON.stringify(options?.initialStatus)]);

  useEffect(() => {
    fetchInitialOrders();

    const channel = supabase.channel('public:orders_stream')
      .on<Order>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: options?.partnerId ? `partner_id=eq.${options.partnerId}` : options?.userId ? `user_id=eq.${options.userId}` : undefined,
        },
        (payload) => {
          setOrders((prev) => [payload.new, ...prev]);
        }
      )
      .on<Order>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: options?.partnerId ? `partner_id=eq.${options.partnerId}` : options?.userId ? `user_id=eq.${options.userId}` : undefined,
        },
        (payload) => {
          setOrders((prev) => prev.map((order) => (order.id === payload.new.id ? payload.new : order)));
        }
      )
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR') {
          setError(new Error(`Supabase Realtime Subscription Error: ${err?.message || 'Unknown Error'}`));
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchInitialOrders, options?.partnerId, options?.userId]);

  return { orders, isLoading, error };
};
