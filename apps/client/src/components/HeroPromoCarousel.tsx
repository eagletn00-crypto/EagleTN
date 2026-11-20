import React, { memo, useState } from 'react';
import { Tag, Check, Copy, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const PROMOS = [
  { id: 'promo1', tag: 'PRIVILÈGE GOLD', title: 'Livraison Souveraine', desc: "Offerte dès 20 DT d'achat", code: 'EAGLE1' },
  { id: 'promo2', tag: 'ÉDITION LIMITÉE', title: '-20% sur la sélection', desc: 'Partenaires gastronomiques VIP', code: 'TUNIS20' }
];

export const HeroPromoCarousel: React.FC = memo(() => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (e: React.MouseEvent, id: string, code: string) => {
    e.stopPropagation();
    try { await Haptics.impact({ style: ImpactStyle.Light }); } catch (e) {}
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="w-full">
      <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3 px-4 scroll-pl-4 pb-2">
        {PROMOS.map((promo) => {
          const isCopied = copiedId === promo.id;

          return (
            <motion.div
              whileTap={{ scale: 0.98 }}
              key={promo.id}
              className="snap-start shrink-0 w-[88vw] sm:w-[320px] rounded-[1.75rem] bg-gradient-to-br from-[#8A652D] via-[#B8893D] to-[#9E7432] p-5 flex flex-col justify-between h-[156px] shadow-[var(--shadow-ambient)] relative overflow-hidden border-none"
            >
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

              <div className="flex flex-col gap-1 z-10 max-w-[85%]">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#FAF9F6]/90">
                  <Tag className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{promo.tag}</span>
                </div>
                <h2 className="text-[20px] font-black text-white tracking-tight leading-none mt-1">
                  {promo.title}
                </h2>
                <p className="text-[12px] font-semibold text-[#F3E5AB] mt-0.5">
                  {promo.desc}
                </p>
              </div>
              
              {/* Trust Indicator & Code Action */}
              <div className="flex items-end justify-between z-10 mt-2">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/80 max-w-[50%] leading-tight">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#F3E5AB]" />
                  <span>Paiement à la livraison & Facturation transparente</span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => handleCopy(e, promo.id, promo.code)}
                  className={`px-3.5 py-2 rounded-xl text-[11px] font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border-none outline-none ${
                    isCopied
                      ? 'bg-white text-[#8A652D]'
                      : 'bg-[#1C1917]/20 backdrop-blur-md text-white hover:bg-[#1C1917]/30'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      <span>COPIÉ ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" strokeWidth={2.5} />
                      <span>{promo.code}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

HeroPromoCarousel.displayName = 'HeroPromoCarousel';
export default HeroPromoCarousel;
