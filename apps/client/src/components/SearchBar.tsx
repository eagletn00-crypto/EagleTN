import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export interface SearchBarProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterClick?: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onFilterClick,
  inputRef
}) => {
  return (
    <div className="flex items-center my-5 w-full select-none">
      <div className="flex-1 flex items-center gap-3 bg-[#E9EBEF] px-4 py-3.5 rounded-full border border-white/50 shadow-[inset_3px_3px_6px_#c8cacb,inset_-3px_-3px_6px_#ffffff]">
        <Search className="w-4 h-4 text-stone-400 shrink-0 stroke-[2.5]" />
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Chercher un restaurant, pâtisserie, boutique..."
          className="w-full bg-transparent text-xs font-extrabold text-stone-800 placeholder:text-stone-400 focus:outline-none"
        />
      </div>
      <button
        onClick={onFilterClick}
        aria-label="Filtres avancés"
        className="ml-3 shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#E9EBEF] border border-white/60 shadow-[3px_3px_6px_#c8cacb,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_5px_#c8cacb,inset_-2px_-2px_5px_#ffffff] transition-all duration-200"
      >
        <SlidersHorizontal className="w-4 h-4 text-stone-700 stroke-[2.5]" />
      </button>
    </div>
  );
};

export default SearchBar;
