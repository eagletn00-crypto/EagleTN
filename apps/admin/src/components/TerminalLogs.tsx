import React from 'react';
import { Terminal } from 'lucide-react';

export default function TerminalLogs() {
  return (
    <div className="bg-[#E9EBEF] p-5 rounded-[2rem] shadow-[inset_6px_6px_12px_#c8cad0,inset_-6px_-6px_12px_#ffffff] border border-white/40 flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center px-1">
        <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1.5"><Terminal className="w-4 h-4"/> Flux d'Audit</span>
      </div>
      <div className="flex-1 bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] rounded-xl p-4 font-mono text-[10px] space-y-3 overflow-y-auto border border-white/20">
        <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-start border-b border-stone-300/50 pb-2">
          <span className="text-stone-400">17:58:12</span>
          <span className="text-stone-700 font-bold">DISPUTE_HOLD_PLACED</span>
          <span className="text-stone-500">System_Auto</span>
        </div>
        <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-start border-b border-stone-300/50 pb-2">
          <span className="text-stone-400">17:57:45</span>
          <span className="text-amber-600 font-bold">CASH_THRESHOLD_WARNING</span>
          <span className="text-stone-500">Livreur_42</span>
        </div>
        <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-start border-b border-stone-300/50 pb-2">
          <span className="text-stone-400">17:55:01</span>
          <span className="text-emerald-600 font-bold">HANDSHAKE_OTP_VERIFIED</span>
          <span className="text-stone-500">Partenaire_01</span>
        </div>
      </div>
    </div>
  );
}
