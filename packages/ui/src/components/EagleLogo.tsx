import React, { memo } from 'react';

export const EagleLogo: React.FC<{ className?: string }> = memo(({ className = "w-8 h-8" }) => (
  <div className={`flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${className}`}>
    <svg 
      viewBox="0 0 32 32" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      {/* Sovereign Red Geometric Eagle Head & Wing Vector */}
      <path 
        d="M26.5 4.5L16 10L20 14L16 17.5L21.5 22L13 24.5L9 20L11 16.5L6.5 12L10.5 6L26.5 4.5Z" 
        fill="#D92D20" 
      />
      <circle cx="12.5" cy="11.5" r="1.5" fill="#FFFFFF" />
    </svg>
  </div>
));

EagleLogo.displayName = 'EagleLogo';
