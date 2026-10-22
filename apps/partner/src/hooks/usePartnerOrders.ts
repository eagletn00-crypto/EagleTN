import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase/client';
import { Order, OrderItem } from '../components/kitchen/KitchenOrderCard';

export type OrderStatus = 'pending' | 'accepted' | 'in_preparation' | 'ready_for_pickup' | 'on_the_way' | 'delivered' | 'cancelled';

export function usePartnerOrders(partnerId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActiveOrders = useCallback(async () => {
    if (!partnerId) return;
    try {
      setIsLoading(true);
      setError(null);
      
      // التحديث الاحترافي: جلب نافذة آخر 24 ساعة بدلاً من منتصف الليل الصارم
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id, status, created_at, total_amount,
          order_items ( id, quantity, options, item_id, item_name )
        `)
        .eq('partner_id', partnerId)
        .gte('created_at', last24Hours) // الفلتر الميداني الجديد
        .order('created_at', { ascending: false }); 

      if (ordersError) throw ordersError;

      const { data: menuData } = await supabase
        .from('menu_items')
        .select('id, name, name_fr, name_ar')
        .eq('partner_id', partnerId);

      const menuDict: Record<string, any> = {};
      if (menuData) menuData.forEach(item => { menuDict[item.id] = item; });

      const formattedOrders: Order[] = (ordersData || []).map((o: any) => ({
        id: o.id, 
        customerName: 'Client EAGLE', 
        status: o.status,
        createdAt: o.created_at,
        totalAmount: o.total_amount || 0,
        items: (o.order_items || []).map((item: any) => {
          const menuInfo = item.item_id ? menuDict[item.item_id] : null;
          let parsedNotes = '';
          if (item.options) {
             if (typeof item.options === 'string' && item.options !== '[]' && item.options !== '{}') parsedNotes = item.options;
             else if (Array.isArray(item.options) && item.options.length > 0) parsedNotes = item.options.join('، ');
          }
          return {
            id: item.id,
            name: menuInfo?.name_fr || menuInfo?.name || item.item_name || 'Plat Inconnu',
            quantity: item.quantity || 1,
            notes: parsedNotes
          };
        })
      }));

      setOrders(formattedOrders);
    } catch (err) {
      console.error("[EAGLE TN] Erreur fetch orders:", err);
      setError(err instanceof Error ? err : new Error('Erreur réseau inconnue.'));
    } finally {
      setIsLoading(false);
    }
  }, [partnerId]);

  useEffect(() => { fetchActiveOrders(); }, [fetchActiveOrders]);

  useEffect(() => {
    if (!partnerId) return;
    const channel = supabase.channel(`partner_orders_sync_${partnerId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `partner_id=eq.${partnerId}` }, () => {
        fetchActiveOrders();
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [partnerId, fetchActiveOrders]);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    setOrders(current => current.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      const { error: mutationError } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (mutationError) throw mutationError;
    } catch (err) {
      console.error("[EAGLE TN] Échec mutation:", err);
      fetchActiveOrders(); 
    }
  }, [fetchActiveOrders]);

  return { orders, updateOrderStatus, isLoading, error };
}
