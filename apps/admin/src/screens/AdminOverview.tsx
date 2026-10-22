import React, { useState, useEffect } from 'react';
import { AlertOctagon, Zap, Activity, Lock, Store, MessageSquare, ShieldAlert, Sliders } from 'lucide-react';
import { useAdminStore } from '../stores/useAdminStore';
import ClotureModal from '../components/ClotureModal';
import LiveRadarMap from '../components/LiveRadarMap';
import PartnersModal from '../components/PartnersModal';
import IncidentsModal from '../components/IncidentsModal';
import HeaderGovernance from '../components/HeaderGovernance';
import KpiCard from '../components/KpiCard';
import LiveOrdersQueue from '../components/LiveOrdersQueue';

export default function AdminOverview() {
  const {
    sosAlert, triggerSos,
    isAutoDispatchActive, toggleAutoDispatch,
    setupRealtimeSubscription
  } = useAdminStore();

  const [showClotureModal, setShowClotureModal] = useState(false);
  const [showPartnersModal, setShowPartnersModal] = useState(false);
  const [showIncidentsModal, setShowIncidentsModal] = useState(false);

  // 🚀 تفعيل عصب الاستماع (الرادار) بمجرد فتح الشاشة
  useEffect(() => {
    console.log('[AdminOverview] Démarrage du radar en temps réel...');
    const unsubscribe = setupRealtimeSubscription();
    
    // إيقاف الرادار عند إغلاق الشاشة لتوفير الموارد
    return () => {
      console.log('[AdminOverview] Arrêt du radar.');
      if (unsubscribe) unsubscribe();
    };
  }, [setupRealtimeSubscription]);

  return (
    <div className="min-h-screen bg-[#E9EBEF] flex flex-col font-sans pb-28 select-none antialiased p-4 md:p-6 lg:max-w-6xl lg:mx-auto w-full gap-6">

      {showClotureModal && <ClotureModal onClose={() => setShowClotureModal(false)} />}
      {showPartnersModal && <PartnersModal onClose={() => setShowPartnersModal(false)} />}
      {showIncidentsModal && <IncidentsModal onClose={() => setShowIncidentsModal(false)} />}

      <HeaderGovernance />

      {/* CONTROLES RAPIDES */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={toggleAutoDispatch}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${
            isAutoDispatchActive
              ? 'bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] border border-white/40'
              : 'bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] border border-transparent'
          }`}
        >
          <Zap className={`w-4 h-4 ${isAutoDispatchActive ? 'text-emerald-500 animate-pulse' : 'text-amber-500'}`} />
          <span className={`text-[11px] font-black uppercase tracking-widest ${isAutoDispatchActive ? 'text-emerald-700' : 'text-stone-800'}`}>
            {isAutoDispatchActive ? 'Dispatch Actif' : 'Auto-Dispatch'}
          </span>
        </button>

        <button className="flex-1 min-w-[140px] bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] py-3 px-4 rounded-2xl flex items-center justify-center gap-2 border border-white/40">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">Réseau Actif</span>
        </button>

        <button
          onClick={() => triggerSos(!sosAlert)}
          className={`flex-[2] min-w-[200px] py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${
            sosAlert
            ? 'bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] text-rose-600 border border-rose-200'
            : 'bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] text-rose-500 hover:text-rose-600'
          }`}
        >
          <AlertOctagon className={`w-4 h-4 ${sosAlert ? 'animate-pulse' : ''}`} />
          <span className="text-[11px] font-black uppercase tracking-widest">
            {sosAlert ? 'ALERTE SOS DÉCLENCHÉE' : 'SOS URGENCE / TERRAIN'}
          </span>
        </button>
      </div>

      <KpiCard />

      {/* MODULE DE GESTION OPÉRATIONNELLE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => setShowPartnersModal(true)} className="bg-[#E9EBEF] p-4 rounded-2xl shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] flex items-center justify-between border border-white/50 transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E9EBEF] shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center"><Store className="w-4 h-4 text-blue-600" /></div>
            <span className="text-[11px] font-black text-stone-800 uppercase tracking-widest">Partenaires</span>
          </div>
          <Sliders className="w-4 h-4 text-stone-400 group-hover:text-blue-500 transition-colors" />
        </button>

        <button onClick={() => alert("Module MSG en cours de construction")} className="bg-[#E9EBEF] p-4 rounded-2xl shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] flex items-center justify-between border border-white/50 transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E9EBEF] shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center"><MessageSquare className="w-4 h-4 text-indigo-500" /></div>
            <span className="text-[11px] font-black text-stone-800 uppercase tracking-widest">Diffusion (MSG)</span>
          </div>
        </button>

        <button onClick={() => setShowIncidentsModal(true)} className="bg-[#E9EBEF] p-4 rounded-2xl shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] flex items-center justify-between border border-white/50 transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E9EBEF] shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center"><ShieldAlert className="w-4 h-4 text-rose-600" /></div>
            <span className="text-[11px] font-black text-rose-700 uppercase tracking-widest">Réclamations</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
        </button>
      </div>

      {/* الخريطة + رادار الطلبات المتعثرة */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#E9EBEF] p-5 rounded-[2rem] shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] border border-white/40 flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Couverture SIG / Carte en Direct</span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Synchronisé</span>
          </div>
          <div className="flex-1 min-h-[350px] p-1 rounded-2xl bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] border border-white/30 relative">
            <LiveRadarMap />
          </div>
        </div>

        {/* الميزة الاحترافية الجديدة بدلاً من الإشعارات */}
        <LiveOrdersQueue />
      </div>

      <button
        onClick={() => setShowClotureModal(true)}
        className="mt-2 w-full bg-[#E9EBEF] shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 border border-white/50"
      >
        <Lock className="w-5 h-5 text-emerald-700" />
        <span className="text-[12px] font-black text-stone-800 uppercase tracking-widest">Clôture de Session & Réconciliation Caisse</span>
      </button>

    </div>
  );
}
