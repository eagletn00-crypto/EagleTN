import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Package, CheckCircle2, Wallet, Clock,
  Sparkles, History, User, LogOut, ShieldAlert, Radio, Compass,
} from 'lucide-react';
import { useLivreurData } from '../hooks/useLivreurData';
import { PriorityOrderCard } from '../components/PriorityOrderCard';
import { FinancesTab } from '../components/FinancesTab';

type NavTab = 'dashboard' | 'history' | 'finances' | 'account';

const LivreurDashboard: React.FC<{ driverId: string }> = memo(({ driverId }) => {
  const [navTab, setNavTab] = useState<NavTab>('dashboard');
  const {
    completedOrders, priorityOrder, wallet, profile,
    todayEarnings, isLoading, actionLoading, updateOrderStatus, signOut,
  } = useLivreurData(driverId);

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

  return (
    <div className="w-full min-h-[100dvh] bg-[#FAF9F6] text-stone-900 flex flex-col antialiased select-none pb-28">
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

      <main className="flex-1 w-full px-5 flex flex-col gap-4">
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
          {navTab === 'dashboard' && (
            <motion.div key="tab-dash" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-col gap-4">
              <div className="rounded-[1.5rem] bg-white border border-[#E7E2D8] p-3.5 shadow-[0_6px_20px_rgba(26,60,52,0.03)] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#F5EFE2] border border-[#E5D5B5] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#A37836]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-black tracking-wide text-stone-900 uppercase truncate">RADAR DE FLOTTE EAGLE</p>
                    <p className="text-[11px] font-medium text-stone-500 truncate">Grand Tunis : Zone de livraison active</p>
                  </div>
                </div>
                <div className="shrink-0 px-2.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center gap-1.5">
                  <span className="text-[10px] font-black tracking-wider text-[#1A5D48] uppercase">GPS OPTIMISÉ</span>
                  <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-white border border-[#E7E2D8] p-4 shadow-[0_6px_20px_rgba(26,60,52,0.03)]">
                <p className="text-[11px] font-black tracking-widest text-stone-800 uppercase mb-3">VOTRE PERFORMANCE DU JOUR</p>
                <div className="grid grid-cols-2 divide-x divide-[#ECE7DD]">
                  <div className="pr-3">
                    <p className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                      GAINS NETS <Sparkles className="w-3 h-3 text-[#A37836]" />
                    </p>
                    <p className="text-2xl font-black text-[#A37836] mt-1 tracking-tight">
                      {todayEarnings.toFixed(3)} <span className="text-sm font-bold">TND</span>
                    </p>
                  </div>
                  <div className="pl-4">
                    <p className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                      COURSES <Package className="w-3 h-3 text-[#1A3C34]" />
                    </p>
                    <p className="text-2xl font-black text-[#1A3C34] mt-1 tracking-tight">{completedOrders.length}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] font-black tracking-wider text-stone-800 uppercase">DEMANDE PRIORITAIRE EN ATTENTE</p>
                <span className="px-3 py-1 rounded-full bg-white border border-[#E5D5B5] text-[10px] font-bold tracking-wider text-[#8C6830] uppercase">
                  SÉLECTION PREMIUM
                </span>
              </div>

              <PriorityOrderCard
                order={priorityOrder}
                isFrozen={wallet.is_frozen}
                actionLoading={actionLoading}
                onAction={updateOrderStatus}
              />
            </motion.div>
          )}

          {navTab === 'history' && (
            <motion.div key="tab-hist" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-3">
              <p className="text-xs font-black tracking-widest uppercase text-stone-700">
                Historique des courses ({completedOrders.length})
              </p>
              {completedOrders.length === 0 ? (
                <div className="rounded-[1.5rem] bg-white border border-[#E7E2D8] p-8 text-center text-xs font-semibold text-stone-400">
                  Aucune course terminée pour le moment.
                </div>
              ) : (
                completedOrders.map((order) => (
                  <div key={order.id} className="rounded-2xl bg-white border border-[#E7E2D8] p-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-black text-stone-900">#{order.id.slice(0, 7)}</span>
                      </div>
                      <p className="text-xs text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {order.address_spec || 'Livraison effectuée'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-[#1A3C34]">+{Number(order.delivery_fee || 0).toFixed(3)} TND</p>
                      <p className="text-[10px] text-stone-400 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" /> Livrée
                      </p>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {navTab === 'finances' && (
            <motion.div key="tab-fin" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              <FinancesTab wallet={wallet} />
            </motion.div>
          )}

          {navTab === 'account' && (
            <motion.div key="tab-acc" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-4">
              <div className="rounded-[1.5rem] bg-white border border-[#E7E2D8] p-5 space-y-2">
                <p className="text-base font-black text-stone-900">{profile.full_name}</p>
                {profile.phone && <p className="text-xs font-semibold text-stone-500">{profile.phone}</p>}
                <p className="text-[11px] font-mono text-stone-400">ID: {driverId.slice(0, 14)}...</p>
              </div>
              <button
                onClick={signOut}
                className="w-full py-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter (تسجيل الخروج)</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

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
                <span className="text-[9px] font-black tracking-tight text-center leading-none">{item.label}</span>
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
