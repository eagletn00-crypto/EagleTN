import React from 'react';

export interface LegalFooterProps {
  onOpenLegal: () => void;
}

export const LegalFooter: React.FC<LegalFooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="mt-8 mb-6 flex justify-center items-center px-4 text-center opacity-80">
      <p className="text-[11px] font-semibold text-[#1C1917] tracking-wide flex items-center gap-2 flex-wrap justify-center">
        <span className="font-bold">EAGLE TN DIGITAL SYSTEM • Avril 2026</span>
        <span className="text-[#B8860B] hidden sm:inline">•</span>
        <button onClick={onOpenLegal} className="outline-none hover:text-[#9A6B16] transition-colors">CGU</button>
        <span className="text-[#B8860B]">•</span>
        <button onClick={onOpenLegal} className="outline-none hover:text-[#9A6B16] transition-colors">Confidentialité</button>
        <span className="text-[#B8860B]">•</span>
        <button className="outline-none hover:text-[#9A6B16] transition-colors">Assistance</button>
      </p>
    </footer>
  );
};

export default LegalFooter;
