import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  status: string;
  total_ttc: number;
  delivery_phone: string;
  cooking_instructions: string | null;
  created_at: string;
  partner_id: string;
}

export const LivreurDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeDelivery, setActiveDelivery] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. جلب الطلبات الجاهزة للتوصيل (PREPARED) أو التي يقوم هذا السائق بتوصيلها حالياً (DELIVERING)
    const fetchDeliveries = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id, status, total_ttc, delivery_phone, cooking_instructions, created_at, partner_id')
          .in('status', ['PREPARED', 'DELIVERING'])
          .order('created_at', { ascending: false });

        if (!error && data) {
          const ongoing = data.find(o => o.status === 'DELIVERING');
          if (ongoing) {
            setActiveDelivery(ongoing);
          }
          setOrders(data.filter(o => o.status === 'PREPARED'));
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des livraisons:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveries();

    // 2. تفعيل اشتراك CDC اللحظي لطلبات التوصيل الجديدة
    const channel = supabase
      .channel('livreur-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          const updatedOrder = payload.new as Order;
          if (updatedOrder.status === 'PREPARED') {
            setOrders(prev => {
              if (prev.some(o => o.id === updatedOrder.id)) return prev;
              return [updatedOrder, ...prev];
            });
          } else if (updatedOrder.status === 'DELIVERING') {
            setActiveDelivery(updatedOrder);
            setOrders(prev => prev.filter(o => o.id !== updatedOrder.id));
          } else if (updatedOrder.status === 'DELIVERED') {
            if (activeDelivery?.id === updatedOrder.id) {
              setActiveDelivery(null);
            }
            setOrders(prev => prev.filter(o => o.id !== updatedOrder.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeDelivery]);

  // قبول مهمة التوصيل وتغيير الحالة إلى DELIVERING
  const acceptDelivery = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'DELIVERING' })
        .eq('id', orderId);

      if (error) throw error;
    } catch (err) {
      console.error('Erreur acceptation livraison:', err);
    }
  };

  // إنهاء التوصيل بنجاح وتغيير الحالة إلى DELIVERED
  const completeDelivery = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'DELIVERED' })
        .eq('id', orderId);

      if (error) throw error;
      setActiveDelivery(null);
      alert('Bravo ! Livraison effectuée avec succès 🎉');
    } catch (err) {
      console.error('Erreur finalisation livraison:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#09090B] p-6 font-sans antialiased pb-24">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* هيدر السائقين الفاخر */}
        <div className="flex justify-between items-center bg-white border border-zinc-200 p-5 rounded-3xl shadow-sm">
          <div>
            <span className="text-[10px] text-[#00875A] font-bold tracking-widest uppercase block">EAGLE DRIVER</span>
            <h1 className="text-lg font-black text-zinc-900 tracking-tight">Zone: Tunis Center 🏍️</h1>
          </div>
          <span className="w-3 h-3 rounded-full bg-[#00875A] animate-pulse" />
        </div>

        {/* القسم الأول: الطلب الجاري توصيله حالياً */}
        {activeDelivery ? (
          <div className="bg-[#18181B] text-white rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-[#00875A] text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Livraison en cours
              </span>
              <span className="text-xs text-zinc-400 font-mono">ID: {activeDelivery.id.slice(0, 8)}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-base">🏬</span>
                <div>
                  <h4 className="font-bold text-zinc-200">Point de retrait (المطعم)</h4>
                  <p className="text-zinc-400">Chez Am Ali • Cité Ibn Khaldoun</p>
                </div>
              </div>
              <div className="flex items-start gap-2 border-t border-zinc-800 pt-3">
                <span className="text-base">📍</span>
                <div>
                  <h4 className="font-bold text-zinc-200">Destination (العميل)</h4>
                  <p className="text-zinc-400">Tunis, Tunisie</p>
                  <p className="text-[#00875A] font-bold font-mono pt-1">📞 {activeDelivery.delivery_phone}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => completeDelivery(activeDelivery.id)}
              className="w-full bg-[#00875A] text-white py-4 rounded-2xl font-black text-xs hover:bg-[#00704A] transition-all active:scale-[0.98] shadow-lg shadow-[#00875a]/10"
            >
              🏁 Confirmer la livraison (تم التوصيل)
            </button>
          </div>
        ) : (
          <div className="bg-zinc-100 border border-dashed border-zinc-300 rounded-3xl p-6 text-center text-xs text-zinc-500 font-medium">
            😴 Aucune livraison active. Choisissez une commande ci-dessous.
          </div>
        )}

        {/* القسم الثاني: طلبات الانتظار الجاهزة للالتقاط */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Commandes prêtes à livrer ({orders.length})</h2>

          {isLoading ? (
            <div className="text-center py-8 text-xs text-zinc-400 font-medium">Recherche de commandes disponibles...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-400 font-medium bg-white border border-zinc-200 rounded-3xl">
              Pas de nouvelles commandes prêtes pour le moment.
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white border border-zinc-200 rounded-3xl p-5 space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400 font-mono">ID: {order.id.slice(0, 8)}</span>
                  <span className="text-xs font-bold text-zinc-800 font-mono">{Number(order.total_ttc).toFixed(3)} DT</span>
                </div>

                <div className="text-xs text-zinc-500 space-y-1">
                  <p className="font-medium text-zinc-700">📍 Retrait: Chez Am Ali</p>
                  <p className="text-[10px] text-zinc-400 font-semibold">Gains de livraison: +3.500 DT</p>
                </div>

                <button
                  onClick={() => acceptDelivery(order.id)}
                  disabled={!!activeDelivery}
                  className="w-full bg-[#18181B] text-white py-3 rounded-2xl font-bold text-xs hover:bg-zinc-800 disabled:opacity-40 transition-all active:scale-[0.98]"
                >
                  🚀 Prendre la livraison (استلام الشحنة)
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
