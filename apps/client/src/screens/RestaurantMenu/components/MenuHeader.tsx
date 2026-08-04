import React from 'react';
import { Search, X } from 'lucide-react';

interface MenuHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="px-4 mt-4">
      <div className="relative flex items-center w-full">
        <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un plat, sandwich..."
          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-8 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 shadow-xs transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
