import React from 'react';
import { Star, Clock, ShoppingBag } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    name_ar?: string;
    image_url?: string;
    cover_url?: string;
    rating: number;
    delivery_time: string;
    is_vip?: boolean;
    is_certified?: boolean;
  };
  onClick?: () => void;
}

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  const defaultImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80";

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="relative h-36 w-full bg-slate-200 overflow-hidden">
        <img
          src={restaurant.cover_url || restaurant.image_url || defaultImage}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {restaurant.is_vip && (
            <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md uppercase tracking-wide">
              👑 VIP Partner
            </span>
          )}
          {restaurant.is_certified && (
            <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md uppercase tracking-wide">
              ✓ Certifié
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-black text-slate-900">{restaurant.rating}</span>
        </div>
      </div>

      <div className="p-3.5 flex items-center justify-between">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm leading-tight">
            {restaurant.name_ar ? `${restaurant.name_ar} - ${restaurant.name}` : restaurant.name}
          </h4>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 font-medium">
            <Clock size={13} className="text-slate-400" />
            <span>{restaurant.delivery_time}</span>
          </div>
        </div>

        <button className="w-10 h-10 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors shadow-sm">
          <ShoppingBag size={18} />
        </button>
      </div>
    </div>
  );
}
