import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function RestaurantMenu() {
  const { id } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [restaurant, setRestaurant] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const { data: r } = await supabase.from('restaurants').select('*').eq('id', id).single();
      const { data: p } = await supabase.from('products').select('*').eq('restaurant_id', id);
      if (r) setRestaurant(r);
      if (p) setProducts(p);
    }
    load();
  }, [id]);

  const handleAddToCart = (p: any) => {
    const cart = JSON.parse(localStorage.getItem('eagle_cart') || '[]');
    cart.push({ id: p.id, name: p.name, price: p.price, image_url: p.image_url });
    localStorage.setItem('eagle_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart_updated'));
    alert('تمت الإضافة للسلة! 🦅');
  };

  return (
    <div className="bg-[#0b111e] min-h-screen text-white pb-20">
      <div className="p-4 flex justify-between items-center bg-gray-800">
        <h1 className="font-bold">{restaurant?.name || "Am Ali"}</h1>
        {/* رابط السلة المباشر */}
        <Link to="/cart" className="bg-red-600 px-4 py-2 rounded-xl font-bold">🛒 السلة</Link>
      </div>
      
      <div className="p-4 space-y-4">
        {products.map((p) => (
          <div key={p.id} className="bg-[#161f30] p-4 rounded-2xl flex justify-between items-center">
            <div>
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-yellow-400">{parseFloat(p.price).toFixed(3)} DT</p>
            </div>
            <button onClick={() => handleAddToCart(p)} className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-black">Ajouter +</button>
          </div>
        ))}
      </div>
    </div>
  );
}
