import React from 'react';

export const PromoCarousel: React.FC = () => {
  return (
    <div className="mx-4 my-2 overflow-hidden rounded-[20px] bg-gradient-to-r from-eagle-dark via-red-950 to-eagle-red p-5 border border-white/10 shadow-lg relative">
      <div className="absolute right-0 top-0 opacity-10 font-bold text-7xl text-white pointer-events-none select-none">🦅</div>
      <div className="flex justify-between items-center relative z-10">
        <div>
          <span className="text-[10px] bg-eagle-gold text-eagle-dark font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            VENTE FLASH
          </span>
          <h2 className="text-white font-black text-lg mt-1 tracking-tight leading-tight">
            Kafteji Rush Hour & Grillades
          </h2>
          <p className="text-gray-300 text-xs mt-0.5 font-medium">
            Livraison à 0 DT sur les partenaires certifiés Or.
          </p>
        </div>
        <div className="bg-black/30 backdrop-blur-md px-3 py-2 rounded-xl text-center border border-white/5">
          <p className="text-[9px] text-eagle-gold font-bold uppercase tracking-widest">Temps</p>
          <p className="text-white font-mono font-bold text-sm tracking-widest animate-pulse">14:15</p>
        </div>
      </div>
    </div>
  );
};
