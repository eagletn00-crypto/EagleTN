import React from 'react';
import { Wallet } from 'lucide-react';

interface Props {
  cashInHand: number;
  cashLimit: number;
  netEarnings: number;
}

export const WalletTab: React.FC<Props> = ({ cashInHand, cashLimit, netEarnings }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
          <Wallet className="w-5 h-5 text-red-600" /> Gestion Caisse & Solde
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-extrabold text-slate-500 block uppercase">Caisse (Cash)</span>
            <span className="text-xl font-black text-rose-600">{cashInHand.toFixed(3)} DT</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-extrabold text-slate-500 block uppercase">Solde Net</span>
            <span className="text-xl font-black text-emerald-600">{netEarnings.toFixed(3)} DT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
