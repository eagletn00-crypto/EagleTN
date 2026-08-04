import React, { useState } from 'react';
import CartAndCheckout from '../CartAndCheckout';

export const RestaurantMenu = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);

  // دالة تُحاكي الوجبة المختارة عند الضغط على +
  const handleOpenModal = (item: any) => {
    setSelectedItem(item);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    
    const newItem = {
      id: selectedItem.id || 'item-' + Date.now(),
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: quantity
    };

    setCartItems(prev => [...prev, newItem]);
    setSelectedItem(null);
    setIsCheckoutOpen(true); // فتح شاشة الدفع فوراً
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dir-rtl text-right">
      {/* رأس الصفحة */}
      <div className="relative h-48 bg-gray-900 text-white p-4 flex flex-col justify-end">
        <h1 className="text-2xl font-bold">Restaurant Eagle TN</h1>
        <p className="text-xs text-gray-300">سوسة، تونس • 15-25 min</p>
      </div>

      {/* نموذج المودال عند إضافة الوجبة */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-bold text-gray-900">{selectedItem.name}</h3>
            
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-xl">
              <span className="text-sm font-semibold text-gray-600">Quantité</span>
              <div className="flex items-center space-x-3 space-x-reverse">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 bg-white shadow rounded-lg text-lg font-bold"
                >-</button>
                <span className="font-bold text-gray-800">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 bg-white shadow rounded-lg text-lg font-bold"
                >+</button>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedItem(null)} 
                className="w-1/2 py-2.5 border rounded-xl font-semibold text-gray-600"
              >
                Annuler
              </button>
              <button 
                onClick={handleAddToCart}
                className="w-1/2 py-2.5 bg-emerald-500 text-white rounded-xl font-bold shadow-md hover:bg-emerald-600"
              >
                Ajouter ({(selectedItem.price * quantity).toFixed(3)} DT)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة السلة الشاملة المربوطة بـ Supabase */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden">
            <CartAndCheckout
              partnerId="4a6a5814-1234-4bc3-a808-demo"
              items={cartItems}
              onClose={() => setIsCheckoutOpen(false)}
              onOrderSuccess={(orderId) => {
                setIsCheckoutOpen(false);
                setCartItems([]);
                alert(`🦅 تم تسجيل الطلب بنجاح في قاعدة البيانات!\nرقم الطلب: ${orderId}`);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
