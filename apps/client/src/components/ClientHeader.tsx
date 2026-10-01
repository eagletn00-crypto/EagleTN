import React from 'react';

export interface ClientHeaderProps {
  cartCount?: number;
  onNavigateCart?: () => void;
}

const EagleLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2C10.2 3.8 7.5 5.2 4.5 5.8c1.8 2.2 4 3.2 7.5 3.2 3.5 0 5.7-1 7.5-3.2-3-.6-5.7-2-7.5-3.8zm-8.5 6.5C2 10 1.5 12 1.5 14.5c2.8-1.1 5.5-1.1 8.8-2.8-3.3-1.4-5.5-2.5-6.8-3.2zm17 0c-1.3.7-3.5 1.8-6.8 3.2 3.3 1.7 6 1.7 8.8 2.8 0-2.5-.5-4.5-2-6.5zM12 10.2c-3.3 1.6-6.6 2.7-9.9 4.8 1.6 3.3 5 6 9.9 8 4.9-2 8.3-4.7 9.9-8-3.3-2.1-6.6-3.2-9.9-4.8z" />
  </svg>
);

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  cartCount = 0,
  onNavigateCart,
}) => {
  const formattedCartCount = cartCount > 99 ? '99+' : cartCount;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Eagle Logo & Brand Name */}
        <div className="flex items-center gap-2.5 select-none">
          {/* Emblem Container */}
          <div 
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E70013] via-[#C00010] to-[#80000A] flex items-center justify-center shadow-md shadow-[#E70013]/25 ring-2 ring-white"
            aria-hidden="true"
          >
            <EagleLogoIcon className="w-7 h-7 text-white drop-shadow-sm" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
                EAGLE <span className="text-[#E70013]">TN</span>
              </h1>
              <span className="text-base" role="img" aria-label="Aigle et Drapeau Tunisien">
                🦅🇹🇳
              </span>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center gap-1.5 mt-1">
              <span 
                className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" 
                aria-hidden="true" 
              />
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">
                EN LIGNE
              </span>
            </div>
          </div>
        </div>

        {/* Cart Action Button */}
        <button
          onClick={onNavigateCart}
          type="button"
          className="relative w-11 h-11 rounded-2xl bg-slate-100 hover:bg-[#E70013]/10 text-slate-800 hover:text-[#E70013] flex items-center justify-center transition-colors duration-200 border border-slate-200 active:scale-95 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-[#E70013] focus:ring-offset-2"
          aria-label={
            cartCount > 0
              ? `Voir le panier (${cartCount} article${cartCount > 1 ? 's' : ''})`
              : 'Voir le panier (vide)'
          }
        >
          <span className="text-xl" aria-hidden="true">🛒</span>
          
          {cartCount > 0 && (
            <span 
              className="absolute -top-1.5 -right-1.5 bg-[#E70013] text-white text-[10px] font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm"
              aria-hidden="true"
            >
              {formattedCartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default ClientHeader;
