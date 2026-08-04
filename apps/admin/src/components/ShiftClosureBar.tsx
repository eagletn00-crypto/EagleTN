import React from 'react';

export const ShiftClosureBar: React.FC = () => {
  const handleShiftClosure = () => {
    alert('Clôture de Session Réussie! Écart de Caisse = 0.000 DT. Rapport d\'audit généré.');
  };

  return (
    <div className="p-3.5 bg-[#0d1017] border border-[#1e293b] rounded-xl flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Écart de Caisse Théorique</span>
          <span className="text-sm font-mono font-bold text-emerald-400">0.000 DT</span>
        </div>
        <div className="h-6 w-[1px] bg-[#1e293b]" />
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Flotte Active</span>
          <span className="text-xs font-semibold text-slate-200">18 Actifs | 2 Suspendus</span>
        </div>
      </div>

      <button
        onClick={handleShiftClosure}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition border border-emerald-400/30 shadow-lg shadow-emerald-950/50"
      >
        🔒 Clôture de Session & Réconciliation Caisse
      </button>
    </div>
  );
};
