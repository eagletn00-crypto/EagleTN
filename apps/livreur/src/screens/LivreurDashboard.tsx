import React, { memo, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Package,
  CheckCircle2,
  Navigation,
  Wallet,
  Clock,
  Phone,
  Sparkles,
  FileText,
  History,
  User,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Compass,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// -----------------------------------------------------------------------------
// STRICT TYPE DEFINITIONS
// -----------------------------------------------------------------------------
export interface LivreurOrder {
  readonly id: string;
  readonly status: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled';
  readonly total_amount: number;
  readonly delivery_fee: number;
  readonly address_spec?: string;
  readonly pickup_name?: string;
  readonly customer_phone?: string;
  readonly customer_note?: string;
  readonly created_at?: string;
}

interface DriverWallet {
  current_cash_balance: number;
  total_earnings: number;
  max_cash_threshold: number;
  is_frozen: boolean;
}

interface DriverProfile {
  full_name: string;
  phone: string;
}

type NavTab = 'dashboard' | 'history' | 'finances' | 'account';

// -----------------------------------------------------------------------------
// MAIN DASHBOARD COMPONENT
// -----------------------------------------------------------------------------
const LivreurDashboard: React.FC<{ driverId: string }> = memo(({ driverId }) => {
  const [navTab, setNavTab] = useState<NavTab>('dashboard');
  const [orders, setOrders] = useState<LivreurOrder[]>([]);
  const [wallet, setWallet] = useState<DriverWallet>({
    current_cash_balance: 0,
    total_earnings: 0,
    max_cash_threshold: 200,
    is_frozen: false,
  });
  const [profile, setProfile] = useState<DriverProfile>({
    full_name: 'Coursier Eagle',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!driverId) return;

    const fetchAll = async () => {
      try {
        const [ordersRes, walletRes, profileRes] = await Promise.all([
          supabase
            .from('orders')
            .select('*')
            .eq('driver_id', driverId)
            .order('created_at', { ascending: false }),
          supabase
            .from('wallets')
            .select('current_cash_balance, total_earnings, max_cash_threshold, is_frozen')
            .eq('profile_id', driverId)
            .maybeSingle(),
          supabase
            .from('profiles')
            .select('full_name, phone')
            .eq('id', driverId)
            .maybeSingle(),
        ]);

        if (!ordersRes.error && ordersRes.data) {
          setOrders(ordersRes.data as LivreurOrder[]);
        }
        if (!walletRes.error && walletRes.data) {
          const w = walletRes.data as Record<string, any>;
          setWallet({
            current_cash_balance: Number(w.current_cash_balance ?? 0),
            total_earnings: Number(w.total_earnings ?? 0),
            max_cash_threshold: Number(w.max_cash_threshold ?? 200),
            is_frozen: Boolean(w.is_frozen),
          });
        }
        if (!profileRes.error && profileRes.data) {
          setProfile({
            full_name: profileRes.data.full_name || 'Coursier Eagle',
            phone: profileRes.data.phone || '',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();

    // Realtime subscription for orders & wallet
    const channel = supabase
      .channel(`livreur_${driverId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `driver_id=eq.${driverId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [payload.new as LivreurOrder, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) =>
              prev.map((o) => (o.id === (payload.new as LivreurOrder).id ? (payload.new as LivreurOrder) : o))
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== (payload.old as LivreurOrder).id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'wallets', filter: `profile_id=eq.${driverId}` },
        (payload) => {
          const w = payload.new as any;
          setWallet({
            current_cash_balance: Number(w.current_cash_balance ?? 0),
            total_earnings: Number(w.total_earnings ?? 0),
            max_cash_threshold: Number(w.max_cash_threshold ?? 200),
            is_frozen: Boolean(w.is_frozen),
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId]);

  const activeOrders = useMemo(
    () => orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled'),
    [orders]
  );

  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === 'delivered'),
    [orders]
  );

  const priorityOrder = activeOrders[0] || null;

  const todayEarnings = useMemo(() => {
    const fromOrders = completedOrders.reduce((sum, o) => sum + Number(o.delivery_fee || 0), 0);
    return Math.max(fromOrders, wallet.total_earnings);
  }, [completedOrders, wallet.total_earnings]);

  const handleOrderAction = async (orderId: string, nextStatus: 'accepted' | 'picked_up' | 'delivered' | 'cancelled') => {
    setActionLoading(orderId);
    try {
      await supabase
        .from('orders')
        .update({ status: nextStatus } as never)
        .eq('id', orderId);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="w-full h-[100dvh] flex flex-col items-center justify-center bg-[#FAF9F6] gap-3">
        <div className="w-9 h-9 rounded-full border-2 border-[#E7E2D8] border-t-[#A37836] animate-spin" />
        <span className="text-[11px] font-bold tracking-widest uppercase text-stone-500">
          EAGLE TN · Synchronisation
        </span>
      </div>
    );
  }

  const cashRatio = Math.min(
    100,
    wallet.max_cash_threshold > 0
      ? (wallet.current_cash_balance / wallet.max_cash_threshold) * 100
      : 0
  );

  return (
    <div className="w-full min-h-[100dvh] bg-[#FAF9F6] text-stone-900 flex flex-col antialiased select-none pb-28">
      {/* Top Luxury Header */}
      <header className="w-full px-5 pt-10 pb-4 sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1A3C34] to-[#A37836] flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5 text-white" strokeWidth={1.8} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black tracking-tight text-[#1A3C34]">EAGLE</span>
              <span className="text-xl font-black tracking-tight text-[#B0894F]">TN</span>
            </div>
          </div>

          <button
            onClick={() => setNavTab('account')}
            className="relative w-11 h-11 rounded-full bg-white border border-[#E7E2D8] shadow-sm flex items-center justify-center"
            aria-label="Mon compte"
          >
            <span className="text-sm font-black text-[#1A3C34]">
              {profile.full_name.slice(0, 2).toUpperCase()}
            </span>
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                wallet.is_frozen ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full px-5 flex flex-col gap-4">
        {/* Frozen Account Alert */}
        {wallet.is_frozen && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <div className="text-xs text-rose-800">
              <p className="font-bold">Portefeuille suspendu (Plafond atteint)</p>
              <p className="text-rose-600">Veuillez verser le cash à l&apos;administration pour réactiver.</p>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* TAB 1: TABLEAU DE BORD */}
          {navTab === 'dashboard' && (
            <motion.div
              key="tab-dashboard"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex flex-col gap-4"
            >
              {/* Radar Card */}
              <div className="rounded-[1.5rem] bg-white border border-[#E7E2D8] p-3.5 shadow-[0_6px_20px_rgba(26,60,52,0.03)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#F5EFE2] border border-[#E5D5B5] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#A37836]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-black tracking-wide text-stone-900 uppercase truncate">
                      RADAR DE FLOTTE EAGLE
                    </p>
                    <p className="text-[11px] font-medium text-stone-500 truncate">
                      Grand Tunis : Zone de livraison active
                    </p>
                  </div>
                </div>
                <div className="shrink-0 px-2.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center gap-1.5">
                  <span className="text-[10px] font-black tracking-wider text-[#1A5D48] uppercase">
                    GPS OPTIMISÉ
                  </span>
                  <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                </div>
              </div>

              {/* Performance Split Card */}
              <div className="rounded-[1.5rem] bg-white border border-[#E7E2D8] p-4 shadow-[0_6px_20px_rgba(26,60,52,0.03)]">
                <p className="text-[11px] font-black tracking-widest text-stone-800 uppercase mb-3">
                  VOTRE PERFORMANCE DU JOUR
                </p>
                <div className="grid grid-cols-2 divide-x divide-[#ECE7DD]">
                  <div className="pr-3">
                    <p className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                      GAINS NETS (Aujourd&apos;hui)
                      <Sparkles className="w-3 h-3 text-[#A37836]" />
                    </p>
                    <p className="text-2xl font-black text-[#A37836] mt-1 tracking-tight">
                      {todayEarnings.toFixed(3)} <span className="text-sm font-bold">TND</span>
                    </p>
                  </div>
                  <div className="pl-4">
                    <p className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                      COURSES EFFECTUÉES
                      <Package className="w-3 h-3 text-[#1A3C34]" />
                    </p>
                    <p className="text-2xl font-black text-[#1A3C34] mt-1 tracking-tight">
                      {completedOrders.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Priority Section Header */}
              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] font-black tracking-wider text-stone-800 uppercase">
                  DEMANDE PRIORITAIRE EN ATTENTE
                </p>
                <span className="px-3 py-1 rounded-full bg-white border border-[#E5D5B5] text-[10px] font-bold tracking-wider text-[#8C6830] uppercase shadow-xs">
                  SÉLECTION PREMIUM
                </span>
              </div>

              {/* Priority Order Card OR Radar Standby */}
              {priorityOrder ? (
                <div className="rounded-[1.75rem] bg-white border border-[#E7E2D8] p-4 shadow-[0_10px_28px_rgba(26,60,52,0.05)] space-y-4">
                  {/* Top Row: Status + ID + Estimated Gain */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-[3px] border-[#D4A64A] bg-[#FAF9F6] flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-black text-stone-900 uppercase">
                          {priorityOrder.status === 'pending' ? 'LIVE' : 'ACTIF'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-stone-900">
                            #{priorityOrder.id.slice(0, 7)}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-[10px] font-bold text-stone-600">
                            Espèces
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 font-medium">
                          Total: {Number(priorityOrder.total_amount || 0).toFixed(3)} TND
                        </p>
                      </div>
                    </div>

                    <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-right">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                        GAIN ESTIMÉ :
                      </p>
                      <p className="text-sm font-black text-[#1A5D48]">
                        {Number(priorityOrder.delivery_fee || 0).toFixed(3)} TND
                      </p>
                    </div>
                  </div>

                  {/* Route Block */}
                  <div className="rounded-2xl bg-[#FAF9F6] border border-[#ECE7DD] p-3.5 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D4A64A] mt-1 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black tracking-wider text-[#A37836] uppercase">
                          ENLÈVEMENT
                        </p>
                        <p className="text-xs font-bold text-stone-900">
                          {priorityOrder.pickup_name || 'Partenaire EAGLE TN'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1A3C34] mt-1 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black tracking-wider text-[#1A3C34] uppercase">
                          LIVRAISON
                        </p>
                        <p className="text-xs font-bold text-stone-900">
                          {priorityOrder.address_spec || 'Adresse client confirmée'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Navigation Pills */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={priorityOrder.customer_phone ? `tel:${priorityOrder.customer_phone}` : undefined}
                      className="rounded-full bg-[#FAF9F6] border border-[#E7E2D8] py-2 px-3 flex items-center justify-center gap-2 text-xs font-bold text-stone-800"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#A37836]" />
                      <span>{priorityOrder.customer_phone || 'Client EAGLE'}</span>
                    </a>
                    <div className="rounded-full bg-[#FAF9F6] border border-[#E7E2D8] py-2 px-3 flex items-center justify-center gap-2 text-xs font-bold text-stone-800">
                      <Navigation className="w-3.5 h-3.5 text-[#1A3C34]" />
                      <span>Itinéraire GPS</span>
                    </div>
                  </div>

                  {/* Client Note */}
                  {priorityOrder.customer_note && (
                    <div className="rounded-xl bg-gradient-to-r from-[#E6D3A3] to-[#D4B97B] px-3.5 py-2.5 flex items-center gap-2 text-xs font-bold text-stone-900">
                      <FileText className="w-4 h-4 shrink-0" />
                      <span>Note Client : {priorityOrder.customer_note}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-1 space-y-2">
                    {priorityOrder.status === 'pending' && (
                      <>
                        <button
                          disabled={actionLoading === priorityOrder.id || wallet.is_frozen}
                          onClick={() => handleOrderAction(priorityOrder.id, 'accepted')}
                          className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#B89242] via-[#D4B46A] to-[#B89242] text-stone-950 font-black text-sm tracking-wider uppercase shadow-md active:scale-[0.98] disabled:opacity-50 transition"
                        >
                          {actionLoading === priorityOrder.id ? 'Validation...' : 'ACCEPTER LA COURSE'}
                        </button>
                        <button
                          disabled={actionLoading === priorityOrder.id}
                          onClick={() => handleOrderAction(priorityOrder.id, 'cancelled')}
                          className="w-full py-2 text-center text-xs font-bold tracking-widest text-stone-400 uppercase hover:text-stone-600"
                        >
                          REJETER
                        </button>
                      </>
                    )}

                    {priorityOrder.status === 'accepted' && (
                      <button
                        disabled={actionLoading === priorityOrder.id}
                        onClick={() => handleOrderAction(priorityOrder.id, 'picked_up')}
                        className="w-full py-3.5 rounded-full bg-[#1A3C34] text-white font-black text-sm tracking-wider uppercase shadow-md active:scale-[0.98] transition"
                      >
                        CONFIRMER L&apos;ENLÈVEMENT
                      </button>
                    )}

                    {priorityOrder.status === 'picked_up' && (
                      <button
                        disabled={actionLoading === priorityOrder.id}
                        onClick={() => handleOrderAction(priorityOrder.id, 'delivered')}
                        className="w-full py-3.5 rounded-full bg-emerald-700 text-white font-black text-sm tracking-wider uppercase shadow-md active:scale-[0.98] transition"
                      >
                        CONFIRMER LA LIVRAISON
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-[1.75rem] bg-white border border-[#E7E2D8] p-8 text-center shadow-[0_6px_20px_rgba(26,60,52,0.03)] flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[#F5EFE2] border border-[#E5D5B5] flex items-center justify-center">
                    <Navigation className="w-6 h-6 text-[#A37836]" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-stone-900">Radar actif · En attente</p>
                    <p className="text-xs text-stone-500 mt-1">
                      Aucune course prioritaire assignée pour le moment. Les nouvelles demandes apparaîtront ici en temps réel.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: HISTORIQUE */}
          {navTab === 'history' && (
            <motion.div
              key="tab-history"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-3"
            >
              <p className="text-xs font-black tracking-widest uppercase text-stone-700">
                Historique des courses ({completedOrders.length})
              </p>
              {completedOrders.length === 0 ? (
                <div className="rounded-[1.5rem] bg-white border border-[#E7E2D8] p-8 text-center text-xs font-semibold text-stone-400">
                  Aucune course terminée pour le moment.
                </div>
              ) : (
                completedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl bg-white border border-[#E7E2D8] p-4 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-black text-stone-900">#{order.id.slice(0, 7)}</span>
                      </div>
                      <p className="text-xs text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {order.address_spec || 'Livraison effectuée'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-[#1A3C34]">
                        +{Number(order.delivery_fee || 0).toFixed(3)} TND
                      </p>
                      <p className="text-[10px] text-stone-400 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" /> Livrée
                      </p>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* TAB 3: FINANCES */}
          {navTab === 'finances' && (
            <motion.div
              key="tab-finances"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-4"
            >
              <div className="rounded-[1.5rem] bg-white border border-[#E7E2D8] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-widest uppercase text-stone-700">
                    Caisse Terrain (Espèces)
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      wallet.is_frozen
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {wallet.is_frozen ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                    {wallet.is_frozen ? 'Suspendu' : 'Actif'}
                  </span>
                </div>

                <div>
                  <p className="text-3xl font-black text-stone-900">
                    {wallet.current_cash_balance.toFixed(3)} <span className="text-base text-stone-500">TND</span>
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Plafond autorisé : <strong>{wallet.max_cash_threshold.toFixed(3)} TND</strong>
                  </p>
                </div>

                <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      cashRatio >= 85 ? 'bg-rose-500' : 'bg-[#A37836]'
                    }`}
                    style={{ width: `${cashRatio}%` }}
                  />
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-[#1A3C34] text-white p-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">
                    Gains Cumulés
                  </p>
                  <p className="text-2xl font-black mt-1">
                    {wallet.total_earnings.toFixed(3)} <span className="text-sm font-bold text-white/80">TND</span>
                  </p>
                </div>
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-[#E6D3A3]" />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: MON COMPTE */}
          {navTab === 'account' && (
            <motion.div
              key="tab-account"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-4"
            >
              <div className="rounded-[1.5rem] bg-white border border-[#E7E2D8] p-5 space-y-2">
                <p className="text-base font-black text-stone-900">{profile.full_name}</p>
                {profile.phone && <p className="text-xs font-semibold text-stone-500">{profile.phone}</p>}
                <p className="text-[11px] font-mono text-stone-400">ID: {driverId.slice(0, 14)}...</p>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full py-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter (تسجيل الخروج)</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Luxury Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E7E2D8] px-3 py-2.5 pb-4">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {[
            { id: 'dashboard', label: 'TABLEAU DE BORD', icon: Compass },
            { id: 'history', label: 'HISTORIQUE', icon: History },
            { id: 'finances', label: 'FINANCES', icon: Wallet },
            { id: 'account', label: 'MON COMPTE', icon: User },
          ].map((item) => {
            const Icon = item.icon;
            const active = navTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setNavTab(item.id as NavTab)}
                className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition ${
                  active ? 'text-[#1A3C34]' : 'text-stone-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#A37836]' : 'text-stone-400'}`} strokeWidth={active ? 2.2 : 1.7} />
                <span className="text-[9px] font-black tracking-tight text-center leading-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
});

LivreurDashboard.displayName = 'LivreurDashboard';
export default LivreurDashboard;
