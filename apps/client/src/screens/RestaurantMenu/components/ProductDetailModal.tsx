import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { MenuItem } from '../types';

export interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    setQuantity(1);
  }, [item]);

  if (!item) return null;

  const rawPrice =
    item.current_price !== undefined && item.current_price !== null
      ? item.current_price
      : item.price;

  const unitPrice = Number(rawPrice) || 0;
  const totalPrice = unitPrice * quantity;

  const titleFr = item.name_fr || item.name || '';
  const titleAr = item.name_ar || '';
  const descFr = item.description_fr || item.description || '';
  const descAr = item.description_ar || '';

  const getImageUrl = () => {
    if (item.image_url) return item.image_url;
    if (item.current_photo_url) return item.current_photo_url;
    if (item.img) return item.img;
    return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
  };

  const handleAdd = () => {
    onAddToCart(item, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Image */}
        <div className="relative h-56 w-full bg-slate-100 shrink-0">
          <img
            src={getImageUrl()}
            alt={titleFr}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-4 right-4 w-9 h-9 rounded-2xl bg-white/80 backdrop-blur-md text-slate-800 shadow-md hover:bg-white flex items-center justify-center transition-all active:scale-90"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {titleFr}
            </h2>
            {titleAr && (
              <p className="text-xs font-bold text-slate-500 pt-0.5" dir="rtl">
                {titleAr}
              </p>
            )}
          </div>

          {(descFr || descAr) && (
            <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {descFr && (
                <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                  {descFr}
                </p>
              )}
              {descAr && (
                <p className="text-xs font-semibold text-slate-500 leading-relaxed" dir="rtl">
                  {descAr}
                </p>
              )}
            </div>
          )}

          {/* Quantity Controls */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-extrabold text-slate-700">Quantité</span>
            <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-xl bg-white text-slate-900 shadow-xs flex items-center justify-center disabled:opacity-40 active:scale-90 transition-all"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>

              <span className="text-sm font-black text-slate-900 min-w-5 text-center">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-xl bg-white text-slate-900 shadow-xs flex items-center justify-center active:scale-90 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={handleAdd}
            className="w-full bg-[#E70013] text-white rounded-2xl p-3.5 shadow-lg shadow-[#E70013]/25 flex items-center justify-between active:scale-[0.98] transition-all font-black"
          >
            <span className="flex items-center gap-2 text-xs uppercase tracking-wider">
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              Ajouter au panier
            </span>
            <span className="text-sm bg-white/20 px-2.5 py-1 rounded-xl">
              {totalPrice.toFixed(3)} DT
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
