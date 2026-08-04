import React from 'react';

export const MapContainer: React.FC = () => {
  return (
    <div className="relative p-4 bg-[#090b10] border border-[#1e293b] rounded-xl min-h-[260px] overflow-hidden flex flex-col justify-between">
      {/* Visual Vector Grid Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* Simulated Tunis Map Nodes */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-blue-950/80 border border-blue-500/30 px-2.5 py-1 rounded-full backdrop-blur">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
        <span className="text-[10px] text-blue-200 font-mono">Hub Tunis-Centre (Active)</span>
      </div>

      <div className="absolute bottom-1/4 left-1/3 flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full backdrop-blur">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-[9px] text-emerald-200 font-mono">Livreur #024 (En Route)</span>
      </div>

      {/* Header Info Bar */}
      <div className="relative z-10 flex justify-between items-center text-[10px] text-slate-400 font-mono">
        <span>COUVERTURE SIG / CARTE EN DIRECT</span>
        <span>SIG MAPBOX — FLUX VECTORIEL SOMBRE</span>
      </div>

      {/* Footer Info Bar */}
      <div className="relative z-10 flex justify-between items-end text-[10px] text-slate-500 font-mono">
        <span>Secteur: Grand Tunis & Banlieue Nord</span>
        <span>24 Nodes Synchronisés</span>
      </div>
    </div>
  );
};
