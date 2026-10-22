import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { usePartnerDashboardData } from '../../hooks/usePartnerDashboardData';

export default function ParametresTab() {
  const { partner, refreshDashboard } = usePartnerDashboardData();
  const [isOperational, setIsOperational] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);

  useEffect(() => {
    if (partner) {
      setIsOperational(partner.is_active);
    }
  }, [partner]);

  const triggerEmergencyProtocol = async () => {
    if (!partner?.id) return;
    setIsMutating(true);
    
    // Optimistic UI
    setIsOperational(false);

    try {
      const { error } = await supabase
        .from('partners')
        .update({ is_active: false })
        .eq('id', partner.id);

      if (error) throw error;
      
      // Resynchronisation du contexte global
      if (refreshDashboard) refreshDashboard();
    } catch (err) {
      console.error("[EAGLE TN] Échec de la fermeture d'urgence:", err);
      setIsOperational(true); // Rollback
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#E9EBEF] p-4 text-[#2D3142] flex flex-col space-y-8 pb-24">
      <h2 className="text-xl font-black tracking-tight text-stone-800">Contrôle Opérationnel</h2>

      <div className={`w-full p-8 rounded-[2rem] flex flex-col items-center justify-center transition-all duration-500 shadow-[inset_12px_12px_24px_#c8cad0,inset_-12px_-12px_24px_#ffffff] ${
        isOperational ? 'border-t-4 border-emerald-500' : 'border-t-4 border-rose-600'
      }`}>
        <div className="relative mb-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] bg-[#E9EBEF] ${isOperational ? 'text-emerald-500' : 'text-rose-600'}`}>
             {isOperational ? (
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
             ) : (
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             )}
          </div>
          {isOperational && (
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
          )}
        </div>
        <h3 className={`text-xl font-black tracking-widest text-center ${isOperational ? 'text-emerald-700' : 'text-rose-700'}`}>
          {isOperational ? 'BOUTIQUE OUVERTE' : 'FERMETURE D\'URGENCE'}
        </h3>
        <p className="text-xs text-stone-500 font-medium text-center mt-2">
          {isOperational ? 'Votre établissement est visible par les clients.' : 'Votre vitrine est temporairement bloquée.'}
        </p>
      </div>

      <div className="space-y-5 mt-auto">
        <button 
          onClick={triggerEmergencyProtocol}
          disabled={!isOperational || isMutating}
          className={`w-full p-4 rounded-2xl flex items-center justify-center gap-3 font-black text-sm tracking-widest transition-all duration-300 ${
            !isOperational 
              ? 'bg-[#E9EBEF] shadow-[inset_6px_6px_12px_#c8cad0,inset_-6px_-6px_12px_#ffffff] text-stone-400 cursor-not-allowed'
              : 'bg-gradient-to-br from-rose-500 to-red-700 text-white shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] active:scale-95'
          }`}
        >
          {isMutating ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
          )}
          {isMutating ? 'FERMETURE...' : 'COUPER LES COMMANDES'}
        </button>

        <button className="w-full p-4 rounded-2xl bg-[#E9EBEF] shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#c8cad0,inset_-6px_-6px_12px_#ffffff] text-stone-700 flex items-center justify-center gap-3 font-bold text-sm transition-all duration-300">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          LIGNE DIRECTE ASSISTANCE (VOIP)
        </button>
      </div>
    </div>
  );
}
