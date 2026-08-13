import React, { useState } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ src, alt, className = '' }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-slate-200/50 ${className}`}>
      <div
        className={`absolute inset-0 bg-slate-300 animate-pulse transition-opacity duration-500 ${
          loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out transform-gpu ${
          loaded ? 'scale-100 blur-0 opacity-100' : 'scale-105 blur-md opacity-0'
        }`}
      />
    </div>
  );
};

interface PartnerCard3DProps {
  title: string;
  cuisine: string;
  badge: string;
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  deliveryFee: string;
  imageUrl: string;
  onClick: () => void;
}

export const PartnerCard3D: React.FC<PartnerCard3DProps> = React.memo(({
  title,
  cuisine,
  badge,
  rating,
  reviewsCount,
  deliveryTime,
  deliveryFee,
  imageUrl,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className="group relative w-72 sm:w-80 flex-shrink-0 rounded-[32px] p-2 bg-white/40 border border-white/60 backdrop-blur-2xl shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-amber-500/10 active:scale-[0.98] transition-all duration-300 cursor-pointer transform-gpu snap-start"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-[34px] blur-lg opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

      <div className="relative h-44 w-full rounded-[26px] overflow-hidden shadow-inner">
        <ProgressiveImage src={imageUrl} alt={title} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <span className="bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[9px] font-black px-3 py-1 rounded-full tracking-wider uppercase shadow-md">
            👑 {badge}
          </span>
          <span className="bg-white/90 backdrop-blur-md text-slate-950 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            ⭐ {rating} <span className="text-[9px] font-normal text-slate-600">({reviewsCount})</span>
          </span>
        </div>
      </div>

      <div className="p-3.5 relative z-10">
        <h3 className="text-sm font-black text-slate-900 tracking-tight truncate">{title}</h3>
        <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">{cuisine}</p>

        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-200/50 text-[11px] font-extrabold text-slate-800">
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{deliveryTime}</span>
          </div>
          <div className="bg-amber-100/80 border border-amber-200/60 px-2.5 py-0.5 rounded-full text-amber-950 font-black">
            🛵 {deliveryFee}
          </div>
        </div>
      </div>
    </div>
  );
});
