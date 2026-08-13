import React from 'react';
import { Partner } from '../../types';

interface RestaurantCardProps {
  partner: Partner;
  onClick?: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ partner, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 p-3 flex gap-3 items-center cursor-pointer hover:shadow-md transition-shadow"
    >
      <img
        src={partner.logo || partner.cover || 'https://via.placeholder.com/80'}
        alt={partner.name}
        className="w-16 h-16 rounded-xl object-cover bg-slate-100"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-slate-900 text-xs truncate">{partner.name}</h4>
        <p className="text-[10px] text-slate-500 truncate mt-0.5">{partner.address || 'Tunisie'}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
            ⭐ {partner.rating ? partner.rating.toFixed(1) : '5.0'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
