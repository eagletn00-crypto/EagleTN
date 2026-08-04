import React from 'react';

interface PartnerCardProps {
  id?: string;
  name?: string;
  location?: string;
  deliveryFee?: string;
  imageUrl?: string;
  rating?: number;
  reviewsCount?: string;
  isVip?: boolean;
  isB2bPlaceholder?: boolean;
  onSelectMenu?: () => void;
  onApplyB2b?: () => void;
}

export default function PartnerCard({
  name = "Am Ali Gastronomie",
  location = "Cité Ibn Khaldoun, Tunis",
  deliveryFee = "2.500 DT",
  imageUrl = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  rating = 4.9,
  reviewsCount = "120+",
  isVip = true,
  isB2bPlaceholder = false,
  onSelectMenu,
  onApplyB2b
}: PartnerCardProps) {

  // 🛡️ B2B PARTNER ACQUISITION CARD (LEGAL & MARKETING HOLDER)
  if (isB2bPlaceholder) {
    return (
      <div className="relative bg-[#121316] rounded-2xl overflow-hidden shadow-md border border-slate-800 p-5 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E63946]/20 border border-[#E63946]/40 text-[#E63946] text-[9px] font-mono font-bold tracking-wider uppercase">
            <span>🚀</span> DEVENIR PARTENAIRE EAGLE.TN
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">
            Vous êtes un restaurant ou une pâtisserie ?
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Rejoignez l'écosystème logistique le plus performant de Tunisie et développez votre chiffre d'affaires dès aujourd'hui.
          </p>

          <button 
            onClick={onApplyB2b}
            className="w-full py-2.5 rounded-xl bg-[#E63946] hover:bg-[#c82d3a] active:scale-[0.98] transition-all text-white font-mono font-bold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2"
          >
            <span>Postuler Maintenant</span>
            <span>→</span>
          </button>
        </div>
      </div>
    );
  }

  // 📐 REAL CERTIFIED PARTNER CARD WITH SMART ROW DISTRIBUTION
  return (
    <div className="group relative bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* 🖼️ FOOD IMAGE CANVAS */}
      <div className="relative w-full h-44 overflow-hidden bg-slate-100">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isVip && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-gray-200 shadow-sm text-[9px] font-mono font-bold text-[#E63946] uppercase flex items-center gap-1">
            <span>👑</span> VIP PARTNER
          </div>
        )}
      </div>

      {/* 📄 SMART INFORMATION LAYOUT */}
      <div className="p-3.5 space-y-2.5">
        
        {/* ROW 1: PARTNER NAME & RATING */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#121316] truncate max-w-[200px]">
            {name}
          </h3>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono font-bold text-amber-700">
            <span>⭐</span>
            <span>{rating}</span>
            <span className="text-[10px] text-amber-600/80 font-normal">({reviewsCount})</span>
          </div>
        </div>

        {/* ROW 2: MAP GREEN LOCATION & LOGISTICS FEE */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <div className="flex items-center gap-1 text-[#2ECC71] font-medium truncate max-w-[210px]">
            <span>📍</span>
            <span className="truncate">{location}</span>
          </div>

          <div className="text-right shrink-0">
            <span className="font-mono font-bold text-[#121316] text-xs">
              🛵 {deliveryFee}
            </span>
          </div>
        </div>

        {/* ROW 3: ACTION DIGITAL MENU BUTTON */}
        <button 
          onClick={onSelectMenu}
          className="w-full mt-1 py-2 rounded-xl bg-[#FAF9F6] hover:bg-white border border-[#EAEAEA] hover:border-[#E63946]/40 active:scale-[0.98] transition-all text-[#121316] hover:text-[#E63946] font-mono font-bold text-[10px] tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-2xl"
        >
          <span>🧾</span>
          <span>VOIR LE MENU DIGITAL</span>
        </button>

      </div>

    </div>
  );
}
