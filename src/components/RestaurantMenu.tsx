import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function RestaurantMenu() {
  const { id } = useParams(); // استقبال id المطعم من الرابط
  const [products, setProducts] = useState<any[]>([]);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenuData() {
      try {
        // 1. جلب بيانات المطعم الحالي
        const { data: restData } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .single();
        if (restData) setRestaurant(restData);

        // 2. جلب الأطباق المرتبطة بهذا المطعم من جدول products
        const { data: prodData } = await supabase
          .from('products')
          .select('*')
          .eq('restaurant_id', id);
        if (prodData) setProducts(prodData);

      } catch (err) {
        console.error("Error loading menu:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMenuData();
  }, [id]);

  // دالة الإضافة الاحترافية التي تحترم الـ Schema الخاص بك
  const handleAddToCart = async (product: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        if (localStorage.getItem("developer_bypass") !== "true") { alert("الرجاء تسجيل الدخول أولاً لإتمام الطلب!"); return; }
        return;
      }

      // أ. إنشاء الطلب الرئيسي في جدول orders
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            client_id: user.id,
            partner_id: product.restaurant_id,
            status: 'pending',
            total_price: product.price,
            delivery_fee: 4.000 
          }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // ب. إضافة الطبق وتفاصيله في جدول order_items المربوط بالطلب الرئيسي
      if (orderData) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert([
            {
              order_id: orderData.id,
              product_name: product.name,
              quantity: 1,
              price: product.price
            }
          ]);

        if (itemsError) throw itemsError;

        alert(`تمت إضافة ${product.name} إلى السلة بنجاح! 🛒`);
      }

    } catch (error: any) {
      console.error("خطأ أثناء إضافة الطلب:", error);
      alert("عذراً، حدث خطأ: " + (error.message || error));
    }
  };

  if (loading) return <div className="text-center p-10 text-white">جاري تحميل القائمة...</div>;

  return (
    <div className="bg-[#0b111e] min-h-screen pb-24 font-sans text-white">
      {/* غلاف المطعم العلوي */}
      <div className="h-48 bg-gray-800 relative flex items-end p-4 bg-cover bg-center" style={{ backgroundImage: `url(${restaurant?.banner_url || '/default-banner.png'})` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex items-center gap-3">
          <img src={restaurant?.logo_url || "/default-logo.png"} alt="" className="w-16 h-16 rounded-xl border-2 border-yellow-400 object-cover" />
          <div>
            <h1 className="text-xl font-bold">{restaurant?.name || "Am Ali Kitchen"}</h1>
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30 font-medium">● CARTE MENU LIVE</span>
          </div>
        </div>
      </div>

      {/* قائمة الأطباق المتاحة */}
      <div className="px-4 mt-6">
        <h2 className="text-yellow-500 text-xs font-bold uppercase tracking-wider border-l-2 border-yellow-500 pl-2 mb-4">LES PLATS DISPONIBLES</h2>
        
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-[#161f30] p-3 rounded-2xl border border-gray-800 flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <img src={product.image_url || "/default-dish.png"} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold text-sm text-gray-100">{product.name}</h3>
                  <p className="text-yellow-500 font-black text-xs mt-1">{product.price.toFixed(3)} DT</p>
                </div>
              </div>
              
              {/* زر إضافة التفاعلي المربوط بـ Supabase */}
              <button 
                onClick={() => handleAddToCart(product)}
                className="bg-yellow-400 text-gray-950 text-xs font-black px-4 py-2 rounded-xl shadow hover:bg-yellow-500 transition-all active:scale-95"
              >
                Ajouter +
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
