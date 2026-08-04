import React from 'react';
import { ArrowLeft, Star, Clock, ShieldCheck } from 'lucide-react';

export const MenuHeader: React.FC = () => {
  return (
    <div className="w-full bg-white border-b border-[#4a3728]/5 shadow-sm">
      <div className="relative w-full aspect-[16/7] bg-[#faf8f5] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600" 
          alt="Chez Am Ali" 
          className="w-full h-full object-cover opacity-85 contrast-[101%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10" />
      </div>

      <div className="p-5 text-left max-w-xl mx-auto">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-black tracking-tight text-[#1c120c]">Chez Am Ali</h1>
          <ShieldCheck className="w-4 h-4 text-[#9e2a2b] fill-[#9e2a2b]/10" />
        </div>
        <p className="text-[10px] text-[#4a3728]/50 font-medium mt-0.5 uppercase tracking-wider">
          Authentique Cuisine Tunisienne & Escapade Premium
        </p>

        <div className="flex items-center space-x-2 text-[10px] font-mono font-bold mt-3">
          <div className="flex items-center bg-[#faf8f5] text-[#1c120c] px-3 py-1 rounded-full border border-[#4a3728]/5 shadow-sm">
            <Star className="w-3 h-3 text-amber-500 fill-current mr-1" />
            <span>4.9</span>
          </div>
          <div className="flex items-center bg-[#faf8f5] text-[#1c120c] px-3 py-1 rounded-full border border-[#4a3728]/5 shadow-sm">
            <Clock className="w-3 h-3 text-[#4a3728]/60 mr-1" />
            <span>25-35 MIN</span>
          </div>
          <div className="flex items-center bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100/50 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            <span className="text-[9px] uppercase tracking-wider">Disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
};
