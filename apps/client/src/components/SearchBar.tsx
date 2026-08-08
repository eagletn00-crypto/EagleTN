import React from 'react';

export const SearchBar: React.FC = () => {
  return (
    <div className="px-4 py-1 sticky top-[52px] z-30">
      <div className="relative group">
        <input 
          type="text" 
          placeholder="Chercher un plat, un restaurant..." 
          className="w-full bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-full py-3.5 pl-11 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white/90 transition-all duration-300"
        />
        <svg className="w-4 h-4 absolute left-4 top-4 text-slate-400 group-focus-within:text-amber-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
