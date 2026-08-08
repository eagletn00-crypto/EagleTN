import { useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export function useOrderRealtime(orderId: string | null, onUpdate: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void) {
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`order-updates-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          onUpdate(payload);
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Realtime subscribed to order ${orderId}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, onUpdate]);
}
