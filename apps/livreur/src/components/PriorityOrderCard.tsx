import React from 'react';
import { Navigation, Phone, FileText } from 'lucide-react';
import type { LivreurOrder } from '../hooks/useLivreurData';

interface Props {
  order: LivreurOrder | null;
  isFrozen: boolean;
  actionLoading: string | null;
  onAction: (id: string, status: 'accepted' | 'picked_up' | 'delivered' | 'cancelled') => void;
}

export const PriorityOrderCard: React.FC<Props> = ({ order, isFrozen, actionLoading, onAction }) => {
  if (!order) {
    return (
      <div className="rounded-[1.75rem] bg-white border border-[#E7E2D8] p-8 text-center shadow-[0_6px_20px_rgba(26,60,52,0.03)] flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-[#F5EFE2] border border-[#E5D5B5] flex items-center justify-center">
          <Navigation className="w-6 h-6 text-[#A37836]" />
        </div>
        <div>
          <p className="text-sm font-black text-stone-900">Radar actif · En attente</p>
          <p className="text-xs text-stone-500 mt-1">
            Aucune course prioritaire assignée. Les nouvelles demandes apparaîtront ici en temps réel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] bg-white border border-[#E7E2D8] p-4 shadow-[0_10px_28px_rgba(26,60,52,0.05)] space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-[3px] border-[#D4A64A] bg-[#FAF9F6] flex items-center justify-center shrink-0">
            <span className="text-[11px] font-black text-stone-900 uppercase">
              {order.status === 'pending' ? 'LIVE' : 'ACTIF'}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-stone-900">#{order.id.slice(0, 7)}</span>
              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-[10px] font-bold text-stone-600">
                Espèces
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              Total: {Number(order.total_amount || 0).toFixed(3)} TND
            </p>
          </div>
        </div>

        <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-right">
          <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">GAIN ESTIMÉ :</p>
          <p className="text-sm font-black text-[#1A5D48]">
            {Number(order.delivery_fee || 0).toFixed(3)} TND
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#FAF9F6] border border-[#ECE7DD] p-3.5 space-y-3">
        <div className="flex items-start gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4A64A] mt-1 shrink-0" />
          <div>
            <p className="text-[10px] font-black tracking-wider text-[#A37836] uppercase">ENLÈVEMENT</p>
            <p className="text-xs font-bold text-stone-900">{order.pickup_name || 'Partenaire EAGLE TN'}</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1A3C34] mt-1 shrink-0" />
          <div>
            <p className="text-[10px] font-black tracking-wider text-[#1A3C34] uppercase">LIVRAISON</p>
            <p className="text-xs font-bold text-stone-900">{order.address_spec || 'Adresse client confirmée'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={order.customer_phone ? `tel:${order.customer_phone}` : undefined}
          className="rounded-full bg-[#FAF9F6] border border-[#E7E2D8] py-2 px-3 flex items-center justify-center gap-2 text-xs font-bold text-stone-800"
        >
          <Phone className="w-3.5 h-3.5 text-[#A37836]" />
          <span>{order.customer_phone || 'Client EAGLE'}</span>
        </a>
        <div className="rounded-full bg-[#FAF9F6] border border-[#E7E2D8] py-2 px-3 flex items-center justify-center gap-2 text-xs font-bold text-stone-800">
          <Navigation className="w-3.5 h-3.5 text-[#1A3C34]" />
          <span>Itinéraire GPS</span>
        </div>
      </div>

      {order.customer_note && (
        <div className="rounded-xl bg-gradient-to-r from-[#E6D3A3] to-[#D4B97B] px-3.5 py-2.5 flex items-center gap-2 text-xs font-bold text-stone-900">
          <FileText className="w-4 h-4 shrink-0" />
          <span>Note Client : {order.customer_note}</span>
        </div>
      )}

      <div className="pt-1 space-y-2">
        {order.status === 'pending' && (
          <>
            <button
              disabled={actionLoading === order.id || isFrozen}
              onClick={() => onAction(order.id, 'accepted')}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#B89242] via-[#D4B46A] to-[#B89242] text-stone-950 font-black text-sm tracking-wider uppercase shadow-md active:scale-[0.98] disabled:opacity-50 transition"
            >
              {actionLoading === order.id ? 'Validation...' : 'ACCEPTER LA COURSE'}
            </button>
            <button
              disabled={actionLoading === order.id}
              onClick={() => onAction(order.id, 'cancelled')}
              className="w-full py-2 text-center text-xs font-bold tracking-widest text-stone-400 uppercase hover:text-stone-600"
            >
              REJETER
            </button>
          </>
        )}
        {order.status === 'accepted' && (
          <button
            disabled={actionLoading === order.id}
            onClick={() => onAction(order.id, 'picked_up')}
            className="w-full py-3.5 rounded-full bg-[#1A3C34] text-white font-black text-sm tracking-wider uppercase shadow-md active:scale-[0.98] transition"
          >
            CONFIRMER L&apos;ENLÈVEMENT
          </button>
        )}
        {order.status === 'picked_up' && (
          <button
            disabled={actionLoading === order.id}
            onClick={() => onAction(order.id, 'delivered')}
            className="w-full py-3.5 rounded-full bg-emerald-700 text-white font-black text-sm tracking-wider uppercase shadow-md active:scale-[0.98] transition"
          >
            CONFIRMER LA LIVRAISON
          </button>
        )}
      </div>
    </div>
  );
};
