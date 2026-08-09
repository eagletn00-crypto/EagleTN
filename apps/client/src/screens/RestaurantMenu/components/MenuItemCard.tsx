import React, { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';

export interface MenuItem {
  id: string;
  name_fr: string;
  description_fr?: string;
  price: number;
  image_url?: string;
  is_popular?: boolean;
}

interface MenuItemCardProps {
  item: MenuItem;
  viewMode: 'row' | 'card';
  onSelect: (item: MenuItem, selectedOptions?: any) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, viewMode, onSelect }) => {
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [portion, setPortion] = useState<'plat' | 'sandwich'>('plat');
  const [drink, setDrink] = useState<string>('none');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onSelect(item, { portion, drink, quantity });
    setIsOptionModalOpen(false);
  };

  return (
    <>
      {/* UK-Grade Clean Card */}
      <div 
        onClick={() => setIsOptionModalOpen(true)}
        className="group bg-white rounded-2xl p-3.5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all cursor-pointer flex items-center gap-4"
      >
        {item.image_url && (
          <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100">
            <img 
              src={item.image_url} 
              alt={item.name_fr} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {item.is_popular && (
              <span className="absolute top-1.5 left-1.5 bg-slate-900/80 backdrop-blur-md text-amber-400 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                ★ Popular
              </span>
            )}
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 truncate tracking-tight">{item.name_fr}</h3>
            {item.description_fr && (
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed font-normal">
                {item.description_fr}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-2 pt-1">
            <span className="text-sm font-black text-slate-900">{item.price.toFixed(3)} <span className="text-[10px] text-slate-400 font-bold">DT</span></span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsOptionModalOpen(true);
              }}
              className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 flex items-center justify-center transition-all shadow-sm"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Ultra-Clean UK Bottom Sheet for Options */}
      {isOptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-5 space-y-5">
            
            {/* Header with Image */}
            <div className="relative -mx-5 -mt-5 mb-2 h-44 overflow-hidden rounded-t-[32px] bg-slate-100">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name_fr} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-amber-500 font-bold text-sm">Eagle TN</div>
              )}
              <button 
                onClick={() => setIsOptionModalOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 bg-slate-900/60 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-slate-900 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <h2 className="text-base font-black text-slate-900">{item.name_fr}</h2>
              <p className="text-xs font-bold text-amber-600 mt-0.5">{item.price.toFixed(3)} DT</p>
              {item.description_fr && (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description_fr}</p>
              )}
            </div>

            {/* Portion Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Format / Portion</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'plat', label: 'Plat' },
                  { id: 'sandwich', label: 'Sandwich' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPortion(opt.id as any)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                      portion === opt.id
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {portion === opt.id && <Check size={14} className="text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Drinks Options */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Boisson (Optionnel)</label>
              <div className="space-y-1.5">
                {[
                  { id: 'none', label: 'Sans boisson', price: 0 },
                  { id: 'soda', label: 'Soda Local (Gazouz)', price: 1.5 },
                  { id: 'water', label: 'Eau Minérale', price: 1.0 }
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDrink(d.id)}
                    className={`w-full py-2.5 px-3.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                      drink === d.id
                        ? 'border-amber-500/50 bg-amber-500/10 text-slate-900'
                        : 'border-slate-100 bg-slate-50/60 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{d.label}</span>
                    <span className="text-slate-500 font-semibold">{d.price > 0 ? `+${d.price.toFixed(3)} DT` : 'Gratuit'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="flex items-center bg-slate-100 rounded-xl p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white shadow-sm font-black text-slate-800 flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-black text-slate-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white shadow-sm font-black text-slate-800 flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3.5 rounded-xl shadow-xl flex items-center justify-between px-4 transition-all"
              >
                <span>Ajouter au panier</span>
                <span className="text-amber-400">{(item.price * quantity).toFixed(3)} DT</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard;
