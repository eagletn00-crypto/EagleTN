import React, { useEffect, useState } from 'react';
import { ChevronLeft, Navigation, MessageCircle, Phone, FileText, Send } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export default function LivreurDashboard({ onLogout }: { onLogout: () => void }) {
  const [mission, setMission] = useState<any>(null);

  useEffect(() => {
    const fetchMission = async () => {
      const { data } = await supabase.from('orders').select('*').in('status', ['accepted_livreur', 'route']).order('created_at', { ascending: false }).limit(1).single();
      if (data) setMission(data);
    };
    fetchMission();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-slate-100 font-sans pb-12 select-none">
      {/* Header */}
      <div className="flex justify-between items-center p-5 pt-8">
        <h1 className="text-xl font-black text-white tracking-tight">Suivi en direct</h1>
        <button className="bg-[#004D2D] border border-[#00C853]/30 text-[#00C853] px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#00C853] rounded-full animate-pulse"></span> EN LIGNE
        </button>
      </div>

      <div className="px-5">
        <button onClick={onLogout} className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors mb-4">
          <ChevronLeft size={14} strokeWidth={3} /> RETOUR À LA LISTE
        </button>

        {/* Orange Price Card */}
        <div className="bg-gradient-to-br from-[#FF9800] to-[#FF7000] rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(255,112,0,0.2)] relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <span className="bg-black/80 text-white px-3 py-1.5 rounded-full text-[9px] font-black flex items-center gap-1.5"><Clock size={10} strokeWidth={3}/> REÇU À: {mission ? new Date(mission.created_at).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}) : '14:33'}</span>
            <span className="bg-white/20 text-slate-900 px-2.5 py-1 rounded-lg text-[10px] font-black font-mono">#{mission?.pin_code || 'EB2EFDC8'}</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-1">{(mission?.total_price || 51.000).toFixed(3)} <span className="text-xl font-bold">DT</span></h2>
          <p className="text-[10px] font-black text-slate-900/70 uppercase tracking-widest">Total à encaisser</p>
        </div>

        {/* Map Arc Simulation */}
        <div className="bg-[#151B2B] rounded-[2rem] h-48 mt-6 relative overflow-hidden border border-white/5 shadow-xl flex items-center justify-center">
          <svg className="absolute w-full h-full top-12" viewBox="0 0 100 50" preserveAspectRatio="none">
            <path d="M 15 35 Q 50 -5 85 35" fill="none" stroke="#FF8A00" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
          <div className="absolute left-6 bottom-12 flex flex-col items-center">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-slate-700 z-10 text-sm">🍳</div>
            <span className="text-[8px] font-black text-white bg-black px-2 py-1 rounded mt-1">Chez Am Ali</span>
          </div>
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 text-3xl drop-shadow-[0_0_15px_rgba(255,138,0,0.8)]">🛵</div>
          <div className="absolute right-6 bottom-12 flex flex-col items-center">
            <div className="w-5 h-5 bg-[#EF4444] rounded-full flex items-center justify-center z-10 border-2 border-[#151B2B] shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div>
            <span className="text-[8px] font-black text-black bg-[#FFCA28] px-2 py-1 rounded mt-1">Client VIP</span>
          </div>
          <div className="absolute bottom-4 bg-[#004D2D] border border-[#00C853]/50 text-[#00C853] text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#00C853] rounded-full animate-pulse"></span> GPS ACTIF: CONNECTÉ
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-6">
          <button className="w-full bg-[#1E2538] text-white py-4 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#252D44] transition-colors"><Navigation size={16} className="text-blue-500" strokeWidth={2.5}/> Lancer la navigation GPS</button>
          
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => window.open(`https://wa.me/216${mission?.customer_phone || ''}`, '_blank')} className="bg-[#00C853] text-white py-4 rounded-[1.2rem] text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(0,200,83,0.3)]"><MessageCircle size={14} strokeWidth={2.5}/> WhatsApp Client</button>
            <button className="bg-[#1E2538] text-white py-4 rounded-[1.2rem] text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-[#252D44] transition-colors"><Phone size={14} className="text-blue-500" strokeWidth={2.5}/> WhatsApp Resto</button>
          </div>

          <button className="w-full bg-[#1E2538] text-white py-4 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#252D44] transition-colors"><FileText size={16} className="text-slate-400" strokeWidth={2.5}/> Afficher la facture</button>
          <button className="w-full bg-[#FF8A00] text-slate-950 py-4 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,138,0,0.3)] mt-2"><Send size={16} strokeWidth={2.5}/> Démarrer vers le client</button>
        </div>
      </div>
    </div>
  );
}
