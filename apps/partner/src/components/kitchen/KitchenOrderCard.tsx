import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { Order } from '@eagletn/types';

interface KitchenOrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: Order['status']) => void;
}

export default function KitchenOrderCard({ order, onUpdateStatus }: KitchenOrderCardProps) {
  // Map internal component logic strictly to @eagletn/types definitions
  const isPending = order.status === 'pending';
  const isInPreparation = order.status === 'preparing';
  const isReady = order.status === 'on_way'; // 'on_way' implies picked up by driver, ready from kitchen perspective
  const isHistory = order.status === 'delivered' || order.status === 'cancelled';

  const shortOrderId = order.id.split('-')[0].toUpperCase();

  // Smart Timer (60s Auto-Reject for Pending Orders)
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const autoRejectTriggered = useRef(false);

  useEffect(() => {
    if (!isPending || !order.created_at) return;

    const createdAtMs = new Date(order.created_at).getTime();
    const deadline = createdAtMs + 60000;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((deadline - now) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0 && !autoRejectTriggered.current) {
        autoRejectTriggered.current = true;
        clearInterval(interval);
        onUpdateStatus(order.id, 'cancelled');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPending, order.created_at, order.id, onUpdateStatus]);

  // Cinematic Style Orchestration
  const getCardStyle = () => {
    if (isPending) return 'bg-[var(--color-surface-elevated)] shadow-[var(--shadow-elevated)] border-2 border-[var(--color-primary-base)]/20';
    if (isInPreparation) return 'bg-[var(--color-surface-sunken)] shadow-[var(--shadow-ambient)] border border-stone-100';
    if (isHistory) return 'bg-[var(--color-surface-base)] opacity-70 grayscale-[50%] border border-stone-100';
    return 'bg-[var(--color-surface-elevated)] shadow-[var(--shadow-ambient)] border border-stone-100';
  };

  const getStatusBadge = () => {
    switch (order.status) {
      case 'preparing':
        return <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-amber-700 bg-amber-50 border border-amber-200 shadow-sm flex items-center gap-1.5"><Clock className="w-3 h-3" /> En Préparation</span>;
      case 'on_way':
        return <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-[var(--color-primary-base)] bg-[var(--color-primary-base)]/10 border border-[var(--color-primary-base)]/20 shadow-sm flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Prêt & En Route</span>;
      case 'cancelled':
        return <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-red-700 bg-red-50 border border-red-200 shadow-sm flex items-center gap-1.5"><XCircle className="w-3 h-3" /> Refusée</span>;
      default:
        return <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-stone-600 bg-stone-100 border border-stone-200 shadow-sm">{order.status.replace(/_/g, ' ')}</span>;
    }
  };

  return (
    <div className={`p-5 sm:p-6 rounded-[1.75rem] transition-all duration-500 w-full flex flex-col ${getCardStyle()}`}>
      
      {/* Header Segment */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-black tracking-tight text-stone-900">CMD-{shortOrderId}</h3>
          <p className="text-[11px] font-bold text-stone-400 mt-1 uppercase tracking-widest">
            {order.created_at ? new Date(order.created_at).toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {isPending ? (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={timeLeft}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-xs shadow-sm border ${
                  timeLeft <= 15 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" /> {timeLeft}s
              </motion.div>
            </AnimatePresence>
          ) : (
            getStatusBadge()
          )}
        </div>
      </div>

      {/* Order Items Segment */}
      <div className="space-y-3 flex-1 mb-8">
        {((typeof order.items === 'string' ? JSON.parse(order.items) : order.items) as any[])?.map((item, idx) => (
          <div key={item.id || idx} className="flex flex-col p-4 rounded-2xl bg-[var(--color-surface-elevated)] border border-stone-100 shadow-sm">
            <span className="font-bold text-sm text-stone-900 flex items-start gap-3">
              <span className="text-[var(--color-primary-base)] font-black bg-[var(--color-primary-base)]/10 px-2 py-0.5 rounded-lg text-xs">{item.quantity}x</span>
              <span className="mt-0.5 leading-tight">{item.name}</span>
            </span>
            {/* Using arbitrary type access safely since @eagletn/types OrderItem doesn't define 'notes' yet, but JSON payloads might include it */}
            {(item as any).notes && (
              <div className="mt-3 text-[11px] font-bold text-[var(--color-primary-base)] bg-[var(--color-primary-base)]/5 p-2.5 rounded-xl flex items-start gap-2 border border-[var(--color-primary-base)]/10">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> 
                <span className="leading-relaxed">{(item as any).notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Execution Action Segment */}
      {!isHistory && (
        <div className="pt-2 flex gap-3 mt-auto">
          {isPending && (
            <>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => onUpdateStatus(order.id, 'cancelled')} 
                className="flex-[0.8] py-4 rounded-2xl bg-stone-100 text-stone-600 font-black text-[11px] uppercase tracking-[0.15em] border border-stone-200 transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                Refuser
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => onUpdateStatus(order.id, 'preparing')} 
                className="flex-[2] py-4 rounded-2xl bg-[var(--color-primary-base)] text-white font-black text-xs uppercase tracking-widest shadow-[var(--shadow-float)] transition-colors hover:bg-[var(--color-primary-hover)]"
              >
                Accepter
              </motion.button>
            </>
          )}

          {isInPreparation && (
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => onUpdateStatus(order.id, 'on_way')} 
              className="w-full py-4 rounded-2xl bg-stone-900 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-stone-900/20 transition-colors hover:bg-black"
            >
              Marquer Prêt (Livreur)
            </motion.button>
          )}

          {isReady && (
            <div className="w-full py-4 rounded-2xl bg-[var(--color-surface-sunken)] border border-stone-200 text-stone-500 font-black text-[11px] uppercase tracking-widest text-center flex items-center justify-center gap-2">
              <Clock className="w-3.5 h-3.5" /> En attente coursier
            </div>
          )}
        </div>
      )}
    </div>
  );
}
