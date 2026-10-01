import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, User, Printer, XCircle, CheckCircle2 } from 'lucide-react';
import OrderTrackingMap from '../OrderTrackingMap';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
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

interface KitchenOrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: string) => void;
}

export const KitchenOrderCard: React.FC<KitchenOrderCardProps> = ({ order, onUpdateStatus }) => {
  const [autoTimer, setAutoTimer] = useState<number | null>(
    order.status === 'pending' ? 10 : null
  );

  useEffect(() => {
    if (order.status !== 'pending') {
      setAutoTimer(null);
      return;
    }

    const timer = setInterval(() => {
      setAutoTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          onUpdateStatus(order.id, 'in_preparation');
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [order.status, order.id, onUpdateStatus]);

  const shortId = order.id.substring(0, 8).toUpperCase();
  const isPending = order.status === 'pending' || order.status === 'accepted';
  const isPreparing = order.status === 'in_preparation';

  const handlePrintReceipt = () => {
    const printWindow = window.open('', '_blank', 'width=380,height=600');
    if (!printWindow) return;

    const itemsHtml = order.order_items
      ?.map(
        (i) =>
          `<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
            <span>${i.quantity}x ${i.name}</span>
            ${i.notes ? `<br/><small style="color:#d97706">⚠️ ${i.notes}</small>` : ''}
          </div>`
      )
      .join('') || '';

    printWindow.document.write(`
      <html>
        <head>
          <title>Reçu Ticket - ${shortId}</title>
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
          <div><strong>Ticket ID:</strong> #${shortId}</div>
          <div><strong>Client:</strong> ${order.customer_name || 'Client Passager'}</div>
          <div><strong>Date:</strong> ${new Date(order.created_at).toLocaleTimeString('fr-FR')}</div>
          <div class="divider"></div>
          ${itemsHtml}
          <div class="divider"></div>
          <div class="total">TOTAL: ${Number(order.total_amount).toFixed(3)} DT</div>
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

  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 hover:border-emerald-200/80 transition-all">
      {/* Header Card */}
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
            onClick={handlePrintReceipt}
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

      {/* Client Identity & Info */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 bg-slate-50/90 p-3 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-2.5">
          <User className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Client</p>
            <p className="font-extrabold text-slate-900 truncate">{order.customer_name || 'Client Passager'}</p>
          </div>
        </div>
      </div>

      {/* Trajectory Google Map Box */}
      <OrderTrackingMap customerAddress={order.delivery_address || 'Cité Ibn Khaldoun, Tunis'} />

      {/* Order Items List */}
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
                <span className="text-xs font-extrabold text-slate-900">{item.name}</span>
              </div>
              {item.notes && (
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-xl shrink-0">
                  ⚠️ {item.notes}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="text-xs text-slate-400 italic">Articles de la commande en cours de chargement...</div>
        )}
      </div>

      {/* Interactive Action Buttons */}
      <div className="pt-2 space-y-2">
        {isPending && (
          <div className="space-y-2">
            {autoTimer !== null && (
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
                onClick={() => onUpdateStatus(order.id, 'in_preparation')}
                className="sm:col-span-3 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <ChefHat className="w-4 h-4" />
                <span>Accepter & Lancer la Préparation</span>
              </button>

              <button
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
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
            onClick={() => onUpdateStatus(order.id, 'ready_for_pickup')}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Marquer la Commande Comme Prête</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default KitchenOrderCard;
