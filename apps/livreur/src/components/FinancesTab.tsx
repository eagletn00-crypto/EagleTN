import React from 'react';
import { Wallet, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { DriverWallet } from '../hooks/useLivreurData';

export const FinancesTab: React.FC<{ wallet: DriverWallet }> = ({ wallet }) => {
  const cashRatio = Math.min(
    100,
    wallet.max_cash_threshold > 0
      ? (wallet.current_cash_balance / wallet.max_cash_threshold) * 100
      : 0
  );

  return (
    <div className="space-y-4">
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
            className={`h-full rounded-full transition-all ${cashRatio >= 85 ? 'bg-rose-500' : 'bg-[#A37836]'}`}
            style={{ width: `${cashRatio}%` }}
          />
        </div>
      </div>

      <div className="rounded-[1.5rem] bg-[#1A3C34] text-white p-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">Gains Cumulés</p>
          <p className="text-2xl font-black mt-1">
            {wallet.total_earnings.toFixed(3)} <span className="text-sm font-bold text-white/80">TND</span>
          </p>
        </div>
        <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-[#E6D3A3]" />
        </div>
      </div>
    </div>
  );
};
