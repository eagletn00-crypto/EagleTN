import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  onAddToCart?: (product: any, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Header Image */}
        <div className="relative h-64 w-full bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-950/60 backdrop-blur-md text-white rounded-full hover:bg-slate-950 transition-colors"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-[#E70013] text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#E70013]" />
              <span>Gourmet Selection</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
              {product.name}
            </h3>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Prix Unitaire
            </span>
            <span className="text-base font-black text-slate-900 font-['Plus_Jakarta_Sans']">
              {product.price.toFixed(3)} DT
            </span>
          </div>
        </div>

        {/* Bottom Actions Container */}
        <div className="p-5 bg-slate-50/80 border-t border-slate-100 flex items-center gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white border border-slate-200/80 rounded-2xl p-1.5 shadow-xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <span className="text-xs font-black text-slate-900 min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => {
              if (onAddToCart) onAddToCart(product, quantity);
              onClose();
            }}
            className="flex-1 py-3.5 bg-slate-950 hover:bg-black text-white rounded-2xl font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-slate-950/10 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.2] text-amber-400" />
            <span>Ajouter • {(product.price * quantity).toFixed(3)} DT</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductModal;
