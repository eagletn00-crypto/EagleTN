import React from 'react';
import { Star, Clock } from 'lucide-react';

interface RestaurantCardProps {
  name: string;
  image: string;
  tag?: string;
  rating?: number;
  reviewCount?: number;
  deliveryTime?: string;
  deliveryFee?: string | number;
  isOpen?: boolean;
  onClick?: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  name,
  image,
  tag = 'ROI DU HERGMA',
  rating = 4.9,
  reviewCount = 142,
  deliveryTime = '20-30 min',
  deliveryFee = '2.000 DT',
  isOpen = true,
  onClick,
}) => {
  const formatFee = (val: string | number): string => {
    const raw = val.toString().replace(/dt/i, '').trim();
    const parsed = Number(raw);
    if (!isNaN(parsed)) return `${parsed.toFixed(3)} DT`;
    return val.toString().includes('DT') ? val.toString() : `${val} DT`;
  };

  return (
    <div
      onClick={onClick}
      className="relative w-full rounded-[2.2rem] bg-[#E9EBEF] p-1.5 shadow-[6px_6px_16px_#c8cacb,-6px_-6px_16px_#ffffff] cursor-pointer select-none active:scale-[0.99] transition-transform duration-200 mb-5"
    >
      {/* Conteneur Image avec Bord Arrondi Épais */}
      <div className="relative w-full h-56 rounded-[1.8rem] overflow-hidden bg-stone-900">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />

        {/* Badges Supérieurs */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E57E24] text-stone-900 font-black text-[11px] shadow-md tracking-wider">
            <span className="text-xs">👑</span>
            <span className="font-extrabold">{tag}</span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-stone-900 font-black text-xs shadow-md border border-white/60">
            <Star className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308] stroke-none" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-[10px] text-stone-500 font-bold">({reviewCount})</span>
          </div>
        </div>

        {/* Barre d'Informations Inférieure : 3 Capsules Neumorphiques */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-1.5 z-10">
          {/* 1. Temps */}
          <div className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-white font-extrabold text-[11px]">
            <Clock className="w-3.5 h-3.5 text-white/90" />
            <span>{deliveryTime}</span>
          </div>

          {/* 2. Frais */}
          <div className="flex-1 flex items-center justify-center py-2 px-2 rounded-full bg-white/85 backdrop-blur-md text-stone-900 font-black text-[11px] shadow-sm">
            <span>{formatFee(deliveryFee)}</span>
          </div>

          {/* 3. Statut */}
          <div className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-full font-black text-[11px] shadow-sm ${
            isOpen ? 'bg-[#00A86B] text-white' : 'bg-rose-600 text-white'
          }`}>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>{isOpen ? 'OUVERT' : 'FERMÉ'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
