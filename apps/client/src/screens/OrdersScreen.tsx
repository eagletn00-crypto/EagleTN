import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, ChevronRight, ShoppingBag, ArrowLeft, Receipt, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useCartStore } from '../store/useCartStore';

// Mocked Past Orders (Simulating structured data)
const PAST_ORDERS = [
  {
    id: 'CMD-8492X',
    restaurantNameFr: 'Le Burger Artisanal',
    restaurantNameAr: 'برغر أرتيزينال',
    date: 'Hier, 19:42',
    total: 32.500,
    status: 'Livrée',
    items: [
      { id: 'p1', name_fr: 'Burger Signature', name_ar: 'برغر سيغنتشر', quantity: 2, price: 15.000, image_url: '' }
    ]
  },
  {
    id: 'CMD-8491W',
    restaurantNameFr: 'Chez Am Ali',
    restaurantNameAr: 'عند عم علي',
    date: '12 Nov, 13:15',
    total: 18.000,
    status: 'Livrée',
    items: [
      { id: 'p2', name_fr: 'Oujja Fruits de Mer', name_ar: 'عجة غلال البحر', quantity: 1, price: 18.000, image_url: '' }
    ]
  }
];

export const OrdersScreen: React.FC = () => {
  const navigate = useNavigate();
  const { clearCart, addItem } = useCartStore();

  const triggerHaptic = async (style = ImpactStyle.Light) => {
    try { await Haptics.impact({ style }); } catch(e) {}
  };

  const handleGoBack = async () => {
    await triggerHaptic();
    navigate(-1);
  };

  const handleReorder = async (order: typeof PAST_ORDERS[0]) => {
    await triggerHaptic(ImpactStyle.Heavy);
    
    // 🛒 تنظيف السلة القديمة
    clearCart();
    
    // 🦅 ضخ البيانات بحماية صارمة (بدون any)
    order.items.forEach(item => {
      addItem({
        item_id: item.id,
        merchantId: 'reorder',
        options: [],
        name: item.name_fr,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url
      });
    });
    
    navigate('/checkout');
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#FAF8F5] pb-24 font-sans selection:bg-[#C1121F]/20">
      
      {/* SOVEREIGN HEADER */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-gray-200/50 px-4 h-16 flex items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleGoBack}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center outline-none"
        >
          <ArrowLeft className="w-5 h-5 text-[#1C1917]" strokeWidth={2.5} />
        </motion.button>
        <h1 className="text-[16px] font-black text-[#1C1917] uppercase tracking-widest">
          Mes Commandes <span className="text-[12px] text-[#C1121F] ml-1">(طلباتي)</span>
        </h1>
        <div className="w-10" />
      </header>

      <main className="p-4 space-y-4 mt-2">
        {PAST_ORDERS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mb-6">
              <Receipt className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
            </div>
            <h2 className="text-[20px] font-black text-[#1C1917] uppercase">Aucune commande</h2>
            <p className="text-[13px] font-bold text-gray-500 mt-2 font-arabic">لا يوجد طلبات سابقة حتى الآن.</p>
          </div>
        ) : (
          PAST_ORDERS.map((order, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={order.id} 
              className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div className="flex flex-col">
                  <h3 className="text-[16px] font-black text-[#1C1917] leading-tight">{order.restaurantNameFr}</h3>
                  <p dir="auto" className="text-[12px] font-bold text-gray-400 mt-0.5">{order.restaurantNameAr}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] font-black text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                      {order.date}
                    </span>
                    <span className="text-[12px] font-black text-[#1C1917] tabular-nums">
                      {order.total.toFixed(3)} DT
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" strokeWidth={3} />
                    {order.status}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">N° {order.id.split('-')[1]}</span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="flex flex-col gap-1.5 pb-2">
                {order.items.map((item, i) => (
                  <div key={i} className="text-[12px] font-bold text-gray-600 flex items-center gap-2">
                    <span className="text-[#C1121F] font-black">{item.quantity}x</span>
                    <span className="truncate">{item.name_fr}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <motion.button 
                  whileTap={{ scale: 0.96 }} 
                  onClick={() => handleReorder(order)} 
                  className="flex-1 bg-[#1C1917] text-white h-12 rounded-[16px] flex flex-col items-center justify-center shadow-md outline-none border border-white/10"
                >
                  <span className="text-[12px] font-black uppercase tracking-widest leading-none mt-0.5">Commander à nouveau</span>
                  <span className="text-[9px] font-bold text-gray-400 mt-1 font-arabic">أعد الطلب</span>
                </motion.button>
                
                <motion.button 
                  whileTap={{ scale: 0.9 }} 
                  className="w-12 h-12 flex items-center justify-center rounded-[16px] bg-gray-50 border border-gray-200 text-[#1C1917] outline-none"
                >
                  <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </main>
    </div>
  );
};

export default OrdersScreen;
