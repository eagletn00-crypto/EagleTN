import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../stores/useAdminStore';

export const HeaderGovernance: React.FC = () => {
  const { 
    selectedZone, 
    setSelectedZone, 
    manualMode, 
    toggleManualMode, 
    systemPaused, 
    toggleSystemPause,
    sosAlert,
    triggerSos
  } = useAdminStore();

  const [time, setTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('fr-TN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-[#1e293b] pb-4 space-y-3">
      {/* Upper Sovereign Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black text-white tracking-wider uppercase">
              Central de Commandement Logistique
            </h1>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
              HQ — Tunis (GMT+1)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestion des Opérations & Flux de Trésorerie — <span className="font-mono text-slate-300">{time || '14:30:00'}</span>
          </p>
        </div>

        {/* License & License Tag */}
        <div className="flex items-center gap-3">
          <select 
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="bg-[#11151e] border border-[#2e3b52] text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="Grand Tunis">Secteur: Grand Tunis</option>
            <option value="Sfax Centre">Secteur: Sfax Centre</option>
            <option value="Sousse Sahel">Secteur: Sousse Sahel</option>
          </select>

          <span className="text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md">
            Licence Entreprise v2.5.0-PRO
          </span>
        </div>
      </div>

      {/* Real-time Toggles & Danger Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 bg-[#0c0e14] p-2.5 rounded-lg border border-[#1e293b]">
        <div className="flex items-center gap-3">
          {/* Manual Dispatch Toggle */}
          <button
            onClick={toggleManualMode}
            className={`px-3 py-1 text-xs font-bold rounded-md transition flex items-center gap-1.5 ${
              manualMode 
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                : 'bg-[#182030] text-slate-300 hover:bg-[#222c40]'
            }`}
          >
            <span>{manualMode ? '⚙️ Mode Manuel Actif' : '⚡ Auto-Dispatch'}</span>
          </button>

          {/* System Pause Toggle */}
          <button
            onClick={toggleSystemPause}
            className={`px-3 py-1 text-xs font-bold rounded-md transition flex items-center gap-1.5 ${
              systemPaused 
                ? 'bg-purple-600 text-white animate-pulse' 
                : 'bg-[#182030] text-slate-300 hover:bg-[#222c40]'
            }`}
          >
            <span>{systemPaused ? '⏸️ Système en Pause' : '▶️ Réseau Actif'}</span>
          </button>
        </div>

        {/* SOS Alert Button */}
        <button
          onClick={() => triggerSos(!sosAlert)}
          className={`px-3.5 py-1 text-xs font-black rounded-md transition flex items-center gap-2 border ${
            sosAlert 
              ? 'bg-red-600 text-white border-red-400 animate-bounce' 
              : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>🆘 URGENCE / SOS TERRAIN</span>
        </button>
      </div>

      {/* SOS Banner Warning */}
      {sosAlert && (
        <div className="p-3 bg-red-950/80 border-2 border-red-600 text-red-200 text-xs rounded-lg flex justify-between items-center animate-pulse">
          <div className="flex items-center gap-2">
            <span className="font-bold">⚠️ ALERTE SÉCURITÉ CRITIQUE:</span>
            <span>Un livreur a déclenché le signal SOS (Secteur La Marsa). Géolocalisation prioritaire activée.</span>
          </div>
          <button onClick={() => triggerSos(false)} className="underline text-white font-bold text-[11px]">
            Acquitter l'Alerte
          </button>
        </div>
      )}
    </header>
  );
};
