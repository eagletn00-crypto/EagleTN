import React from 'react';

export const AmbientMap: React.FC = () => {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-xs max-w-max mx-auto my-3">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eagle-red opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-eagle-red"></span>
      </span>
      <span className="text-[11px] font-semibold text-eagle-dark tracking-wide">
        Localisation Éphémère Active • Conforme INMDP 🔒
      </span>
    </div>
  );
};
