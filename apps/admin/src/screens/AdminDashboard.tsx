import React, { useEffect } from 'react';
import { Shield, Users, Activity, Layers, ArrowUpRight, TrendingUp, Wallet, MapPin } from 'lucide-react';
import { useAdminStore } from '../stores/useAdminStore';

export default function AdminDashboard() {
  // استدعاء البيانات الحية ووظيفة تشغيل الرادار من محرك الإدارة
  const { 
    chiffreAffaires, 
    activeDrivers, 
    activeOrders, 
    activePartners, 
    setupRealtimeSubscription 
  } = useAdminStore();

  // تشغيل الاستماع اللحظي (WebSockets) عند تحميل الشاشة
  useEffect(() => {
    const unsubscribe = setupRealtimeSubscription();
    return () => {
      unsubscribe(); // حماية ميكروسكوبية: إغلاق الاتصال عند مغادرة الشاشة
    };
  }, [setupRealtimeSubscription]);

  // دمج البيانات الحية في واجهة العرض
  const systemMetrics = [
    { label: "Revenus (Aujourd'hui)", value: `${chiffreAffaires.toFixed(3)} DT`, change: "En direct", icon: Wallet, color: "text-emerald-600" },
    { label: "Livreurs Actifs", value: activeDrivers.toString(), change: "Sur le terrain", icon: Users, color: "text-amber-600" },
    { label: "Commandes en Cours", value: activeOrders.toString(), change: "Actives", icon: Activity, color: "text-blue-600" },
    { label: "Partenaires Actifs", value: activePartners.toString(), change: "Aujourd'hui", icon: Layers, color: "text-stone-600" }
  ];

  return (
    <div className="min-h-screen bg-[#E9EBEF] flex flex-col font-sans pb-28 select-none antialiased">
      
      {/* HEADER ULTRA PREMIUM */}
      <header className="px-6 pt-10 pb-6 flex justify-between items-center sticky top-0 z-40 bg-[#E9EBEF]/90 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] flex items-center justify-center border border-white/50">
            <Shield className="w-6 h-6 text-stone-800" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-stone-800 tracking-tight uppercase">Centre de Contrôle</h1>
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-1">Superviseur Global EAGLE</p>
          </div>
        </div>

        {/* مؤشر النبض اللحظي (متصل بقاعدة البيانات) */}
        <button className="w-12 h-12 rounded-full bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center relative transition-all">
          <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
          <Activity className="w-5 h-5 text-emerald-600" />
        </button>
      </header>

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full flex flex-col gap-8">
        
        {/* KPI GRID (مؤشرات الأداء الميدانية) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <TrendingUp className="w-5 h-5 text-emerald-600 animate-pulse" />
            <h2 className="text-sm font-black text-stone-800 uppercase tracking-widest">Performances (Live)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemMetrics.map((metric, idx) => (
              <div key={idx} className="bg-[#E9EBEF] p-5 rounded-[2rem] shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] flex flex-col justify-between border border-white/40 min-h-[160px] transition-all duration-300 hover:shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff]">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center ${metric.color}`}>
                      <metric.icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-stone-800 uppercase tracking-widest leading-tight">{metric.label}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <h3 className={`text-2xl font-black tracking-tighter ${metric.color}`}>{metric.value}</h3>
                  <span className="text-[9px] font-black text-stone-500 bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] px-2.5 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-widest">
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RADAR PLACEHOLDER (مساحة الخريطة) */}
        <div className="bg-[#E9EBEF] p-6 rounded-[2rem] shadow-[inset_6px_6px_12px_#c8cad0,inset_-6px_-6px_12px_#ffffff] border border-white/50 flex flex-col items-center justify-center min-h-[300px] text-center gap-4 mt-4">
          <div className="w-16 h-16 rounded-full bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] flex items-center justify-center relative">
             <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping"></div>
             <MapPin className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-black text-stone-800 uppercase tracking-widest">Radar Global (Connecté)</h3>
            <p className="text-xs font-bold text-stone-400 mt-1">Le système surveille activement la flotte...</p>
          </div>
          <button className="mt-4 bg-[#E9EBEF] shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] text-emerald-700 font-black text-[11px] uppercase tracking-widest py-3 px-6 rounded-2xl transition-all duration-200 flex items-center gap-2">
            Ouvrir la Carte Plein Écran
          </button>
        </div>

      </main>
    </div>
  );
}
