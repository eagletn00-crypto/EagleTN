import React, { useState, useEffect } from 'react';
import { Navigation, ShieldCheck, MapPin, Search, Activity, Compass } from 'lucide-react';

interface ClientCoordinates {
  lat: number;
  lng: number;
  accuracy: number | null;
  addressString: string;
}

export default function InteractiveHeroMap() {
  const [coordinates, setCoordinates] = useState<ClientCoordinates>({
    lat: 36.8065,
    lng: 10.1815,
    accuracy: null,
    addressString: "📍 Tunis Centre (Position Estimée)",
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [systemStatus, setSystemStatus] = useState<string>("ACTIVE");

  useEffect(() => {
    const intervals = ["OPTIMAL", "SECURE", "LIVE TRACKING"];
    const timer = setInterval(() => {
      const randomStatus = intervals[Math.floor(Math.random() * intervals.length)];
      setSystemStatus(randomStatus);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleGeolocationTrigger = (): void => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          addressString: `⚡ Précision GPS: ±${Math.round(position.coords.accuracy)}m`,
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation mapping halted:", error);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  return (
    <div className="relative w-full bg-[#0B0F19] overflow-hidden border-b border-white/5">
      {/* Premium Top Navigation Row */}
      <div className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-30">
        <div className="flex items-center gap-3 group select-none">
          <div className="relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-red-600 to-red-900 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] border border-red-500/30 transform transition-transform duration-500 group-hover:rotate-12">
            <span className="text-white font-black text-xl tracking-tighter">E</span>
            <div className="absolute -inset-1 bg-red-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white font-mono">
              EAGLE<span className="text-red-500 animate-pulse">.TN</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-slate-500 font-bold -mt-1">Digital Ecosystem</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 bg-[#1E2538]/60 backdrop-blur-md border border-white/5 px-4 py-1.5 rounded-full">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-slate-400 font-mono tracking-wider">SYSTEM NODE: {systemStatus}</span>
        </div>
      </div>

      {/* Hero Vector Radar Map Backplane */}
      <div className="relative h-[480px] w-full bg-[#0d1220] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-60"></div>
        
        {/* Radar Scanning Rings */}
        <div className="absolute w-[600px] h-[600px] border border-white/5 rounded-full animate-[ping_10s_infinite] opacity-25 pointer-events-none"></div>
        <div className="absolute w-[400px] h-[400px] border border-red-500/5 rounded-full animate-[ping_7s_infinite] opacity-40 pointer-events-none"></div>
        <div className="absolute w-[200px] h-[200px] border border-white/5 rounded-full pointer-events-none"></div>
        
        {/* Dynamic Client Anchor Pin */}
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 z-10 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-red-500/20 rounded-full animate-ping pointer-events-none"></div>
            <div className="absolute w-32 h-32 bg-red-500/5 rounded-full animate-[pulse_3s_infinite] pointer-events-none"></div>
            <div className="w-10 h-10 bg-gradient-to-b from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] border border-red-400/40 transform transition-transform duration-300 hover:scale-110">
              <Compass className={`w-5 h-5 text-white ${isLocating ? 'animate-spin' : ''}`} />
            </div>
          </div>
          <div className="mt-3 bg-slate-900/90 backdrop-blur-md border border-white/10 px-3 py-1 rounded-md shadow-xl text-[11px] font-mono font-medium text-slate-200 tracking-wide whitespace-nowrap">
            {coordinates.addressString}
          </div>
        </div>

        {/* Unified Glassmorphic Flight Control Engine */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-20">
          <div className="bg-[#141b2d]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un plat, restaurant ou pharmacie proche..."
                  className="w-full bg-[#0d1322] border border-white/5 text-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 font-medium placeholder-slate-500 transition-all"
                />
              </div>
              <button 
                onClick={handleGeolocationTrigger}
                disabled={isLocating}
                className="bg-[#1e273e] hover:bg-[#283352] active:bg-[#182033] text-slate-200 px-5 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-white/5 transition-all duration-200 group whitespace-nowrap disabled:opacity-50"
              >
                <Navigation className={`w-4 h-4 text-red-500 transition-transform group-hover:-translate-y-0.5 ${isLocating ? 'animate-bounce' : ''}`} />
                <span>Localiser mon drone</span>
              </button>
            </div>

            {/* Hardware Accelerated Ticker Infrastructure */}
            <div className="mt-3 overflow-hidden relative w-full h-5 flex items-center">
              <div className="absolute flex gap-8 animate-[marquee_25s_linear_infinite] whitespace-nowrap text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                <span>⚡ Hyper-Logistique Tunisienne</span>
                <span className="text-red-400">● Fin de l'attente traditionnelle</span>
                <span>⚡ Flotte Algorithmique Optimisée</span>
                <span className="text-red-400">● Routage en temps réel activé</span>
                <span>⚡ Partenaires Vérifiés INP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
