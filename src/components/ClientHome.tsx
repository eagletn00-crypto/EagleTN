import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import RestaurantMenu from './RestaurantMenu';

export default function ClientHome() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedResto, setSelectedResto] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('Tout');

  const categories = [
    { id: 'all', name: 'Tout', emoji: '🍔' },
    { id: 'kaftaji', name: 'Kaftaji', emoji: '🍳' },
    { id: 'sandwich', name: 'Sandwich', emoji: '🥪' },
    { id: 'couscous', name: 'Couscous', emoji: '🍲' },
    { id: 'pizza', name: 'Pizza', emoji: '🍕' }
  ];

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('restaurants').select('*');
      if (data) setRestaurants(data);
    };
    fetch();
  }, []);

  if (selectedResto) return <RestaurantMenu onBack={() => setSelectedResto(false)} />;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900">
      
      {/* 1. الشريط العلوي بالهوية التونسية */}
      <nav className="bg-white px-5 py-4 flex justify-between items-center sticky top-0 shadow-sm z-50 border-b-2 border-red-600">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Eagle<span className="text-red-600">.tn</span> 🦅
          </h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tunis Capital 🇹🇳</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-black border border-red-200 text-xs">
          🇹🇳
        </div>
      </nav>

      {/* 2. شريط البحث */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="relative flex items-center bg-gray-100 rounded-2xl px-4 py-3.5 shadow-inner">
          <span className="text-gray-400 mr-2">🔍</span>
          <input 
            type="text" 
            placeholder="Rechercher un plat ou un restaurant..." 
            className="bg-transparent bg-none border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400"
            disabled
          />
        </div>
      </div>

      {/* 3. شريط التصنيفات الأفقي بالأحمر والأبيض */}
      <div className="p-4 overflow-x-auto flex gap-3 no-scrollbar bg-white shadow-sm">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap ${
              activeCategory === cat.name 
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20 scale-105' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 4. محتوى المطاعم الرئيسي الممتد */}
      <div className="p-4 space-y-5">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-wider">Nos Partenaires Premium</h2>
          <span className="text-xs font-bold text-red-600">Voir tout</span>
        </div>

        {restaurants.map((r) => (
          <button 
            key={r.id}
            onClick={() => setSelectedResto(true)}
            className="w-full bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100/80 transition-all active:scale-[0.98] text-left flex flex-col"
          >
            {/* غلاف المطعم بخلفية متناسقة دافئة */}
            <div className="h-44 w-full bg-gradient-to-br from-red-50 to-gray-100 relative flex items-center justify-center border-b border-gray-50">
              <span className="text-5xl">🥘</span>
              <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-full text-[10px] font-black text-white shadow-sm">
                ✓ LIVRAISON GRATUITE
              </div>
            </div>

            {/* تفاصيل المطعم */}
            <div className="p-5 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-lg tracking-tight">{r.name}</h3>
                  <p className="text-gray-400 text-xs mt-0.5 font-medium">{r.description || 'Hergma • Kammounia • Couscous'}</p>
                </div>
                <div className="bg-red-50 text-red-600 font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1 border border-red-100">
                  <span>{r.rating || '4.5'}</span>
                  <span>⭐</span>
                </div>
              </div>

              {/* شريط معلومات التوصيل والوقت */}
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500 font-bold">
                <div className="flex items-center gap-1 text-gray-700">
                  <span className="text-gray-400">🕒</span>
                  <span>20-35 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">🛵</span>
                  <span className="text-gray-900">{r.delivery_fee || '2.5'} DT</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md uppercase font-black tracking-wider">
                  {r.status === 'open' ? 'Ouvert' : 'Fermé'}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 5. شريط التنقل السفلي بالأحمر التونسي للعنصر النشط */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.02)] z-50">
        <button className="flex flex-col items-center gap-0.5 text-red-600">
          <span className="text-lg">🏠</span>
          <span className="text-[10px] font-black">Accueil</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-gray-400">
          <span className="text-lg">🧭</span>
          <span className="text-[10px] font-bold">Explorer</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-gray-400">
          <span className="text-lg">📦</span>
          <span className="text-[10px] font-bold">Commandes</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-gray-400">
          <span className="text-lg">👤</span>
          <span className="text-[10px] font-bold">Compte</span>
        </button>
      </div>

    </div>
  );
}
