import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CartItem {
  id: string;
  category: 'restaurant' | 'para' | 'fleure' | 'patisserie' | 'shopping';
  storeName: string;
  itemName: string;
  price: number;
}

const mockCartItems: CartItem[] = [
  { id: '1', category: 'restaurant', storeName: 'Chez Om Ali', itemName: 'Couscous au Mérou Signature', price: 28.5 },
  { id: '2', category: 'fleure', storeName: 'Botanica Fleurs', itemName: 'Bouquet de Roses Blanches', price: 35.0 },
  { id: '3', category: 'para', storeName: 'ParaPharma Privée', itemName: 'Sérum Éclat C-Vit', price: 42.0 },
];

export const MultiCheckoutCart: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [items] = useState<CartItem[]>(mockCartItems);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const totalDeliveryFee = 4.5; // Frais de livraison groupés
  const grandTotal = subtotal + totalDeliveryFee;

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/40 backdrop-blur-sm flex justify-end font-['Plus_Jakarta_Sans']">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gray-950" />
              <h2 className="text-base font-extrabold text-gray-950">
                Commande Multi-Secteurs
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-xs font-bold text-gray-400 hover:text-gray-900"
            >
              Fermer
            </button>
          </div>

          {/* المسارات الموحدة المتعددة للشركاء */}
          <div className="mt-4 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between"
              >
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-gray-900 mt-1">
                    {item.itemName}
                  </h4>
                  <p className="text-[10px] text-gray-400">{item.storeName}</p>
                </div>
                <span className="text-xs font-black text-gray-950">
                  {item.price.toFixed(2)} DT
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* الحساب والتأكيد القانوني الموحد */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} DT</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Frais de livraison groupés</span>
              <span>{totalDeliveryFee.toFixed(2)} DT</span>
            </div>
            <div className="flex justify-between text-sm font-black text-gray-950 pt-2 border-t border-gray-100">
              <span>Total à payer (TTC)</span>
              <span>{grandTotal.toFixed(2)} DT</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full bg-gray-950 hover:bg-gray-800 text-white font-extrabold py-3.5 rounded-full flex items-center justify-center gap-2 text-xs shadow-lg transition-all active:scale-98"
          >
            <span>Valider et Payer à la Livraison</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Micro-text Legal Footer */}
          <p className="text-[9px] text-center text-gray-400 leading-tight">
            En validant, vous acceptez nos CGU et اشتراطات الهيئة الوطنية لحماية المعطيات الشخصية INPDP.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MultiCheckoutCart;
