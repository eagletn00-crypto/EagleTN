import React, { useState } from 'react';
import { ArrowLeft, Trash2, Plus, Minus, MapPin, CreditCard, ShieldCheck, ShoppingBag } from 'lucide-react';
import { MenuItemData } from '../components/ItemDetailModal';

export interface CartItemWithDetails {
  item: MenuItemData;
  quantity: number;
  totalPrice: number;
  options?: string;
}

interface CartCheckoutScreenProps {
  items: CartItemWithDetails[];
  onBack: () => void;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onConfirmOrder: (paymentMethod: 'cash' | 'card', total: number) => void;
}

export const CartCheckoutScreen: React.FC<CartCheckoutScreenProps> = ({
  items,
  onBack,
  onUpdateQuantity,
  onRemoveItem,
  onConfirmOrder,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [deliveryNote, setDeliveryNote] = useState<string>('');

  // الحسابات المادية اللوجستية بالدينار التونسي
  const subtotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const deliveryFee = subtotal > 0 ? 3.500 : 0.000; // رسوم التوصيل 3.500 DT
  const grandTotal = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between select-none">
      
      {/* 1. الهيدر الزجاجي العلوي */}
      <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center active:scale-95 transition-all border border-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-base font-black text-white tracking-tight">Mon Panier</h1>
          <p className="text-[10px] font-medium text-emerald-400">Eagle TN Logistics</p>
        </div>

        <div className="w-10 h-10" /> {/* عنصر موازنة للهيدر */}
      </div>

      <main className="flex-1 max-w-lg w-full mx-auto p-4 space-y-6 pb-32">
        
        {/* 2. عنوان التوصيل المحدد (Luxury Minimal Block) */}
        <div className="bg-slate-900/90 border border-white/10 p-4 rounded-2xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <MapPin className="w-4 h-4" /> Adresse de Livraison
            </span>
            <button className="text-[11px] text-white hover:underline">Modifier</button>
          </div>
          <div>
            <p className="text-sm font-black text-white">Résidence Les Yasmines, Bloc B</p>
            <p className="text-xs text-slate-400 font-medium pt-0.5">Avenue Habib Bourguiba, Tunis</p>
          </div>
        </div>

        {/* 3. قائمة الأطباق داخل السلة */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-1">
            Plats Sélectionnés ({items.length})
          </h2>

          {items.length === 0 ? (
            <div className="bg-slate-900/50 border border-dashed border-white/10 rounded-2xl p-8 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-400">Votre panier est vide</p>
            </div>
          ) : (
            items.map(({ item, quantity, totalPrice }) => (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-lg"
              >
                {/* التفاصيل والاسم */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{item.nameAr}</h3>
                  <p className="text-[11px] text-slate-400 truncate">{item.nameFr}</p>
                  <p className="text-xs font-black text-emerald-400 pt-1">
                    {totalPrice.toFixed(3)} <span className="text-[10px] text-slate-400">DT</span>
                  </p>
                </div>

                {/* أزرار التحكم بالكمية + زر الحذف */}
                <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-white/10">
                  {quantity === 1 ? (
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center active:scale-90 transition-all hover:bg-red-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white/5 text-white flex items-center justify-center active:scale-90 transition-all hover:bg-white/10"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <span className="text-xs font-black min-w-[16px] text-center text-white">
                    {quantity}
                  </span>

                  <button
                    onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center active:scale-90 transition-all hover:bg-emerald-400"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 4. طرق الدفع (Paiement) */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-1">
            Mode de Paiement
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                paymentMethod === 'cash'
                  ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/60 border-white/10 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <span className="text-xs font-black text-white">Espèces à la livraison</span>
              <span className="text-[10px] text-slate-400 pt-1">دفع نقداً عند الاستلام</span>
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                paymentMethod === 'card'
                  ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/60 border-white/10 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <span className="text-xs font-black text-white flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" /> Carte Bancaire
              </span>
              <span className="text-[10px] text-slate-400 pt-1">بطاقة بنكية / E-Dinar</span>
            </button>
          </div>
        </div>

        {/* 5. الفاتورة التفصيلية (Receipt Summary) */}
        <div className="bg-slate-900/90 border border-white/10 p-4 rounded-2xl space-y-2.5 text-xs shadow-xl">
          <div className="flex justify-between text-slate-400 font-medium">
            <span>Sous-total</span>
            <span className="text-white font-bold">{subtotal.toFixed(3)} DT</span>
          </div>
          <div className="flex justify-between text-slate-400 font-medium">
            <span>Frais de livraison</span>
            <span className="text-white font-bold">{deliveryFee.toFixed(3)} DT</span>
          </div>
          <div className="border-t border-white/10 pt-2.5 flex justify-between text-sm font-black text-white">
            <span>Total à payer</span>
            <span className="text-emerald-400 text-base">{grandTotal.toFixed(3)} DT</span>
          </div>
        </div>

      </main>

      {/* 6. الشريط السفلي لإتمام الطلب (Checkout CTA) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            disabled={items.length === 0}
            onClick={() => onConfirmOrder(paymentMethod, grandTotal)}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-between disabled:opacity-50 disabled:pointer-events-none"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Confirmer la commande
            </span>
            <span className="bg-slate-950/20 px-3 py-1 rounded-xl text-xs font-black">
              {grandTotal.toFixed(3)} DT
            </span>
          </button>
        </div>
      </div>

    </div>
  );
};
