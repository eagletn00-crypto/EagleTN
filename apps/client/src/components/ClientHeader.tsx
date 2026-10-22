import React from 'react';
import { MapPin, ShoppingCart, ChevronDown } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const ClientHeader: React.FC = () => {
  const { cartItems, setCurrentScreen } = useAppStore();
  const cartCount = cartItems?.length || 0;

  return (
    <header className="pt-8 pb-4 px-4 w-full select-none">
      <div className="flex items-center justify-between mb-5">
        
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-stone-900 tracking-tight font-sans">
            Eagle TN
          </span>
          <span className="text-2xl leading-none">🇹🇳</span>
        </div>

        <button
          onClick={() => setCurrentScreen && setCurrentScreen('CHECKOUT')}
          aria-label="Panier"
          className="relative w-11 h-11 rounded-full bg-[#E9EBEF] flex items-center justify-center border border-white/80 shadow-[4px_4px_10px_#c8cacb,-4px_-4px_10px_#ffffff] active:shadow-[inset_2px_2px_5px_#c8cacb,inset_-2px_-2px_5px_#ffffff] transition-all duration-200"
        >
          <ShoppingCart className="w-5 h-5 text-stone-700 stroke-[2.2]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full border-2 border-[#E9EBEF]">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <button
        aria-label="Changer l'adresse de livraison"
        className="w-full flex items-center gap-2 bg-[#E9EBEF] shadow-[inset_2px_2px_5px_#c8cacb,inset_-2px_-2px_5px_#ffffff] rounded-full px-4 py-2 border border-white/40 active:opacity-70 transition-opacity duration-200"
      >
        <MapPin className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
        <span className="flex-1 text-left text-[11px] font-extrabold text-stone-800 truncate tracking-tight">
          Avenue Habib Bourguiba, Tunis
        </span>
        <ChevronDown className="w-4 h-4 text-stone-500 shrink-0 stroke-[2.5]" />
      </button>
    </header>
  );
};

export default ClientHeader;
