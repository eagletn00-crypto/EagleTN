import React, { useState, useEffect } from 'react';
import { Star, Clock, MapPin, ShieldAlert, ArrowUpRight, Flame } from 'lucide-react';

interface MenuItem {
  id: string;
  partner_id: string;
  title: string;
  price: number;
  is_available: boolean;
}

export default function PremiumMerchantCard() {
  const TARGET_PARTNER_UUID = "7ee8b022-f38b-4b21-8848-bfb81f185da1";
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Structural Mock Defense Layer simulation ensuring zero white screens while keeping actual DB structural fields intact
    const simulateDatabaseFetch = setTimeout(() => {
      const liveProductionPayload: MenuItem[] = [
        { id: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed", partner_id: TARGET_PARTNER_UUID, title: "Kafteji Tunisien Traditionnel", price: 8500, is_available: true },
        { id: "2b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bee", partner_id: TARGET_PARTNER_UUID, title: "Plat Escalope Pané Complet", price: 14000, is_available: true },
        { id: "3b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bef", partner_id: TARGET_PARTNER_UUID, title: "Sandwich Mlawi Spécial", price: 6500, is_available: false }
      ];
      setMenuItems(liveProductionPayload);
      setLoading(false);
    }, 1200);

    return () => clearTimeout(simulateDatabaseFetch);
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-sm bg-[#1E2538] border border-white/5 rounded-2xl p-4 animate-pulse">
        <div className="w-full h-48 bg-slate-800 rounded-xl mb-4"></div>
        <div className="h-5 bg-slate-800 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-slate-800 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-800 rounded w-full"></div>
          <div className="h-3 bg-slate-800 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm bg-[#1E2538] border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/10 group flex flex-col justify-between">
      
      {/* Aspect Ratio Imagery Zoom Controller Layer */}
      <div className="relative w-full h-48 overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80" 
          alt="Am Ali Cover Image" 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E2538] via-transparent to-transparent"></div>
        
        {/* Glassmorphic Badges Overlay Context */}
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-[11px] font-mono font-bold text-white">4.9</span>
        </div>

        <div className="absolute top-3 right-3 bg-red-500/20 backdrop-blur-md px-2.5 py-1 rounded-md border border-red-500/30 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-red-400" />
          <span className="text-[10px] font-bold text-red-300 tracking-wide uppercase">Populaire</span>
        </div>
      </div>

      {/* Info Core Body Row Stack */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-100 tracking-wide">Chez Am Ali (Tunis)</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Cuisine Tunisienne Authentique & Grillades</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">2.4 km</span>
              <span className="text-[9px] font-medium text-slate-500 mt-1">Livr. ~25 min</span>
            </div>
          </div>

          {/* Supabase Core Menu Rows Mapping Integration */}
          <div className="mt-5 pt-4 border-t border-white/5 space-y-2.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">Menu en Direct</span>
            
            {menuItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs py-1">
                <span className={`font-medium ${item.is_available ? 'text-slate-300' : 'text-slate-500 line-through'}`}>
                  {item.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 font-bold">{(item.price / 1000).toFixed(3)} DT</span>
                  {!item.is_available && (
                    <span className="text-[8px] bg-white/5 text-slate-500 font-bold px-1.5 py-0.5 rounded">Épuisé</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Anchor Row Footnote */}
        <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-600">ID: {TARGET_PARTNER_UUID.substring(0, 8)}...</span>
          <button className="text-xs font-bold text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl transition-all flex items-center gap-1 group/btn shadow-[0_4px_12px_rgba(220,38,38,0.2)]">
            <span>Commander</span>
            <ArrowUpRight className="w-3.5 h-3.5 transform transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
