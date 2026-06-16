import React from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantScreen = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 'restaurant', name: 'Restaurant', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600' },
    { id: 'patisserie', name: 'Pâtisserie', img: 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?q=80&w=600' },
    { id: 'shopping', name: 'Shopping', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600' },
    { id: 'parapharmacie', name: 'Para & Santé', img: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=600' },
    { id: 'fleuriste', name: 'Fleuriste', img: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600' },
    { id: 'boutique', name: 'Boutique', img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=600' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <header className="bg-white/80 backdrop-blur-md p-5 sticky top-0 z-40 border-b border-gray-100 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-black tracking-widest text-[#1A1A1A]">
          EAGLE<span className="text-[#E3000F]">.tn</span> <span className="text-sm">🇹🇳</span>
        </h1>
        {/* شارة التتبع النابضة - تم تصحيح الأقواس هنا بنجاح */}
        <div className="flex items-center gap-2 bg-white/50 border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[9px] font-black text-gray-500 tracking-widest uppercase">Active</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-5">
        <h2 className="text-2xl font-black mb-6 text-[#1A1A1A]">Nos Services Premium</h2>
        
        {/* صور سينمائية للتصنيفات */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {categories.map((cat) => (
            <div key={cat.id} onClick={() => navigate(`/category/${cat.id}`)} className="relative h-44 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer group">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/20 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-white font-black tracking-wider text-sm">{cat.name}</h3>
            </div>
          ))}
        </div>

        {/* أزرار الشراكة مفعلة وترتبط بالواجهة القانونية */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button onClick={() => navigate('/join/partner')} className="bg-[#1A1A1A] text-[#FFD700] py-4 rounded-2xl font-bold uppercase text-xs shadow-lg hover:bg-[#E3000F] hover:text-white transition-all transform hover:-translate-y-1">
            Devenir Partenaire
          </button>
          <button onClick={() => navigate('/join/courier')} className="bg-white border border-gray-200 text-[#1A1A1A] py-4 rounded-2xl font-bold uppercase text-xs shadow-sm hover:bg-gray-50 transition-all transform hover:-translate-y-1">
            Devenir Coursier
          </button>
        </div>

        <footer className="text-center border-t border-gray-200 pt-6">
          <p className="text-[#10B981] font-black tracking-widest text-sm mb-2">COPYRIGHT BY EAGLE GROUPE.TN 🇹🇳</p>
          <p className="text-[10px] text-gray-400 font-mono">Conforme à la Loi N° 2004-63 (INPDP). Vos données sont cryptées.</p>
        </footer>
      </div>
    </div>
  );
};

export default RestaurantScreen;
