import React from 'react';
import { Wallet, Bike, CheckCircle } from 'lucide-react';
import { useAdminStore } from '../stores/useAdminStore';

export default function KpiCard() {
  const { chiffreAffaires, pendingCash, activeDrivers } = useAdminStore();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <div className="bg-[#E9EBEF] p-5 rounded-[2rem] shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] flex flex-col justify-between border border-white/40 min-h-[140px]">
        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5"><Wallet className="w-3 h-3"/> Chiffre d'Affaires</span>
        <h3 className="text-2xl font-black tracking-tighter text-stone-800">{chiffreAffaires.toFixed(3)} DT</h3>
      </div>
      <div className="bg-[#E9EBEF] p-5 rounded-[2rem] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] flex flex-col justify-between border border-white/20 min-h-[140px]">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5">Espèces en Circulation</span>
          <span className="text-[8px] font-black bg-[#E9EBEF] shadow-[2px_2px_4px_#c8cad0,-2px_-2px_4px_#ffffff] text-amber-700 px-2 py-1 rounded-md">Plafond 200 DT</span>
        </div>
        <h3 className="text-2xl font-black tracking-tighter text-amber-600">{pendingCash.toFixed(3)} DT</h3>
      </div>
      <div className="bg-[#E9EBEF] p-5 rounded-[2rem] shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] flex flex-col justify-between border border-white/40 min-h-[140px]">
        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5"><Bike className="w-3 h-3"/> Flotte 🛵 Active</span>
        <h3 className="text-2xl font-black tracking-tighter text-stone-800">{activeDrivers} Actifs</h3>
      </div>
      <div className="bg-[#E9EBEF] p-5 rounded-[2rem] shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] flex flex-col justify-between border border-white/40 min-h-[140px]">
        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5"><CheckCircle className="w-3 h-3"/> Taux de Succès</span>
        <h3 className="text-2xl font-black tracking-tighter text-emerald-600">98.4 %</h3>
      </div>
    </div>
  );
}
