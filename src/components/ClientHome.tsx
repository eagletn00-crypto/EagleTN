import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function ClientHome() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const navigate = useNavigate();

  // فئات الأكلات بالـ Emojis المطابقة تماماً للصورة 1000095471.png
  const categories = [
    { name: 'Tout', emoji: '🍳' },
    { name: 'Kaftaji', emoji: '🍳' },
    { name: 'Couscous', emoji: '🍲' },
    { name: 'Maison', emoji: '🍲' },
    { name: 'Sandwich', emoji: '🥪' }
  ];

  // الستوريات اليومية المطابقة للصورة 1000095471.png
  const stories = [
    { id: 1, name: 'Eagle.tn', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100' },
    { id: 2, name: 'Am Ali', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100' },
    { id: 3, name: 'El Baraka', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100' }
  ];

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('restaurants').select('*');
      if (error) throw error;
      if (data) setRestaurants(data);
    } catch (err) {
      console.error("Error fetching premium home data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();

    // استماع لحظي في حال فتح أو غلق الشركاء لمطابقتها فوراً أمام العميل
    const channel = supabase
      .channel('client-realtime-restaurants')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurants' }, () => {
        fetchRestaurants();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // تصفية المطاعم حسب البحث والفئة المختارة
  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch = r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tout' || r.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#0b111e] min-h-screen pb-32 font-sans antialiased text-white select-none" dir="ltr">
      
      {/* 👑 1. الترويسة الملكية المظلمة الفخمة (علم تونس + الـ Startup Act) */}
      <div className="bg-[#161f30] px-4 pt-5 pb-4 sticky top-0 z-50 border-b border-gray-800 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦅</span>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black tracking-tight text-white">Eagle<span className="text-amber-500">.tn</span></h1>
              <span className="text-xs">🇹🇳</span>
            </div>
            <span className="text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-extrabold tracking-wider block mt-0.5 uppercase">
              🏛️ STARTUP ACT
            </span>
          </div>
        </div>

        {/* جرس الإشعارات التنبيهي الفاخر */}
        <div className="flex items-center gap-3">
          <div className="relative p-2 bg-gray-800/80 rounded-xl border border-gray-700/60 flex items-center justify-center">
            <span className="text-sm">🔔</span>
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#161f30]">
              2
            </span>
          </div>
          <button className="text-gray-400 text-xl font-bold bg-transparent border-0 outline-none">
            ☰
          </button>
        </div>
      </div>

      {/* 🔍 2. شريط البحث المطور مع الميكروفون الذهبي */}
      <div className="px-4 mt-4">
        <div className="bg-[#161f30] border border-gray-800 rounded-2xl px-4 py-3 flex items-center justify-between shadow-lg focus-within:border-amber-500 transition-colors">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-gray-500 text-sm">🔍</span>
            <input 
              type="text" 
              placeholder="Rechercher un plat ou un restaurant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold outline-none text-white placeholder-gray-500"
            />
          </div>
          <span className="bg-amber-500 text-slate-950 p-1.5 rounded-xl text-xs font-black cursor-pointer shadow-md">
            🎙️
          </span>
        </div>
      </div>

      {/* 🍕 3. شريط الفئات المتنقل الفاخر بالـ Emojis */}
      <div className="mt-4 overflow-x-auto no-scrollbar flex gap-2.5 px-4 pb-2">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border shrink-0 transition-all ${
              selectedCategory === cat.name
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md transform scale-105'
                : 'bg-[#161f30] text-gray-300 border-gray-800'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* ⚡ 4. بنر عروض اللحظة التفاعلي الكلاسيكي */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-amber-500 to-yellow-500 p-3 rounded-2xl shadow-lg text-slate-950 flex justify-between items-center font-black text-xs cursor-pointer active:scale-95 transition-transform">
        <span>Commander Maintenant ➔</span>
        <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded-lg text-[9px]">LIVE 🔴</span>
      </div>

      {/* 📸 5. قسم الستوريات اليومية (STORIES DU JOUR) */}
      <div className="mt-5 px-4">
        <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1">
          <span className="text-red-500">●</span> STORIES DU JOUR
        </h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
              <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-red-500 to-yellow-400 group-active:scale-95 transition-transform">
                <img src={story.img} alt="" className="w-full h-full rounded-full object-cover border-2 border-[#0b111e]" />
              </div>
              <span className="text-[10px] font-bold text-gray-400">{story.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 🍲 6. قسم عرض المطاعم الفاخرة الكبرى (Nos Partenaires Premium) */}
      <div className="mt-6 px-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-widest border-l-2 border-amber-500 pl-2">
            Nos Partenaires Premium
          </h3>
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[8px] font-black px-2 py-0.5 rounded">TOP 7</span>
        </div>

        {loading ? (
          <p className="text-center text-xs text-gray-500 py-6 font-bold">Chargement des délices locaux... 🍲</p>
        ) : filteredRestaurants.length === 0 ? (
          <p className="text-center text-xs text-gray-600 py-6 font-bold">Aucun partenaire disponible actuellement.</p>
        ) : (
          <div className="space-y-5">
            {filteredRestaurants.map((rest) => {
              const coverImg = rest.cover_url || rest.banner_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600";
              const isKitchenOpen = rest.is_open !== false; // قراءة فتح وغلق المطبخ حياً من عم علي

              return (
                <div 
                  key={rest.id}
                  onClick={() => navigate(`/restaurant/${rest.id}`)} // فتح صفحة المنيو الحصرية للمطعم المختار عبر الـ ID
                  className="bg-[#161f30] rounded-[28px] overflow-hidden border border-gray-800/60 shadow-2xl relative cursor-pointer transform active:scale-[0.99] transition-all group"
                >
                  {/* الغلاف العملاق الفاخر للمطعم */}
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img 
                      src={coverImg} 
                      alt={rest.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161f30] via-transparent to-transparent"></div>
                    
                    {/* شارة مفتوح/مغلق الحية والمتحركة فوق الغلاف */}
                    <span className={`absolute top-4 right-4 text-[9px] font-black px-2.5 py-1 rounded-xl border shadow-lg ${
                      isKitchenOpen 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      ● {isKitchenOpen ? 'OUVERT' : 'FERMÉ'}
                    </span>

                    {/* تفاصيل المطعم والوجبة الترويجية المكتوبة بخط فخم أسفل الغلاف */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <h4 className="text-base font-black tracking-tight text-white">{rest.name} 👑</h4>
                      <p className="text-[10px] text-amber-400 font-bold mt-0.5">✦ Spécialité: {rest.category || 'Terroir 1979'} • 15.000 DT</p>
                    </div>
                  </div>

                  {/* بيانات التوصيل التقييم والسرعة والزر السفلي */}
                  <div className="p-4 flex justify-between items-center bg-[#1a2436] border-t border-gray-800/40 font-bold text-[10px] text-gray-400">
                    <div className="flex gap-4">
                      <span>⏱️ 25–35 min</span>
                      <span>🏍️ 3.000 DT</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 font-black">
                      <span>★ 4.9</span>
                      <span className="text-gray-500 text-[9px] font-normal">(2 400)</span>
                    </div>
                  </div>
                  
                  <div className="bg-[#161f30] py-2.5 text-center text-xs font-black text-amber-500 hover:text-white transition-colors border-t border-gray-800/40">
                    Consulter le Menu ➔
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 💬 7. زر الواتساب العائم للدعم السريع */}
      <a 
        href="https://wa.me/21655123456" 
        target="_blank" 
        rel="noreferrer" 
        className="fixed bottom-20 right-4 bg-[#25d366] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl z-50 animate-bounce cursor-pointer active:scale-95 transition-transform"
      >
        <span className="text-2xl">💬</span>
      </a>

      {/* 🧭 8. شريط التنقل السفلي الفخم والمتناسق */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#161f30]/95 backdrop-blur-md border-t border-gray-800/80 p-3.5 flex justify-around items-center z-50 shadow-2xl">
        <div onClick={() => fetchRestaurants()} className="flex flex-col items-center gap-0.5 text-amber-500 cursor-pointer">
          <span className="text-base">🏠</span>
          <span className="text-[9px] font-black tracking-wide">Accueil</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-gray-500 cursor-pointer">
          <span className="text-base">🔍</span>
          <span className="text-[9px] font-black tracking-wide">Explorer</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-gray-500 cursor-pointer">
          <span className="text-base">📄</span>
          <span className="text-[9px] font-black tracking-wide">Commandes</span>
        </div>
        <Link to="/login" className="flex flex-col items-center gap-0.5 text-gray-500 cursor-pointer">
          <span className="text-base">👤</span>
          <span className="text-[9px] font-black tracking-wide">Profil</span>
        </Link>
      </div>

    </div>
  );
}
