import React from 'react';
import { Navigation, MapPin, Phone, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function DriverTracking() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-mono antialiased max-w-md mx-auto border-x border-zinc-900 shadow-xl flex flex-col justify-between">
      
      {/* Statut Réseau & Profil Énergie Chauffeur */}
      <header className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-xs font-black uppercase tracking-widest">En Ligne (GPS OK)</span>
        </div>
        <span className="text-[10px] font-bold bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded text-zinc-300">ID: COU-890</span>
      </header>

      {/* Bloc Mission Live */}
      <main className="p-4 flex-1 flex flex-col justify-center space-y-4">
        <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <span className="text-xs font-black text-amber-500 tracking-wider">MISSION ATTRIBUÉE</span>
            <span className="text-xs font-bold">#EAG-4091</span>
          </div>

          {/* Étape A : Enlèvement */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-black">A</div>
              <div className="w-0.5 h-10 bg-zinc-800 my-1 border-dashed" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-zinc-400">Enlèvement (Restaurant)</h4>
              <p className="text-xs font-bold text-white mt-0.5">Am Ali (Cité Ibn Khaldoun)</p>
            </div>
          </div>

          {/* Étape B : Livraison */}
          <div className="flex gap-3">
            <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-black">B</div>
            <div>
              <h4 className="text-xs font-black uppercase text-zinc-400">Livraison (Client)</h4>
              <p className="text-xs font-bold text-white mt-0.5">Résidence Les Jasmins, Ennasr 2</p>
            </div>
          </div>
        </div>

        {/* Boutons d'Action Rapides Téléphone / Navigation */}
        <div className="grid grid-cols-2 gap-2">
          <a href="tel:+21650000000" className="bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 text-center flex items-center justify-center gap-2 text-xs font-black uppercase text-zinc-200 no-underline">
            <Phone className="w-4 h-4 text-zinc-400" /> Appeler
          </a>
          <button className="bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 flex items-center justify-center gap-2 text-xs font-black uppercase text-zinc-200 cursor-pointer">
            <Navigation className="w-4 h-4 text-zinc-400" /> Waze / Maps
          </button>
        </div>
      </main>

      {/* Action Principale Majeure (Swipe alternative pour mobile) */}
      <footer className="p-4 bg-zinc-900 border-t border-zinc-800">
        <button className="w-full bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 border-none cursor-pointer">
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirmer l'enlèvement</span>
        </button>
      </footer>

    </div>
  );
}
