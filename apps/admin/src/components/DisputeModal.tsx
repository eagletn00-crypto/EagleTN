import React from 'react';
import { useAdminStore } from '../stores/useAdminStore';

export const DisputeModal: React.FC = () => {
  const { disputes, freezeDriverAccount, reassignOrderAction } = useAdminStore();

  if (disputes.length === 0) return null;

  return (
    <div className="p-4 bg-[#161a23] border border-red-500/40 rounded-xl shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-black text-red-400 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          Cellule de Crise — Litiges en Cours
        </h3>
        <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-mono">
          {disputes.length} ALERTES ACTIVES
        </span>
      </div>

      <div className="space-y-2.5">
        {disputes.map((item) => (
          <div key={item.id} className="p-3 bg-[#0c0e14] border border-[#232d3f] rounded-lg flex flex-wrap justify-between items-center gap-2">
            <div>
              <div className="text-xs text-white font-bold flex items-center gap-2">
                <span>{item.driverName} <span className="text-slate-500 font-mono">({item.driverId})</span></span>
                <span className="text-slate-600">↔</span>
                <span className="text-slate-300">{item.partnerName}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                <span className="text-amber-400 font-mono font-bold">{item.amount.toFixed(2)} DT</span>
                <span>•</span>
                <span>{item.reason}</span>
                <span>•</span>
                <span className="text-blue-400 font-mono">[{item.zone}]</span>
              </div>
            </div>

            {/* Micro-Actions */}
            <div className="flex items-center gap-1.5">
              <a 
                href={`tel:+21600000000`}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded transition"
              >
                📞 Contacter
              </a>
              <button 
                onClick={() => reassignOrderAction(item.orderId, item.id)}
                className="px-2.5 py-1 bg-blue-600/80 hover:bg-blue-500 text-white text-[11px] font-semibold rounded transition"
              >
                🔄 Réassigner
              </button>
              <button 
                onClick={() => freezeDriverAccount(item.rawDriverId || '', item.id)}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold rounded transition"
              >
                🔒 Gel Compte
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
