import React from 'react';

export const HeaderBar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full px-4 pt-3 pb-2 bg-gradient-to-b from-[#faf5ef]/90 via-[#faf5ef]/70 to-transparent backdrop-blur-md flex items-center justify-between transition-all duration-300">
      {/* Eagle TN Branding with Eagle Symbol */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-1.5">
          <span className="bg-gradient-to-r from-amber-700 via-amber-900 to-slate-900 bg-clip-text text-transparent">
            Eagle TN
          </span>
          <span className="text-lg">🇹🇳</span>
        </h1>
      </div>

      {/* Location Badge */}
      <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-md border border-amber-900/10 shadow-xs px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/80 transition-all">
        <svg className="w-3.5 h-3.5 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <span className="text-[11px] font-black tracking-wider text-slate-800 uppercase font-['Plus_Jakarta_Sans']">
          TUNIS
        </span>
      </div>
    </header>
  );
};

export default HeaderBar;
