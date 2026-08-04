import React from 'react';

export interface LocalizedName {
  ar?: string;
  fr?: string;
  en?: string;
}

export interface Category {
  id: string;
  name: string | LocalizedName;
  icon?: string;
}

export interface Partner {
  id: string;
  name: string | LocalizedName;
  category: string;
  image?: string;
  rating?: number;
  deliveryTime?: string;
  minOrder?: number;
}

export interface RestaurantCardProps {
  partner?: Partner;
  onClick?: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ partner, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="p-4 bg-[#001A4D]/60 rounded-xl border border-white/10 cursor-pointer hover:border-[#D4AF37] transition-all"
    >
      <h3 className="font-bold text-lg text-white">
        {typeof partner?.name === 'string' ? partner.name : partner?.name?.fr || 'Restaurant'}
      </h3>
      <p className="text-xs text-gray-400 mt-1">{partner?.category || 'General'}</p>
    </div>
  );
};

export default RestaurantCard;
