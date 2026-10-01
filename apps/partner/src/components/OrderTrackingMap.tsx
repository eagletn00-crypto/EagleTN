import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';

interface OrderTrackingMapProps {
  customerAddress?: string;
  customerLat?: number;
  customerLng?: number;
}

export const OrderTrackingMap: React.FC<OrderTrackingMapProps> = ({
  customerAddress = 'Cité Ibn Khaldoun, Tunis',
}) => {
  const storeAddress = 'Rue El Gharbi El Issaoui, Cité Ibn Khaldoun, Tunis';

  return (
    <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/60 space-y-2.5">
      <div className="flex items-center justify-between text-[11px] font-black text-slate-700 uppercase tracking-wider">
        <span className="flex items-center gap-1.5 text-emerald-700">
          <Navigation className="w-3.5 h-3.5 text-emerald-600" /> Trajet de Livraison
        </span>
        <span className="bg-emerald-100/80 text-emerald-800 px-2 py-0.5 rounded-lg text-[10px] font-extrabold">
          ~2.4 km (8 min)
        </span>
      </div>

      <div className="space-y-2 relative pl-3 border-l-2 border-dashed border-emerald-300">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0 ring-4 ring-emerald-100" />
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tight">Départ (Cuisine)</p>
            <p className="text-xs font-bold text-slate-800 truncate">{storeAddress}</p>
          </div>
        </div>

        <div className="flex items-start gap-2 pt-1">
          <div className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0 ring-4 ring-rose-100" />
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tight">Destination Client</p>
            <p className="text-xs font-bold text-slate-900 truncate">{customerAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingMap;
