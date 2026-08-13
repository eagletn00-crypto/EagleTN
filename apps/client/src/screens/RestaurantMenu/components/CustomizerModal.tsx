import React, { useState } from 'react';
import { MenuItem } from '../types';

interface CustomizerModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, selectedOptions: any, totalPrice: number) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  item,
  onClose,
  onAddToCart
}) => {
  if (!item) return null;

  const [selectedCuisson, setSelectedCuisson] = useState<string>('مريب (Mroob)');
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const toggleSupplement = (name: string) => {
    setSelectedSupplements(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const supplementsPrice = selectedSupplements.length * 1.000;
  const basePrice = item.price || 0;
  const totalPrice = (basePrice + supplementsPrice) * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-slate-800">
        
        {/* Top Image Banner */}
        <div className="relative h-48 w-full bg-slate-100">
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/60 transition-colors"
          >
            ✕
          </button>
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
            <h3 className="text-xl font-black">{item.name}</h3>
            <span className="text-xs text-amber-300 font-bold">{item.name_ar}</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs font-sans">
          <p className="text-slate-500 leading-relaxed">{item.description}</p>

          {/* CUISSON DE L'OEUF */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-extrabold uppercase text-slate-900">CUISSON DE L'OEUF / إعداد البيض</span>
              <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">Obligatoire</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['مريب (Mroob)', 'طايب (Bien cuit)'].map(option => (
                <button
                  key={option}
                  onClick={() => setSelectedCuisson(option)}
                  className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                    selectedCuisson === option
                      ? 'border-[#00A082] bg-[#00A082]/10 text-[#00A082]'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* SUPPLEMENTS */}
          <div>
            <span className="font-extrabold uppercase text-slate-900 block mb-2">SUPPLEMENTS / الإضافات</span>
            <div className="space-y-1.5">
              {[
                { name: 'Supplément Thon (زيادة تن)', price: '+1.500 DT' },
                { name: 'Supplément Fromage (زيادة جبن)', price: '+1.000 DT' },
                { name: 'Supplément Œuf (زيادة بيضة)', price: '+0.800 DT' }
              ].map(sup => (
                <label
                  key={sup.name}
                  onClick={() => toggleSupplement(sup.name)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-100/50"
                >
                  <span className="font-medium text-slate-700">{sup.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#00A082]">{sup.price}</span>
                    <input
                      type="checkbox"
                      checked={selectedSupplements.includes(sup.name)}
                      onChange={() => {}}
                      className="accent-[#00A082] w-4 h-4 rounded"
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center gap-3 bg-white">
          <div className="flex items-center border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-8 h-8 font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              -
            </button>
            <span className="px-3 font-extrabold text-slate-900">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              +
            </button>
          </div>

          <button
            onClick={() => {
              onAddToCart(item, { selectedCuisson, selectedSupplements }, totalPrice);
              onClose();
            }}
            className="flex-1 bg-[#00A082] hover:bg-[#008f74] text-white py-3.5 px-4 rounded-xl font-extrabold flex items-center justify-between shadow-lg shadow-[#00A082]/20 transition-all active:scale-[0.98]"
          >
            <span>Ajouter au panier</span>
            <span>{totalPrice.toFixed(3)} DT</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CustomizerModal;
