import { useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export interface OrderRealtimePayload {
  id: string;
  status: 'pending' | 'accepted' | 'in_preparation' | 'ready_for_pickup' | 'on_the_way' | 'delivered' | 'cancelled';
  partner_id: string;
  courier_id?: string;
  total_amount: number;
  verification_code?: string;
  [key: string]: any;
}

export const useOrderRealtime = (
  orderId: string | undefined, 
  onUpdate: (updatedOrder: OrderRealtimePayload) => void
) => {
  useEffect(() => {
    if (!orderId) return;

    console.log(`🔌 Démarrage de l'écoute Realtime pour la commande: ${orderId}`);

    const channel = supabase
      .channel(`order_realtime_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          console.log('⚡ Modification en direct reçue:', payload.new);
          onUpdate(payload.new as OrderRealtimePayload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Connecté avec succès au canal de la commande ${orderId}`);
        }
      });

    return () => {
      console.log(`🔒 Fermeture du canal Realtime pour la commande ${orderId}`);
      supabase.removeChannel(channel);
    };
  }, [orderId, onUpdate]);
};

export default useOrderRealtime;
