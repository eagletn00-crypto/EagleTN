import React from 'react';
import { Flame } from 'lucide-react';

interface Props {
  dailyEarnings: number;
  completedTrips: number;
  targetTrips: number;
  bonusAmount: number;
}

export const PerformanceHeader: React.FC<Props> = ({ dailyEarnings, completedTrips, targetTrips, bonusAmount }) => {
  const progressPercent = Math.min((completedTrips / targetTrips) * 100, 100);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-4 shadow-xl space-y-3 relative overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Gains d'aujourd'hui</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-amber-400">+{dailyEarnings.toFixed(3)}</span>
            <span className="text-xs font-bold text-slate-300">TND</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Courses effectuées</span>
          <span className="text-xl font-black text-white">{completedTrips} Courses</span>
        </div>
      </div>

      <div className="bg-slate-800/90 rounded-2xl p-2.5 border border-slate-700/60 space-y-1.5">
        <div className="flex justify-between items-center text-[11px] font-extrabold">
          <span className="text-amber-300 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-amber-300" /> Prime du jour: +{bonusAmount.toFixed(3)} DT
          </span>
          <span className="text-slate-400">{completedTrips}/{targetTrips} Courses</span>
        </div>
        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-amber-400 h-full rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
