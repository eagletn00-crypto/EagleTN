import React from 'react';

interface Props {
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  clientAddress: string;
}

export const OrderMap: React.FC<Props> = ({
  pickupLat,
  pickupLng,
  dropoffLat,
  dropoffLng,
  clientAddress,
}) => {
  // فتح تطبيق الخرائط الخارجي (Google Maps / Waze) للملاحة الصوتية المباشرة
  const openExternalNavigation = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${dropoffLat},${dropoffLng}&travelmode=bicycling`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-2.5">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-black text-slate-700 flex items-center gap-1">
          🗺️ ITINÉRAIRE GPS
        </span>
        <button
          onClick={openExternalNavigation}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1 transition-all active:scale-95"
        >
          <span>Ouvrir dans Google Maps 📍</span>
        </button>
      </div>

      {/* Embedded OpenStreetMap Preview */}
      <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-200 relative shadow-inner bg-slate-100">
        <iframe
          title="Order Route Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${pickupLng - 0.01}%2C${pickupLat - 0.01}%2C${dropoffLng + 0.01}%2C${dropoffLat + 0.01}&layer=mapnik&marker=${dropoffLat}%2C${dropoffLng}`}
          className="w-full h-full opacity-90 contrast-105"
        ></iframe>
        
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs text-[10px] font-extrabold text-slate-800">
          📍 {clientAddress}
        </div>
      </div>
    </div>
  );
};
