import React, { useState, useEffect, useCallback } from 'react';
import { ChefHat, Clock, AlertCircle, RefreshCw, CheckCircle2, User, Printer, XCircle } from 'lucide-react';
import { supabase } from '../../utils/location';
import AudioAlertManager from '../AudioAlertManager';
import OrderTrackingMap from '../OrderTrackingMap';

interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  options?: any[];
  unit_price?: number;
}

interface Order {
  id: string;
  pin_code?: string;
  customer_name?: string;
  customer_phone?: string;
  delivery_address?: string;
  status: string;
  created_at: string;
  total_amount: number;
  order_items?: OrderItem[];
}

export const KitchenKDS: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoAcceptTimers, setAutoAcceptTimers] = useState<{ [key: string]: number }>({});

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        setError('Connexion Supabase non disponible.');
        return;
      }

      const { data, error: fetchErr } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .in('status', ['pending', 'accepted', 'in_preparation', 'ready_for_pickup'])
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;

      const fetchedOrders = data || [];
      setOrders(fetchedOrders);

      const initialTimers: { [key: string]: number } = {};
      fetchedOrders.forEach((o) => {
        if (o.status === 'pending') {
          initialTimers[o.id] = 10;
        }
      });
      setAutoAcceptTimers(initialTimers);
    } catch (err: any) {
      console.error('[KitchenKDS] Fetch Error:', err);
      setError(err.message || 'Erreur lors du chargement des commandes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    if (!supabase) return;

    const channel = supabase
      .channel('kds-live-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchOrders())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoAcceptTimers((prev) => {
        const next = { ...prev };
        let updated = false;

        Object.keys(next).forEach((id) => {
          if (next[id] > 1) {
            next[id] -= 1;
            updated = true;
          } else if (next[id] === 1) {
            updateOrderStatus(id, 'in_preparation');
            delete next[id];
            updated = true;
          }
        });

        return updated ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId: string, nextStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );

    try {
      if (!supabase) return;
      const { error: updateErr } = await supabase
        .from('orders')
        .update({ status: nextStatus })
        .eq('id', orderId);

      if (updateErr) throw updateErr;
    } catch (err: any) {
      console.error('[KitchenKDS] Status Update Error:', err);
      fetchOrders();
    }
  };

  const handlePrintReceipt = (order: Order) => {
    const printWindow = window.open('', '_blank', 'width=380,height=600');
    if (!printWindow) return;

    const itemsHtml = order.order_items
      ?.map(
        (i) =>
          `<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
            <span>${i.quantity}x ${i.item_name}</span>
            <span style="font-weight:bold;">${i.unit_price ? (i.unit_price * i.quantity).toFixed(3) : ''} DT</span>
          </div>`
      )
      .join('') || '';

    printWindow.document.write(`
      <html>
        <head>
          <title>Reçu Ticket - ${order.id.substring(0, 8)}</title>
          <style>
            body { font-family: monospace; padding: 12px; margin: 0; width: 280px; }
            h2 { text-align: center; margin: 0 0 4px 0; font-size: 16px; }
            p { text-align: center; margin: 0 0 12px 0; font-size: 10px; color: #555; }
            .divider { border-bottom: 1px dashed #000; margin: 8px 0; }
            .total { font-weight: bold; font-size: 14px; text-align: right; }
          </style>
        </head>
        <body>
          <h2>RESTAURANT AM ALI</h2>
          <p>Rue El Gharbi El Issaoui, Cité Ibn Khaldoun</p>
          <div class="divider"></div>
          <div><strong>Ticket ID:</strong> #${order.id.substring(0, 8).toUpperCase()}</div>
          <div><strong>Client:</strong> ${order.customer_name || 'Client Passager'}</div>
          <div><strong>Date:</strong> ${new Date(order.created_at).toLocaleTimeString('fr-FR')}</div>
          <div class="divider"></div>
          ${itemsHtml}
          <div class="divider"></div>
          <div class="total">TOTAL: ${Number(order.total_amount || 0).toFixed(3)} DT</div>
          <div class="divider"></div>
          <p style="margin-top:12px;">Merci de votre confiance ! - EAGLE TN</p>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const hasNewPending = orders.some((o) => o.status === 'pending');

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 font-sans text-slate-900 pb-36">
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100/80">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-slate-900">Commandes Cuisine</h1>
            <p className="text-xs text-slate-500 font-semibold">Gérance en direct - Restaurant Am Ali</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AudioAlertManager hasNewOrder={hasNewPending} />
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Commandes En Cours</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
            {orders.length}
          </span>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="py-20 text-center text-xs font-bold text-slate-400">
          Chargement du flux cuisine...
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-2xs space-y-2">
          <ChefHat className="w-12 h-12 mx-auto text-emerald-400 mb-2" />
          <h3 className="text-sm font-black text-slate-900">Aucune commande active pour le moment</h3>
          <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto">
            Les nouvelles commandes des clients s'afficheront ici en temps réel avec notification sonore.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const shortId = order.id.substring(0, 8).toUpperCase();
            const isPending = order.status === 'pending' || order.status === 'accepted';
            const isPreparing = order.status === 'in_preparation';
            const autoTimer = autoAcceptTimers[order.id];

            return (
              <div
                key={order.id}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 hover:border-emerald-200/80 transition-all"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-xl shadow-2xs">
                      #{shortId}
                    </span>
                    {order.pin_code && (
                      <span className="bg-slate-100 text-slate-700 text-xs font-black px-2.5 py-1 rounded-xl">
                        PIN: {order.pin_code}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrintReceipt(order)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all"
                      title="Imprimer le Reçu"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ticket</span>
                    </button>

                    <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60 text-xs font-extrabold">
                      <Clock className="w-3.5 h-3.5" />
                      {isPending ? 'Nouveau' : isPreparing ? 'En Préparation' : 'Prêt'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 bg-slate-50/90 p-3 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-2.5">
                    <User className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Client</p>
                      <p className="font-extrabold text-slate-900 truncate">{order.customer_name || 'Client Passager'}</p>
                    </div>
                  </div>
                </div>

                <OrderTrackingMap customerAddress={order.delivery_address || 'Cité Ibn Khaldoun, Tunis'} />

                <div className="space-y-2">
                  {order.order_items && order.order_items.length > 0 ? (
                    order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between bg-slate-50/70 p-3 rounded-2xl border border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-2xs">
                            {item.quantity}x
                          </span>
                          <span className="text-xs font-extrabold text-slate-900">{item.item_name}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic">Aucun article enregistré.</div>
                  )}
                </div>

                <div className="pt-2 space-y-2">
                  {isPending && (
                    <div className="space-y-2">
                      {autoTimer !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-extrabold text-emerald-800">
                            <span>Acceptation automatique imminente...</span>
                            <span>{autoTimer}s</span>
                          </div>
                          <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full transition-all duration-1000 ease-linear"
                              style={{ width: `${(autoTimer / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <button
                          onClick={() => updateOrderStatus(order.id, 'in_preparation')}
                          className="sm:col-span-3 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xs"
                        >
                          <ChefHat className="w-4 h-4" />
                          <span>Accepter & Lancer la Préparation</span>
                        </button>

                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="py-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 text-rose-700 active:scale-98 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Refuser</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {isPreparing && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready_for_pickup')}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Marquer la Commande Comme Prête</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KitchenKDS;
