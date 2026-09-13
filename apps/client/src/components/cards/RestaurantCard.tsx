import React from 'react';
import { Partner } from '../../types';

interface RestaurantCardProps {
  partner: Partner;
  onClick?: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ partner, onClick }) => {
  return (
    <div onClick={onClick} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs cursor-pointer hover:shadow-md transition-all">
      <img
        src={partner.logo || partner.cover || partner.image || 'https://via.placeholder.com/80'}
        alt={partner.name}
        className="w-full h-32 object-cover rounded-xl"
      />
      <h3 className="font-bold text-slate-900 text-sm mt-2">{partner.name}</h3>
      <p className="text-[10px] text-slate-500 truncate mt-0.5">{partner.address || 'Tunisie'}</p>
    </div>
  );
};
