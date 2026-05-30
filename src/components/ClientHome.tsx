import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function ClientHome() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const navigate = useNavigate();

  const fetchLiveHomeData = async () => {
    try {
      setLoading(true);
      // جلب المطاعم الحية من قاعدة البيانات
      const { data, error } = await supabase.from('restaurants').select('*');
      if (error) throw error;
      
      if (data) {
        setRestaurants(data);
        
        // استخراج الفئات ديناميكياً من قاعدة البيانات بدون كتابة أي زر ثابت يدوياً
        const extractedCats = ['Tout'];
        data.forEach(r => {
          if (r.category && !extractedCats.includes(r.category)) {
            extractedCats.push(r.category);
          }
        });
        setCategories(extractedCats);
      }
    } catch (err) {
      console.error("Error loading dynamic light home view:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveHomeData();

    // التحديث التلقائي واللحظي للشاشة عند حدوث أي تعديل في قاعدة البيانات
    const channel = supabase
      .channel('client-light-stream')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurants' }, () => {
        fetchLiveHomeData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // تصفية ديناميكية ذكية بحسب المدخلات
  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch = r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tout' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // خريطة الرموز التعبيرية للفئات الديناميكية لمنح الواجهة حيوية بصرية
  const getCategoryEmoji = (cat: string) => {
    if (cat === 'Tout') return '🔍';
    if (cat.toLowerCase().includes('kamounia') || cat.toLowerCase().includes('traditional')) return '🍲';
    if (cat.toLowerCase().includes('grillades')) return '🥩';
    if (cat.toLowerCase().includes('sandwich')) return '🥪';
    return '🍔';
  };

  return (
    <div className="bg-slate-50/80 min-h-screen pb-32 font-sans antialiased text-slate-900 select-none" dir="ltr">
      
      {/* 🏛️ 1. الترويسة العلوية الفخمة بالثيم الأبيض السلس المطابق للهيكلية الأصلية */}
      <div className="bg-white px-4 pt-5 pb-4 sticky top-0 z-50 border-b border-slate-100 flex items-center justify-between shadow-sm backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl filter drop-shadow-sm">🦅</span>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black tracking-tight text-slate-950">Eagle<span className="text-red-600">.tn</span></h1>
              <span className="text-xs">🇹🇳</span>
            </div>
            <span className="text-[8px] bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded font-extrabold tracking-wider block mt-0.5 uppercase">
              🏛️ STARTUP ACT
            </span>
          </div>
        </div>

        {/* جرس الإشعارات الملون الفاخر والأنيق */}
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-center text-slate-800 shadow-sm">
            <span className="text-sm">🔔</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
              2
            </span>
          </div>
          <button className="text-slate-700 text-xl font-bold bg-transparent border-0 outline-none">
            ☰
          </button>
        </div>
      </div>

      {/* 🔍 2. شريط البحث الأبيض الانسيابي مع ميكروفون البحث الذهبي */}
      <div className="px-4 mt-4">
        <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm focus-within:border-amber-500 transition-colors">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-slate-400 text-sm">🔍</span>
            <input 
              type="text" 
              placeholder="Rechercher un plat ou un restaurant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold outline-none text-slate-900 placeholder-slate-400"
            />
          </div>
          <span className="bg-amber-500 text-slate-950 p-1.5 rounded-xl text-xs font-black cursor-pointer shadow-sm active:scale-95 transition-transform">
            🎙️
          </span>
        </div>
      </div>

      {/* 🍕 3. شريط الأزرار الديناميكي الحقيقي بالكامل من السيرفر (قاعدة البيانات تعزف الفئات هنا) */}
      <div className="mt-4 overflow-x-auto no-scrollbar flex gap-2.5 px-4 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm transform scale-105'
                : 'bg-white text-slate-700 border-slate-200/80 shadow-sm'
            }`}
          >
            <span>{getCategoryEmoji(cat)}</span>
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* ⚡ 4. بنر عروض اللحظة التفاعلي الكلاسيكي الأصفر */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-amber-500 to-yellow-500 p-3 rounded-2xl shadow-sm text-slate-950 flex justify-between items-center font-black text-xs cursor-pointer active:scale-95 transition-transform">
        <span>Commander Maintenant ➔</span>
        <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded-lg text-[9px]">LIVE 🔴</span>
      </div>

      {/* 📸 5. قسم الستوريات المستخرجة ديناميكياً من صور اللوجو الحقيقية للمطاعم في Supabase */}
      <div className="mt-5 px-4">
        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
          <span className="text-red-500">●</span> STORIES DU JOUR
        </h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          <div onClick={() => setSelectedCategory('Tout')} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
            <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-red-500 to-yellow-400 border border-slate-100">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-black text-white border border-white">Eagle</div>
            </div>
            <span className="text-[10px] font-bold text-slate-500">Eagle.tn</span>
          </div>
          
          {restaurants.map((rest) => (
            <div 
              key={rest.id} 
              onClick={() => navigate(`/restaurant/${rest.id}`)}
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-red-500 to-yellow-400">
                <img 
                  src={rest.logo_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100"} 
                  alt="" 
                  className="w-full h-full rounded-full object-cover border-2 border-white bg-white" 
                />
              </div>
              <span className="text-[10px] font-bold text-slate-500 truncate max-w-[60px]">{rest.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 🍲 6. عرض بطاقات المطاعم البيضاء السلسة والفخمة */}
      <div className="mt-6 px-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-amber-500 pl-2">
            Nos Partenaires Premium
          </h3>
          <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[8px] font-black px-2 py-0.5 rounded">TOP 7</span>
        </div>

        {loading ? (
          <p className="text-center text-xs text-slate-400 py-6 font-bold">Chargement des partenaires premium... 🍲</p>
        ) : filteredRestaurants.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-6 font-bold">Aucun partenaire disponible.</p>
        ) : (
          <div className="space-y-5">
            {filteredRestaurants.map((rest) => {
              const coverImg = rest.cover_url || rest.banner_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600";
              const isKitchenOpen = rest.is_open !== false;

              return (
                <div 
                  key={rest.id}
                  onClick={() => navigate(`/restaurant/${rest.id}`)}
                  className="bg-white rounded-[28px] overflow-hidden border border-slate-100 shadow-sm relative cursor-pointer transform active:scale-[0.99] transition-all group"
                >
                  {/* الغلاف والظلال السلسة الناعمة */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img 
                      src={coverImg} 
                      alt={rest.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                    
                    <span className={`absolute top-4 right-4 text-[9px] font-black px-2.5 py-1 rounded-xl border shadow-md ${
                      isKitchenOpen 
                        ? 'bg-emerald-500 text-white border-emerald-400' 
                        : 'bg-red-500 text-white border-red-400'
                    }`}>
                      ● {isKitchenOpen ? 'OUVERT' : 'FERMÉ'}
                    </span>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h4 className="text-base font-black tracking-tight flex items-center gap-1">{rest.name} 👑</h4>
                      <p className="text-[10px] text-amber-300 font-bold mt-0.5">✦ Spécialité: {rest.category || 'Traditional'} • 15.000 DT</p>
                    </div>
                  </div>

                  <div className="p-4 flex justify-between items-center bg-slate-50/50 font-bold text-[10px] text-slate-500">
                    <div className="flex gap-4">
                      <span>⏱️ 25–35 min</span>
                      <span>🏍️ 3.000 DT</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-black">
                      <span>★ 4.9</span>
                      <span className="text-slate-400 text-[9px] font-normal">(2 400)</span>
                    </div>
                  </div>
                  
                  <div className="bg-white py-2.5 text-center text-xs font-black text-amber-600 hover:bg-slate-50 border-t border-slate-100 transition-colors">
                    Consulter le Menu ➔
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 💬 7. زر الدعم العائم الأخضر */}
      <a 
        href="https://wa.me/21655123456" 
        target="_blank" 
        rel="noreferrer" 
        className="fixed bottom-20 right-4 bg-[#25d366] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-50 animate-bounce cursor-pointer active:scale-95 transition-transform"
      >
        <span className="text-xl">💬</span>
      </a>

      {/* 🧭 8. شريط التنقل السفلي الفخم الفاتح والأنيق */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-3.5 flex justify-around items-center z-50 shadow-lg">
        <div onClick={() => fetchLiveHomeData()} className="flex flex-col items-center gap-0.5 text-amber-600 cursor-pointer">
          <span className="text-base">🏠</span>
          <span className="text-[9px] font-black tracking-wide">Accueil</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-slate-400 cursor-pointer">
          <span className="text-base">🔍</span>
          <span className="text-[9px] font-black tracking-wide">Explorer</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-slate-400 cursor-pointer">
          <span className="text-base">📄</span>
          <span className="text-[9px] font-black tracking-wide">Commandes</span>
        </div>
        <Link to="/login" className="flex flex-col items-center gap-0.5 text-slate-400 cursor-pointer">
          <span className="text-base">👤</span>
          <span className="text-[9px] font-black tracking-wide">Profil</span>
        </Link>
      </div>

    </div>
  );
}
