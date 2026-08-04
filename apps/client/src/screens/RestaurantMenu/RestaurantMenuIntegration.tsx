import React, { useState } from 'react';
import CartAndCheckout from '../CartAndCheckout';

export const RestaurantMenuIntegration = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // دالة تُستدعى فور الضغط على Ajouter داخل المودال
  const handleAddItemFromModal = (item: { id: string; name: string; price: number }, quantity: number) => {
    const newItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: quantity
    };

    setCartItems(prev => [...prev, newItem]);
    setIsCartOpen(true); // فتح السلة الجاهزة للدفع مباشرة
  };

  return (
    <div className="relative">
      {/* شاشة السلة والدفع المربوطة بـ Supabase */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <CartAndCheckout
            partnerId="4a6a5814-1234-4bc3-a808-demo" // سيتم جلب الـ ID الحقيقي من المنيو
            items={cartItems}
            onClose={() => setIsCartOpen(false)}
            onOrderSuccess={(orderId) => {
              setIsCartOpen(false);
              setCartItems([]);
              alert(`تم تسجيل الطلب رقم ${orderId} بنجاح في Supabase! 🦅`);
            }}
          />
        </div>
      )}
    </div>
  );
};
