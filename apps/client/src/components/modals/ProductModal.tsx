import React from 'react';
import { MenuItem } from '../../types/schema';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: MenuItem | null;
  onAddToCart: (item: MenuItem, customizations?: Record<string, any>) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  data,
  onAddToCart
}) => {
  if (!isOpen || !data) return null;

  const rawConfig = (data as any).options_config;
  const parsedConfig = typeof rawConfig === 'string' ? JSON.parse(rawConfig) : rawConfig;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-base font-black text-slate-900">{data.name}</h2>
            <p className="text-xs text-slate-500 mt-1">{data.description}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 text-xl font-bold">✕</button>
        </div>

        {parsedConfig && (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700">
            <span className="font-bold">Options disponibles:</span>
            <pre className="mt-1 text-[10px] overflow-x-auto">{JSON.stringify(parsedConfig, null, 2)}</pre>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-base font-black text-amber-600">{data.price.toFixed(3)} DT</span>
          <button
            onClick={() => {
              onAddToCart(data);
              onClose();
            }}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
