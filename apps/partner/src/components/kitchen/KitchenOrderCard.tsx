import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Printer, Flame } from 'lucide-react';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

export interface KitchenOrder {
  id: string;
  shortId: string;
  customerName: string;
  items: OrderItem[];
  status: 'PENDING' | 'PREPARING' | 'READY';
  elapsedMinutes: number;
  pinCode: string;
}

interface Props {
  order: KitchenOrder;
  onAccept?: (id: string) => void;
  onMarkReady?: (id: string) => void;
  onPrint?: (id: string) => void;
}

export const KitchenOrderCard: React.FC<Props> = ({ order, onAccept, onMarkReady, onPrint }) => {
  const isUrgent = order.elapsedMinutes > 15;

  return (
    <div
      className={`bg-white rounded-3xl p-5 border shadow-sm transition-all flex flex-col justify-between ${
        isUrgent ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-100'
      }`}
    >
      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 text-white font-mono text-sm px-3 py-1 rounded-full font-bold tracking-wider">
              #{order.shortId}
            </span>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              PIN: <strong className="text-slate-900 font-mono">{order.pinCode}</strong>
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isUrgent
                ? 'bg-red-50 text-red-600 animate-pulse'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{order.elapsedMinutes} min</span>
          </div>
        </div>

        {/* Customer & Items List */}
        <div className="py-4">
          <p className="text-xs font-medium text-slate-400 mb-2">
            العميل: <span className="text-slate-800 font-semibold">{order.customerName}</span>
          </p>

          <div className="space-y-2.5">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center bg-emerald-500 text-white font-extrabold text-sm w-8 h-8 rounded-xl shadow-xs">
                    {item.quantity}x
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">
                      {item.name}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-amber-700 font-medium mt-0.5">
                        ⚠️ {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Touch-Friendly Action Buttons */}
      <div className="pt-2 flex items-center gap-2">
        {onPrint && (
          <button
            onClick={() => onPrint(order.id)}
            className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors active:scale-95"
            title="طباعة التكت"
          >
            <Printer className="w-5 h-5" />
          </button>
        )}

        {order.status === 'PENDING' && onAccept && (
          <button
            onClick={() => onAccept(order.id)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
          >
            <Flame className="w-4 h-4 fill-white" />
            <span>بدء التحضير</span>
          </button>
        )}

        {order.status === 'PREPARING' && onMarkReady && (
          <button
            onClick={() => onMarkReady(order.id)}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>جاهز للتسليم</span>
          </button>
        )}

        {order.status === 'READY' && (
          <div className="flex-1 bg-emerald-50 text-emerald-700 border border-emerald-200 py-3 px-4 rounded-2xl font-bold text-xs text-center">
            بانتظار سائق التوصيل 🛵
          </div>
        )}
      </div>
    </div>
  );
};
