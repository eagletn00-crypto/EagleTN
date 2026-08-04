import React from 'react';
import { Zap, ShieldCheck, Award, Headphones } from 'lucide-react';

export const HeaderTicker: React.FC = () => {
  const tickerItems = [
    { id: 1, text: "LIVRAISON CHIRURGICALE VIA ALGORITHMES SPATIAUX", icon: <Zap className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 2, text: "CONFORMITÉ RIGOUREUSE INPDP & PROTECTION SÉCURISÉE", icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> },
    { id: 3, text: "PARTENAIRES CERTIFIÉS & LICENCES OFFICIELLES DE L'ÉTAT", icon: <Award className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 4, text: "ASSISTANCE SOUVERAINE ET CONCIERGERIE ÉLITE 24/7", icon: <Headphones className="w-3.5 h-3.5 text-blue-500" /> }
  ];

  const duplicatedItems = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="w-full bg-zinc-950 text-white overflow-hidden py-3 border-b border-zinc-900 select-none">
      <div className="w-full max-w-[1920px] mx-auto px-4 flex items-center">
        <div className="relative w-full overflow-hidden flex items-center">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
          
          <div className="flex whitespace-nowrap animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused] gap-16 text-[10px] font-black tracking-widest text-zinc-300 items-center will-change-transform">
            {duplicatedItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderTicker;
