import React from 'react';
import { X } from 'lucide-react';

export interface PromoBannerProps {
  onClose: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onClose }) => {
  return (
    <div className="relative bg-white/80 backdrop-blur-md border border-white/40 rounded-[2rem] p-5 shadow-[5px_5px_15px_rgba(0,0,0,0.03),-5px_-5px_15px_#ffffff] mb-5 overflow-hidden">
      
      {/* Bouton de Fermeture Épuré */}
      <button
        onClick={onClose}
        aria-label="Fermer la promotion"
        className="absolute top-4 right-4 p-1 active:scale-95 transition-transform duration-200"
      >
        <X className="w-4 h-4 text-stone-400 stroke-[2.5]" />
      </button>

      <div className="pr-6 space-y-2.5">
        {/* Texte Principal Français */}
        <div className="space-y-0.5">
          <h3 className="text-[13px] text-stone-800 font-medium tracking-tight leading-snug">
            Eagle TN - Votre destination gourmande.
          </h3>
          <p className="text-[13px] text-stone-600 font-medium tracking-tight">
            La qualité supérieure, le goût local.
          </p>
        </div>

        {/* Slogan Tunisien */}
        <p className="text-base text-[#D97706] font-bold flex items-center gap-1.5">
          <span>بنة عالمية وتوصيل في رمشة عين</span>
          <span className="text-[1.1rem] leading-none mb-0.5">🏍️</span>
        </p>
      </div>
      
    </div>
  );
};

export default PromoBanner;
