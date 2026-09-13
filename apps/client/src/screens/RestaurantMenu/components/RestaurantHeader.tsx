import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, ShieldCheck, Star, Clock, Bike } from 'lucide-react';

interface HeaderProps {
  name: string;
  nameAr?: string;
  rating?: number;
  reviewsCount?: number;
  deliveryTime?: string;
  deliveryFee?: string;
  coverImage?: string;
  isVerified?: boolean;
  onBack?: () => void;
}

export const RestaurantHeader: React.FC<HeaderProps> = ({
  name,
  nameAr,
  rating = 4.9,
  reviewsCount = 142,
  deliveryTime = '15-25 min',
  deliveryFee = '2.500 DT',
  coverImage = '/placeholder-restaurant.jpg',
  isVerified = true,
  onBack,
}) => {
  return (
    <div className="relative w-full bg-slate-900 text-white overflow-hidden rounded-b-[2.5rem] shadow-2xl">
      <div className="relative h-64 w-full">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />
      </div>

      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-10 h-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>

        <div className="flex items-center gap-2">
          {isVerified && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-xl border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>PARTENAIRE VÉRIFIÉ</span>
            </div>
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white shadow-lg"
          >
            <Heart className="w-5 h-5 hover:text-red-500 transition-colors" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white shadow-lg"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="px-5 pb-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl text-slate-900 bg-white"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                {name} {nameAr && <span className="text-emerald-600 font-bold">({nameAr})</span>}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-amber-900">{rating}</span>
                  <span className="text-[10px] text-amber-700">({reviewsCount})</span>
                </div>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-2xl bg-emerald-600 text-white font-black text-sm shadow-md shadow-emerald-600/30">
              {deliveryFee}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-slate-600 text-xs font-medium">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>التوصيل: <strong>{deliveryTime}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Bike className="w-4 h-4 text-emerald-600" />
              <span>تتبع حي ومباشر GPS</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
