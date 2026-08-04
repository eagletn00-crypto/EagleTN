import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { create } from 'zustand';

// Définition stricte de l'état du panier global (Zustand)
interface CartItem {
  cartItemId: string;
  product_id: string;
  name: string;
  quantity: number;
  base_price_millimes: number;
  total_price_millimes: number;
  customization: {
    format: OptionItem | null;
    boisson: OptionItem | null;
    supplements: OptionItem[];
  };
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addToCart: (newItem) => set((state) => {
    const existingIndex = state.items.findIndex(i => i.cartItemId === newItem.cartItemId);
    if (existingIndex > -1) {
      const updatedItems = [...state.items];
      updatedItems[existingIndex].quantity += newItem.quantity;
      updatedItems[existingIndex].total_price_millimes += newItem.total_price_millimes;
      return { items: updatedItems };
    }
    return { items: [...state.items, newItem] };
  }),
}));

// Utilitaire de formatage financier standard tunisien
const formatMillimes = (millimes: number): string => {
  return `${(millimes / 1000).toFixed(3)} DT`;
};

interface OptionItem {
  name: string;
  price_modifier: number;
}

interface OptionsConfig {
  formats: OptionItem[];
  boissons: OptionItem[];
  supplements: OptionItem[];
}

interface ProductModalProps {
  productId: string;
  onClose: () => void;
}

export default function ProductModal({ productId, onClose }: ProductModalProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedFormat, setSelectedFormat] = useState<OptionItem | null>(null);
  const [selectedBoisson, setSelectedBoisson] = useState<OptionItem | null>(null);
  const [selectedSupplements, setSelectedSupplements] = useState<OptionItem[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  const fallbackConfig: OptionsConfig = {
    formats: [
      { name: "Format Sandwich", price_modifier: 0 },
      { name: "Format Plat Traditionnel", price_modifier: 3500 }
    ],
    boissons: [
      { name: "Sans boisson", price_modifier: 0 },
      { name: "Coca-Cola 33cl", price_modifier: 2200 },
      { name: "Boga Lim 33cl", price_modifier: 2000 }
    ],
    supplements: [
      { name: "Supplément Frites", price_modifier: 1500 },
      { name: "Supplément Fromage", price_modifier: 1200 }
    ]
  };

  useEffect(() => {
    async function fetchProductData() {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: sbError } = await supabase
          .from('menu_items')
          .select('id, name, description, price, price_millimes, options_config')
          .eq('id', productId)
          .single();

        if (sbError) throw sbError;
        if (!data) throw new Error("Produit introuvable");

        let parsedConfig: OptionsConfig = fallbackConfig;
        if (data.options_config) {
          const rawConfig = typeof data.options_config === 'string' 
            ? JSON.parse(data.options_config) 
            : data.options_config;
            
          parsedConfig = {
            formats: rawConfig.formats || fallbackConfig.formats,
            boissons: rawConfig.boissons || fallbackConfig.boissons,
            supplements: rawConfig.supplements || fallbackConfig.supplements
          };
        }

        data.options_config = parsedConfig;
        setProduct(data);

        if (parsedConfig.formats.length > 0) setSelectedFormat(parsedConfig.formats[0]);
        if (parsedConfig.boissons.length > 0) setSelectedBoisson(parsedConfig.boissons[0]);

      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
  }, [productId]);

  const totalProductPrice = useMemo(() => {
    if (!product) return 0;
    
    const basePrice = Number(product.price_millimes || product.price || 0);
    const formatModifier = selectedFormat ? selectedFormat.price_modifier : 0;
    const boissonModifier = selectedBoisson ? selectedBoisson.price_modifier : 0;
    const supplementsModifier = selectedSupplements.reduce((sum, s) => sum + s.price_modifier, 0);

    return (basePrice + formatModifier + boissonModifier + supplementsModifier) * quantity;
  }, [product, selectedFormat, selectedBoisson, selectedSupplements, quantity]);

  const toggleSupplement = (item: OptionItem) => {
    setSelectedSupplements(prev => 
      prev.some(s => s.name === item.name)
        ? prev.filter(s => s.name !== item.name)
        : [...prev, item]
    );
  };

  const handleAddToBag = () => {
    if (!product) return;

    const configurationFingerprint = JSON.stringify({
      format: selectedFormat?.name,
      boisson: selectedBoisson?.name,
      supplements: selectedSupplements.map(s => s.name).sort()
    });

    const uniqueCartItemId = `${product.id}-${btoa(configurationFingerprint).substring(0, 8)}`;

    const cartItem: CartItem = {
      cartItemId: uniqueCartItemId,
      product_id: product.id,
      name: product.name,
      quantity,
      base_price_millimes: Number(product.price_millimes || product.price || 0),
      total_price_millimes: totalProductPrice,
      customization: {
        format: selectedFormat,
        boisson: selectedBoisson,
        supplements: selectedSupplements
      }
    };

    addToCart(cartItem);
    onClose();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-5 h-5 text-white animate-spin" />
        <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400">Synchronisation des tarifs...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-xs font-bold text-red-500 uppercase tracking-wider">{error || "Erreur de chargement"}</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-neutral-800 rounded-xl text-xs font-black uppercase text-white border-none cursor-pointer">Fermer</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end justify-center sm:items-center p-0">
      <div className="bg-neutral-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[85vh] flex flex-col text-white font-sans border border-neutral-800">
        
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex justify-between items-start sticky top-0 bg-neutral-900 z-10">
          <div>
            <h3 className="text-sm font-black uppercase tracking-tight text-white">{product.name}</h3>
            <p className="text-[10px] text-neutral-400 font-medium mt-0.5">{product.description || "Recette originale préparée à la commande."}</p>
          </div>
          <button onClick={onClose} className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl border-none text-neutral-400 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulaire Options */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Formats */}
          <div>
            <h4 className="font-black uppercase tracking-wider text-neutral-400 text-[9px] mb-2">1. Choisir le format (Obligatoire)</h4>
            <div className="space-y-1.5">
              {product.options_config.formats.map((f: OptionItem) => (
                <label key={f.name} className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-all ${selectedFormat?.name === f.name ? 'bg-white/5 border-white text-white' : 'bg-neutral-950 border-neutral-800 text-neutral-400'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="format" checked={selectedFormat?.name === f.name} onChange={() => setSelectedFormat(f)} className="accent-white w-4 h-4" />
                    <span className="font-bold">{f.name}</span>
                  </div>
                  {f.price_modifier > 0 && <span className="font-mono text-neutral-300">+{formatMillimes(f.price_modifier)}</span>}
                </label>
              ))}
            </div>
          </div>

          {/* Boissons */}
          <div>
            <h4 className="font-black uppercase tracking-wider text-neutral-400 text-[9px] mb-2">2. Choisir une boisson</h4>
            <div className="space-y-1.5">
              {product.options_config.boissons.map((b: OptionItem) => (
                <label key={b.name} className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-all ${selectedBoisson?.name === b.name ? 'bg-white/5 border-white text-white' : 'bg-neutral-950 border-neutral-800 text-neutral-400'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="boisson" checked={selectedBoisson?.name === b.name} onChange={() => setSelectedBoisson(b)} className="accent-white w-4 h-4" />
                    <span className="font-bold">{b.name}</span>
                  </div>
                  {b.price_modifier > 0 && <span className="font-mono text-neutral-300">+{formatMillimes(b.price_modifier)}</span>}
                </label>
              ))}
            </div>
          </div>

          {/* Suppléments */}
          <div>
            <h4 className="font-black uppercase tracking-wider text-neutral-400 text-[9px] mb-2">3. Suppléments optionnels</h4>
            <div className="space-y-1.5">
              {product.options_config.supplements.map((s: OptionItem) => {
                const isSelected = selectedSupplements.some(item => item.name === s.name);
                return (
                  <label key={s.name} className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-white/5 border-white text-white' : 'bg-neutral-950 border-neutral-800 text-neutral-400'}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSupplement(s)} className="accent-white w-4 h-4 rounded" />
                      <span className="font-bold">{s.name}</span>
                    </div>
                    <span className="font-mono text-neutral-300">+{formatMillimes(s.price_modifier)}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Quantité</span>
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-7 h-7 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center border-none text-white cursor-pointer">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-mono font-black text-xs">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-7 h-7 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center border-none text-white cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button onClick={handleAddToBag} className="w-full bg-white hover:bg-neutral-200 text-black font-black text-xs uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 border-none cursor-pointer transition-all">
            <ShoppingBag className="w-4 h-4" />
            <span>Ajouter au panier — {formatMillimes(totalProductPrice)}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
