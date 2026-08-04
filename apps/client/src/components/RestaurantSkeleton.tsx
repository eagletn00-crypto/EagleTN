import React from 'react';

export default function RestaurantSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-[20px] overflow-hidden shadow-2xs w-full flex flex-col animate-pulse">
      {/* Simulation d'image haute fidélité */}
      <div className="h-40 w-full bg-slate-200 relative overflow-hidden">
        <div className="absolute top-3 left-3 w-16 h-4 bg-slate-300 rounded-md" />
        <div className="absolute top-3 right-3 w-12 h-6 bg-slate-300 rounded-xl" />
      </div>

      {/* Conteneur de métadonnées textuelles */}
      <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-slate-300 rounded-md w-2/3" />
          <div className="h-3 bg-slate-200 rounded-md w-1/3" />
        </div>

        {/* Ligne technique basse */}
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
          <div className="h-3 bg-slate-200 rounded-md w-12" />
          <div className="h-3 bg-slate-200 rounded-md w-10" />
          <div className="h-3 bg-slate-200 rounded-md w-14" />
          <div className="h-5 bg-slate-300 rounded-md w-16" />
        </div>
      </div>
    </div>
  );
}
