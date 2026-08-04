import React from 'react';
import { Star, Clock, ArrowRight } from 'lucide-react';

export interface PartnerMerchant {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  imageUrl: string;
  isPopular?: boolean;
}

interface UltraMerchantCardProps {
  merchant: PartnerMerchant;
  onSelect: (id: string) => void;
}

export const UltraMerchantCard: React.FC<UltraMerchantCardProps> = ({ merchant, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(merchant.id)}
      className="group bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={merchant.imageUrl}
          alt={merchant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {merchant.isPopular && (
          <span className="absolute top-3 left-3 bg-[#E21A22] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            SÉLECTION EAGLE
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">
              {merchant.name}
            </h3>
            <div className="flex items-center gap-1 bg-[#D4AF37]/10 px-2 py-0.5 rounded-lg text-[#D4AF37] text-xs font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{merchant.rating}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-3">{merchant.category}</p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-gray-300 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{merchant.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#D4AF37]">{merchant.deliveryFee.toFixed(3)} TND</span>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltraMerchantCard;
