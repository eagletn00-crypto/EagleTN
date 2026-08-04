import React from 'react';
import { MapPin, User } from 'lucide-react';

export default function ClientHeader() {
  return (
    <div className="flex items-center justify-between p-4 bg-white">
      <div className="flex flex-col">
        <div className="flex items-center gap-1 text-[#00B074] text-[10px] font-bold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Tunis, Tunisie</span>
        </div>
        <h1 className="text-sm font-black text-slate-800 tracking-tight mt-0.5">
          Bonjour, <span className="text-slate-400 font-medium">Client Eagle</span>
        </h1>
      </div>
      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center cursor-pointer">
        <User className="w-4 h-4 text-slate-600" />
      </div>
    </div>
  );
}
