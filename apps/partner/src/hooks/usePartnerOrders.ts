// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@eagle/database'; // TIER-1: Strictly routing through the central monorepo package

export const usePartnerOrders = (partnerId?: string) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!partnerId) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('partner_id', partnerId)
        .in('status', ['pending', 'preparing', 'ready_for_pickup'])
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setOrders(data || []);
    } catch (err: any) {
      console.error('[KDS] Error fetching orders:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [partnerId]);

  useEffect(() => {
    fetchOrders();

    if (!partnerId) return;

    const channel = supabase
      .channel(`kds_orders_${partnerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `partner_id=eq.${partnerId}`,
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partnerId, fetchOrders]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setOrders((prev) => 
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );

      const { error: updateError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
        
      if (updateError) throw updateError;
    } catch (err: any) {
      console.error('[KDS] Error updating order status:', err);
      fetchOrders();
    }
  };

  return { 
    orders, 
    isLoading,
    error, 
    updateOrderStatus, 
    refetch: fetchOrders 
  };
};
