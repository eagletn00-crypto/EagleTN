import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function RestaurantMenu() {
  const { restaurantId } = useParams();
  const [cart, setCart] = useState<Array<{ name: string; price: number; quantity: number }>>([]);

  const menuItems = [
    { id: 1, name: 'بيتزا مارغريتا', price: 8.99, description: 'بيتزا إيطالية كلاسيكية' },
    { id: 2, name: 'بيتزا بيبروني', price: 10.99, description: 'بيتزا لذيذة مع البيبروني' },
    { id: 3, name: 'سلطة يونانية', price: 5.99, description: 'سلطة طازة صحية' },
    { id: 4, name: 'معكرونة كربونارا', price: 9.99, description: 'معكرونة إيطالية شهية' },
  ];

  const addToCart = (item: typeof menuItems[0]) => {
    const existingItem = cart.find(c => c.name === item.name);
    if (existingItem) {
      setCart(cart.map(c => c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { name: item.name, price: item.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemName: string) => {
    setCart(cart.filter(c => c.name !== itemName));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/client-home" className="flex items-center gap-2 text-xl font-bold hover:text-amber-400">
              ← العودة
            </Link>
            <h1 className="text-2xl font-bold">قائمة المطعم</h1>
            <div className="text-sm text-zinc-400">ID: {restaurantId}</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">الأطباق المتاحة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-amber-500 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <span className="text-amber-500 font-bold">${item.price}</span>
                  </div>
                  <p className="text-zinc-400 text-sm mb-4">{item.description}</p>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors"
                  >
                    أضف للسلة
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-zinc-900 border border-amber-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">🛒 سلتك</h3>

              {cart.length === 0 ? (
                <p className="text-zinc-400 text-center py-8">السلة فارغة</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-2 bg-zinc-800 rounded text-sm"
                      >
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-zinc-400">
                            {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.name)}
                          className="text-red-500 hover:text-red-400 font-bold ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-zinc-700 pt-4 mb-4">
                    <div className="flex justify-between font-bold text-lg mb-2">
                      <span>الإجمالي:</span>
                      <span className="text-amber-500">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <button className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors">
                    تأكيد الطلب
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
