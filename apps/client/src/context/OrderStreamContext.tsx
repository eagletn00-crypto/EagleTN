import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { Order } from '@eagletn/types';
import { supabase } from '../lib/supabase';

interface OrderStreamContextValue {
  readonly activeOrders: Order[];
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly refreshOrders: () => Promise<void>;
}

const OrderStreamContext = createContext<OrderStreamContextValue | null>(null);

const ACTIVE_STATUSES = ['pending', 'accepted', 'preparing', 'ready', 'picked_up', 'on_the_way'];

export const OrderStreamProvider: React.FC<{ readonly children: ReactNode; readonly userId: string | null }> = ({
  children,
  userId,
}) => {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchActiveOrders = useCallback(async () => {
    if (!userId) {
      setActiveOrders([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('client_id', userId)
        .in('status', ACTIVE_STATUSES)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setActiveOrders((data as Order[]) ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur de synchronisation des commandes'));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchActiveOrders();

    if (!userId) return;

    const channel = supabase
      .channel(`client_orders_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `client_id=eq.${userId}`,
        },
        () => {
          fetchActiveOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchActiveOrders]);

  return (
    <OrderStreamContext.Provider value={{ activeOrders, isLoading, error, refreshOrders: fetchActiveOrders }}>
      {children}
    </OrderStreamContext.Provider>
  );
};

export const useClientOrderStream = (): OrderStreamContextValue => {
  const context = useContext(OrderStreamContext);
  if (!context) {
    throw new Error('useClientOrderStream must be used within an OrderStreamProvider');
  }
  return context;
};
