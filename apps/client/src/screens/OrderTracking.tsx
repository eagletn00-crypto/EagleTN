import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton } from '@eagle-tn/ui';
import { getOrderStatus } from '@eagle-tn/database';
import type { OrderStatus } from '@eagle-tn/database';

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const [status, setStatus] = useState<OrderStatus>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = orderId ? parseInt(orderId, 10) : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const orderStatus = await getOrderStatus(id);
        setStatus(orderStatus);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Impossible de récupérer le statut de la commande';
        setError(message);
        console.error('Order status error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id > 0) {
      fetchStatus();
      interval = setInterval(fetchStatus, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-ultra-dark-950 text-gray-100 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-3xl"
      >
        <GlassCard className="p-8 space-y-6 border-amber-ultra-500/20 shadow-glow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-amber-400/80">Suivi de commande</p>
              <h1 className="text-3xl font-bold text-white">Commande #{orderId}</h1>
            </div>
            <Link to="/client-home">
              <GlassButton variant="ghost" className="px-4 py-2">
                ← Retour au menu
              </GlassButton>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-ultra-dark-900/70 rounded-3xl border border-white/10">
              <p className="text-sm text-zinc-400">Statut actuel</p>
              <p className="mt-3 text-2xl font-black text-amber-400 uppercase tracking-wide">{loading ? 'Chargement…' : status}</p>
            </div>
            <div className="p-5 bg-ultra-dark-900/70 rounded-3xl border border-white/10">
              <p className="text-sm text-zinc-400">Restaurant</p>
              <p className="mt-3 text-lg font-semibold text-white">Chez Am Ali</p>
            </div>
            <div className="p-5 bg-ultra-dark-900/70 rounded-3xl border border-white/10">
              <p className="text-sm text-zinc-400">Prochaine mise à jour</p>
              <p className="mt-3 text-lg font-semibold text-white">Toutes les 5 secondes</p>
            </div>
          </div>

          {error && (
            <div className="rounded-3xl bg-red-500/10 border border-red-500/20 p-4 text-red-200">
              {error}
            </div>
          )}

          <div className="rounded-3xl bg-ultra-dark-900/80 p-6 border border-white/5">
            <p className="text-sm text-zinc-400">Votre commande est en file d'attente et sera bientôt prise en charge par notre coursier Eagle.TN.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-zinc-950/80 p-4 border border-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Livraison</p>
                <p className="mt-2 text-base font-semibold text-white">Chez Am Ali, Tunis</p>
              </div>
              <div className="rounded-2xl bg-zinc-950/80 p-4 border border-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Moyen</p>
                <p className="mt-2 text-base font-semibold text-white">Live tracking & préparation</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
