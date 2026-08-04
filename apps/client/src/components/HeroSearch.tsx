import React, { useState } from 'react';
import { Search, Navigation } from 'lucide-react';

interface HeroSearchProps {
  onSearch: (query: string) => void;
  onLocationTrigger: () => void;
  currentLocationLabel: string;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ 
  onSearch, 
  onLocationTrigger, 
  currentLocationLabel 
}) => {
  const [inputVal, setInputVal] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    onSearch(val);
  };

  const handleGpsClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLocating(true);
    await onLocationTrigger();
    setIsLocating(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.4)] transition-all duration-300 focus-within:border-rose-500/40 focus-within:ring-1 focus-within:ring-rose-500/40 flex flex-col sm:flex-row items-stretch gap-2">
        <div className="flex-1 relative flex items-center">
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 pointer-events-none transition-colors duration-200" />
          <input 
            type="text" 
            value={inputVal}
            onChange={handleInputChange}
            placeholder="Rechercher un établissement, un plat ou une spécialité..."
            className="w-full bg-transparent text-white pl-12 pr-4 py-3.5 text-sm focus:outline-none placeholder:text-zinc-500 font-medium tracking-wide antialiased"
          />
        </div>

        <button 
          onClick={handleGpsClick}
          disabled={isLocating}
          className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs px-5 py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] border border-zinc-800/80 font-bold select-none group shrink-0 min-w-[160px]"
        >
          <Navigation className={`w-3.5 h-3.5 text-rose-500 transition-transform duration-300 ${isLocating ? 'animate-spin' : 'group-hover:rotate-12'}`} />
          <span className="truncate max-w-[120px]">
            {isLocating ? 'Géolocalisation...' : currentLocationLabel || 'Géolocalisation'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default HeroSearch;
