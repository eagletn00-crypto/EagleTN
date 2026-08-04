import React from 'react';
import { Search, Compass } from 'lucide-react';

interface UltraFloatingHeaderProps {
  onSearchChange: (query: string) => void;
  onDroneClick: () => void;
}

export const UltraFloatingHeader: React.FC<UltraFloatingHeaderProps> = ({
  onSearchChange,
  onDroneClick,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#000F2E]/80 border-b border-white/10 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-white tracking-wider">
            EAGLE<span className="text-[#E21A22]">.TN</span>
          </span>
        </div>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un partenaire, plat..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 pr-10 pl-4 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <button
          onClick={onDroneClick}
          className="p-2.5 bg-[#E21A22]/10 border border-[#E21A22]/30 rounded-2xl text-[#E21A22] hover:bg-[#E21A22] hover:text-white transition-all flex items-center gap-1 text-xs font-bold"
        >
          <Compass className="w-4 h-4" />
          <span className="hidden sm:inline">Suivi Live</span>
        </button>
      </div>
    </header>
  );
};

export default UltraFloatingHeader;
