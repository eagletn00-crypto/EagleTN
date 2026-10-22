import React, { useState, useEffect } from 'react';

export default function HeaderGovernance() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('fr-FR');

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#E9EBEF] p-4 rounded-2xl shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] border border-white/40">
      
      {/* BRANDING & IDENTITY */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stone-800 to-stone-900 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.2),4px_4px_8px_#c8cad0] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/20 animate-pulse"></div>
          <span className="text-white font-black text-xl tracking-tighter relative z-10">E</span>
        </div>
        <div>
          <h1 className="text-xl font-black text-stone-800 tracking-tighter uppercase leading-none">
            EAGLE <span className="text-emerald-600">TN</span>
          </h1>
          <p className="text-[9px] font-bold text-stone-500 uppercase tracking-[0.2em] mt-1">
            Commandement Logistique
          </p>
        </div>
      </div>

      {/* SYSTEM HEALTH & USER PROFILE */}
      <div className="flex items-center gap-4">
        {/* Ping Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E9EBEF] shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] border border-white/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-[9px] font-black text-stone-600 uppercase tracking-widest">Sys: 24ms</span>
        </div>

        {/* Time & Zone */}
        <div className="hidden md:flex flex-col items-end border-r border-stone-300/50 pr-4">
          <span className="text-sm font-black text-stone-800">{timeString}</span>
          <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Secteur: Grand Tunis</span>
        </div>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-stone-800 uppercase tracking-widest">Superviseur</p>
            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">HQ_Admin_01</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] group-active:shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center border border-white/50 transition-all">
            <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center">
              <span className="text-white text-xs font-black">HQ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
