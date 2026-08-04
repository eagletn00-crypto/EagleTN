import React from 'react';
import { Star, Clock, MapPin, ShieldCheck, Crown } from 'lucide-react';

export interface PartnerData {
  id: string;
  name: string;
  category: string;
  rating?: number;
  delivery_time?: string;
  address?: string;
  is_vip?: boolean;
  cover_url?: string;
  is_active?: boolean;
}

interface PartnerProps {
  partner: PartnerData | null;
  loading?: boolean;
}

export default function PartnerProfileCard({ partner, loading }: PartnerProps) {
  if (loading || !partner) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] mx-4 -mt-10 relative z-20 animate-pulse">
        <div className="flex gap-2 mb-3">
          <div className="h-5 w-20 bg-slate-100 rounded-full" />
          <div className="h-5 w-16 bg-slate-100 rounded-full" />
        </div>
        <div className="h-6 w-3/4 bg-slate-100 rounded-md mb-2" />
        <div className="h-4 w-1/2 bg-slate-100 rounded-md mb-4" />
        <div className="flex justify-between pt-3 border-t border-slate-100">
          <div className="h-4 w-12 bg-slate-100 rounded" />
          <div className="h-4 w-16 bg-slate-100 rounded" />
          <div className="h-4 w-20 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  const {
    name,
    category,
    rating = 4.9,
    delivery_time = '20-30 min',
    address = 'Cité Ibn Khaldoun',
    is_vip = true,
  } = partner;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] mx-4 -mt-10 relative z-20">
      <div className="flex items-center gap-2 mb-2">
        {is_vip && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-[9px] font-extrabold tracking-wider text-[#C8102E] uppercase">
            <Crown className="w-2.5 h-2.5 fill-[#C8102E]" /> VIP PARTNER
          </span>
        )}
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-[9px] font-bold tracking-wider text-slate-600 uppercase">
          <ShieldCheck className="w-2.5 h-2.5 text-slate-500" /> CERTIFIÉ
        </span>
      </div>

      <h1 className="text-xl font-black text-slate-900 tracking-tight">
        {name}
      </h1>
      <p className="text-xs font-semibold text-slate-400 mt-0.5">{category}</p>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="font-bold text-slate-900">{rating}</span>
          <span className="text-slate-400 text-[10px]">(500+)</span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{delivery_time}</span>
        </div>

        <div className="flex items-center gap-1 truncate max-w-[120px]">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{address}</span>
        </div>
      </div>
    </div>
  );
}
