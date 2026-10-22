import React, { useState, useEffect, useRef } from 'react';

export interface OrderItem { id: string; name: string; quantity: number; notes?: string; }
export interface Order { id: string; customerName: string; status: string; items: OrderItem[]; createdAt: string; totalAmount: number; }
interface KitchenOrderCardProps { order: Order; onUpdateStatus: (orderId: string, newStatus: string) => void; }

export default function KitchenOrderCard({ order, onUpdateStatus }: KitchenOrderCardProps) {
  const isPending = order.status === 'pending';
  const isInPreparation = order.status === 'accepted' || order.status === 'in_preparation';
  const isReady = order.status === 'ready_for_pickup';
  const isHistory = order.status === 'delivered' || order.status === 'cancelled';

  const shortOrderId = order.id.split('-')[0].toUpperCase();
  
  // نظام المؤقت الذكي (60 ثانية للطلبات الجديدة)
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const autoRejectTriggered = useRef(false);

  useEffect(() => {
    if (!isPending) return;
    
    const createdAtMs = new Date(order.createdAt).getTime();
    const deadline = createdAtMs + 60000; // 60 ثانية

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((deadline - now) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0 && !autoRejectTriggered.current) {
        autoRejectTriggered.current = true;
        clearInterval(interval);
        onUpdateStatus(order.id, 'cancelled'); // رفض تلقائي
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPending, order.createdAt, order.id, onUpdateStatus]);

  return (
    <div className={`p-5 rounded-[2rem] transition-all duration-500 w-full mb-5 flex flex-col ${
      isPending ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-rose-100' :
      isInPreparation ? 'bg-[#E9EBEF] shadow-[inset_6px_6px_12px_#c8cad0,inset_-6px_-6px_12px_#ffffff]' : 
      isHistory ? 'bg-[#E9EBEF] opacity-75 grayscale' :
      'bg-[#E9EBEF] shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff]'
    }`}>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-black tracking-tight text-stone-800">CMD-{shortOrderId}</h3>
          <p className="text-[10px] font-bold text-stone-400 mt-1">{new Date(order.createdAt).toLocaleTimeString('fr-TN', {hour: '2-digit', minute:'2-digit'})}</p>
        </div>
        
        {/* شارة الحالة أو المؤقت */}
        <div className="flex flex-col items-end gap-2">
          {isPending ? (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-black text-[13px] shadow-sm ${
              timeLeft <= 15 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-amber-100 text-amber-600'
            }`}>
              ⏱️ {timeLeft}s
            </div>
          ) : (
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] ${
              isInPreparation ? 'text-amber-600 bg-amber-500/10' : 
              isReady ? 'text-emerald-600 bg-emerald-500/10' : 
              order.status === 'cancelled' ? 'text-rose-600 bg-rose-500/10' : 'text-stone-500 bg-[#E9EBEF]'
            }`}>
              {order.status.replace(/_/g, ' ')}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 flex-1 mb-6">
        {order.items.map((item) => (
          <div key={item.id} className="flex flex-col p-3 rounded-2xl bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff]">
            <span className="font-bold text-sm text-stone-800"><span className="text-emerald-600 mr-2">{item.quantity}x</span>{item.name}</span>
            {item.notes && <div className="mt-2 text-xs font-semibold text-rose-600 bg-rose-500/10 p-2 rounded-xl flex items-start gap-2">⚠️ {item.notes}</div>}
          </div>
        ))}
      </div>

      {/* أزرار القرار الميدانية */}
      {!isHistory && (
        <div className="pt-2 border-t border-stone-200/50 flex gap-3">
          {isPending && (
            <>
              <button onClick={() => onUpdateStatus(order.id, 'cancelled')} className="flex-1 py-3.5 rounded-2xl bg-rose-50 text-rose-600 font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all">
                Refuser
              </button>
              <button onClick={() => onUpdateStatus(order.id, 'accepted')} className="flex-[2] py-3.5 rounded-2xl bg-emerald-500 shadow-[0_8px_20px_rgba(16,185,129,0.3)] text-white font-black text-[12px] uppercase tracking-widest active:scale-95 transition-all">
                Accepter
              </button>
            </>
          )}

          {isInPreparation && (
            <button onClick={() => onUpdateStatus(order.id, 'ready_for_pickup')} className="w-full py-4 rounded-2xl bg-amber-500 shadow-[0_8px_20px_rgba(245,158,11,0.3)] text-white font-black text-[12px] uppercase tracking-widest active:scale-95 transition-all">
              Marquer Prêt
            </button>
          )}

          {isReady && (
            <div className="w-full py-4 rounded-2xl bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] text-emerald-600 font-black text-[11px] uppercase tracking-widest text-center">
              En attente livreur
            </div>
          )}
        </div>
      )}
    </div>
  );
}
