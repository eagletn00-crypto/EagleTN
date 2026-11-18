import React, { memo, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Package, CheckCircle, Navigation, Wallet, Clock, ArrowRight } from 'lucide-react';
import { createEagleClient } from '@eagle/database';

// -----------------------------------------------------------------------------
// STRICT TYPE DEFINITIONS
// -----------------------------------------------------------------------------
export interface LivreurOrder {
  readonly id: string;
  readonly status: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled';
  readonly total_amount: number;
  readonly delivery_fee: number;
  readonly address_spec?: string;
  readonly created_at?: string;
}

// -----------------------------------------------------------------------------
// DYNAMIC REALTIME PIPELINE (Self-Contained Resolution)
// -----------------------------------------------------------------------------
const useLivreurOrders = (driverId: string) => {
  const [orders, setOrders] = useState<LivreurOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Safely pull environment variables at runtime
    const url = import.meta.env.VITE_SUPABASE_URL || '';
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (!url || !key) {
      setError(new Error("Missing Supabase environment variables in apps/livreur"));
      setIsLoading(false);
      return;
    }

    const supabase = createEagleClient(url, key);

    const fetchInitial = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('driver_id', driverId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setOrders(data as LivreurOrder[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch initial orders'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitial();

    // High-frequency telemetry stream configuration
    const channel = supabase.channel('livreur_telemetry')
      .on<LivreurOrder>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `driver_id=eq.${driverId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [payload.new as LivreurOrder, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) => prev.map((o) => (o.id === payload.new.id ? (payload.new as LivreurOrder) : o)));
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId]);

  return { orders, isLoading, error };
};

// -----------------------------------------------------------------------------
// MAIN DASHBOARD COMPONENT
// -----------------------------------------------------------------------------
const LivreurDashboard: React.FC<{driverId?: string}> = memo(({ driverId }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const MOCK_DRIVER_ID = 'driver-uuid-0000-0000';
  
  const { orders, isLoading } = useLivreurOrders(MOCK_DRIVER_ID);

  // STRICT TYPED FILTERS & REDUCERS
  const activeOrders = useMemo(() => 
    orders.filter((o: LivreurOrder) => o.status !== "delivered" && o.status !== "cancelled"), 
  [orders]);

  const completedOrders = useMemo(() => 
    orders.filter((o: LivreurOrder) => o.status === "delivered"), 
  [orders]);

  const totalActiveAmount = useMemo(() => 
    activeOrders.reduce((sum: number, o: LivreurOrder) => sum + o.total_amount, 0), 
  [activeOrders]);

  const totalEarnings = useMemo(() => 
    completedOrders.reduce((sum: number, o: LivreurOrder) => sum + o.delivery_fee, 0), 
  [completedOrders]);

  if (isLoading) {
    return (
      <div className="w-full h-[100dvh] flex items-center justify-center bg-[#FAF9F6]">
        <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-[#A37836] animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100dvh] bg-[#FAF9F6] flex flex-col transform-gpu antialiased select-none pb-24">
      
      {/* Header & Status */}
      <header className="w-full bg-white border-b border-stone-100 px-5 pt-12 pb-5 sticky top-0 z-50 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Espace Livreur</h1>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">En ligne</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200/50 shadow-sm">
             <Navigation className="w-5 h-5 text-stone-800" strokeWidth={1.5} />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-5 pt-6 flex flex-col gap-6">
        
        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[1.5rem] p-4 border border-stone-100 shadow-[0_8px_24px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center">
              <Package className="w-4 h-4 text-stone-700" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">En Cours</span>
              <span className="text-xl font-black text-stone-900">{totalActiveAmount.toFixed(3)} <span className="text-sm text-stone-500 font-bold">DT</span></span>
            </div>
          </div>

          <div className="bg-[#A37836] rounded-[1.5rem] p-4 shadow-[0_12px_32px_rgba(163,120,54,0.2)] flex flex-col gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Gains</span>
              <span className="text-xl font-black text-white">{totalEarnings.toFixed(3)} <span className="text-sm text-white/80 font-bold">DT</span></span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-white p-1 rounded-full border border-stone-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:text-stone-800'}`}
          >
            Actives ({activeOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'completed' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:text-stone-800'}`}
          >
            Terminées ({completedOrders.length})
          </button>
        </div>

        {/* Order Feed mapped strictly with LivreurOrder type */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {activeTab === 'active' && (
              <motion.div key="active-feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                {activeOrders.length === 0 ? (
                  <div className="text-center py-10 text-stone-400 text-sm font-semibold">Aucune commande en cours</div>
                ) : (
                  activeOrders.map((order: LivreurOrder) => (
                    <motion.div key={order.id} whileTap={{ scale: 0.98 }} className="bg-white rounded-[1.5rem] p-4 border border-stone-100 shadow-[0_8px_24px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100">
                            <span className="text-xs font-black text-stone-800">#{order.id.slice(0, 4)}</span>
                          </div>
                          <span className="text-[10px] font-black text-[#A37836] uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100/50">
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="font-black text-stone-900">{order.total_amount.toFixed(3)} DT</span>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="text-sm font-bold text-stone-700 leading-tight">
                          {order.address_spec || 'Adresse non spécifiée'}
                        </span>
                      </div>

                      <button className="w-full py-3.5 rounded-xl bg-stone-900 text-white text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors">
                        Ouvrir la carte <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'completed' && (
              <motion.div key="completed-feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                {completedOrders.length === 0 ? (
                  <div className="text-center py-10 text-stone-400 text-sm font-semibold">Aucune commande terminée</div>
                ) : (
                  completedOrders.map((order: LivreurOrder) => (
                    <motion.div key={order.id} className="bg-white rounded-[1.5rem] p-4 border border-stone-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex flex-col gap-3 opacity-75">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" strokeWidth={2} />
                          <span className="text-[11px] font-black text-stone-900 uppercase tracking-widest">#{order.id.slice(0, 4)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-stone-500">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-bold">Livrée</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center bg-stone-50 rounded-lg p-2.5 border border-stone-100 mt-1">
                         <span className="text-xs font-bold text-stone-500">Frais de livraison</span>
                         <span className="text-sm font-black text-stone-900">+{order.delivery_fee.toFixed(3)} DT</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
});

LivreurDashboard.displayName = 'LivreurDashboard';
export default LivreurDashboard;
