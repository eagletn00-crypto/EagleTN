import React, { useState } from 'react';

interface ProductDetailModalProps {
  item: {
    id: string;
    name?: string;
    name_fr?: string;
    name_ar?: string;
    description?: string;
    description_fr?: string;
    description_ar?: string;
    price: number;
    img?: string;
    image_url?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !item) return null;

  const imageSrc = item.img || item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80';
  const nameFr = item.name_fr || item.name || 'Produit';
  const nameAr = item.name_ar || 'منتج طازج';
  const descFr = item.description_fr || item.description || 'Ingrédients frais préparés avec soin.';
  const descAr = item.description_ar || 'مكونات طازجة محضرة بكل عناية على الطريقة الأصلية.';

  const handleAdd = () => {
    onAddToCart(quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-t-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[90vh]">
        {/* الصورة الرئيسية */}
        <div className="relative w-full h-64 bg-zinc-100 shrink-0">
          <img src={imageSrc} alt={nameFr} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-900/60 backdrop-blur-md text-white font-bold flex items-center justify-center hover:bg-zinc-900 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* تفاصيل المنتج والوصف الثنائي */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-black text-zinc-950 leading-tight">{nameFr}</h2>
              <p className="text-xs font-bold text-emerald-600 mt-0.5">{nameAr}</p>
            </div>
            <span className="text-lg font-black text-zinc-950 bg-zinc-100 px-3 py-1 rounded-full">
              {(Number(item.price) * quantity).toFixed(3)} DT
            </span>
          </div>

          <div className="space-y-2 border-t border-zinc-100 pt-3">
            <p className="text-zinc-800 text-xs font-semibold leading-relaxed">{descFr}</p>
            <p className="text-zinc-500 text-xs dir-rtl text-right leading-relaxed">{descAr}</p>
          </div>
        </div>

        {/* القاعدة الثابتة Action Bar */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center gap-3 shrink-0">
          <div className="flex items-center bg-white border border-zinc-200 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-900 font-black text-sm flex items-center justify-center active:scale-90"
            >
              -
            </button>
            <span className="w-8 text-center font-black text-sm text-zinc-900">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-full bg-zinc-900 text-white font-black text-sm flex items-center justify-center active:scale-90"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-full shadow-lg shadow-emerald-900/20 active:scale-98 transition-all flex items-center justify-between px-5"
          >
            <span>Ajouter au panier</span>
            <span>{(Number(item.price) * quantity).toFixed(3)} DT</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
