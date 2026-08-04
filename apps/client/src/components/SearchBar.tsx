import React from 'react';

interface SearchBarProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  placeholder = 'Rechercher un plat, restaurant...',
}) => {
  return (
    <div className="relative w-full my-2">
      <div className="relative flex items-center w-full h-12 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-md overflow-hidden focus-within:border-[#D4AF37] transition-all">
        <div className="flex items-center justify-center pl-4 pr-2 text-[#D4AF37] flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-full bg-transparent pr-4 text-xs font-semibold text-white placeholder-slate-400 focus:outline-none border-none ring-0"
        />
      </div>
    </div>
  );
};

export default SearchBar;
