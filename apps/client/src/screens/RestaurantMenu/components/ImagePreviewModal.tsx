import React from 'react';
import { MenuItem } from '../types';

interface ImagePreviewModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/20 hover:bg-black transition-colors"
        >
          ✕
        </button>

        {/* Big Preview Image */}
        <div className="relative h-72 w-full bg-slate-950">
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Details */}
        <div className="p-5 space-y-3 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-black">{item.name}</h2>
              {item.name_ar && (
                <p className="text-sm font-bold text-amber-400 dir-rtl">{item.name_ar}</p>
              )}
            </div>
            <span className="text-lg font-black text-[#E75A24]">
              {item.price.toFixed(3)} DT
            </span>
          </div>

          {item.description && (
            <p className="text-xs text-slate-300 leading-relaxed font-medium pt-2 border-t border-slate-800">
              {item.description}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default ImagePreviewModal;
