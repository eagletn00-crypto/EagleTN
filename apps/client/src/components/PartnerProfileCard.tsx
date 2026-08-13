import React from 'react';
import { Partner } from '../types/schema';

interface PartnerProfileCardProps {
  partner: Partner;
  onClick?: () => void;
}

export const PartnerProfileCard: React.FC<PartnerProfileCardProps> = ({ partner, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl border border-slate-100 p-4 shadow-md flex gap-4 items-center cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
        <img
          src={partner.cover || partner.logo || 'https://via.placeholder.com/150'}
          alt={partner.name}
          className="w-full h-full object-cover"
        />
        {partner.type && (
          <span className="absolute top-1 left-1 bg-slate-900/80 text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase">
            {partner.type}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-black text-slate-900 text-sm truncate">{partner.name}</h3>
          <span className="text-xs font-black text-slate-800 bg-amber-100 px-2 py-0.5 rounded-md">
            ⭐ {partner.rating.toFixed(1)}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1 truncate">{partner.address || 'Tunisie'}</p>
        <p className="text-xs font-bold text-amber-600 mt-2">📞 {partner.phone || 'Non spécifié'}</p>
      </div>
    </div>
  );
};
