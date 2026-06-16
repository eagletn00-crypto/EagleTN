import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ClientHome = () => {
  const navigate = useNavigate();
  const [catActive, setCatActive] = useState(false);

  const categories = [
    { id: '1', name: 'Restaurant', icon: '🍔' },
    { id: '2', name: 'Pâtisserie', icon: '🍰' },
    { id: '3', name: 'Shopping', icon: '🛍️' },
    { id: '4', name: 'Parapharmacie', icon: '💊' },
    { id: '5', name: 'Fleuriste', icon: '💐' },
    { id: '6', name: 'Boutique', icon: '🏬' },
  ];

  // بيانات حقيقية متعاقدين معها - محاكاة من Supabase (Restaurant: Am Ali)
  const restaurantsData = [
    {
      id: 'res_001',
      name: 'Chez Am Ali - ولد علي',
      category: 'Tunisien Authentique',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1590577976322-3d2984920b7a?q=80',
      deliveryTime: '25-35 min',
    },
    // يمكن إضافة مطاعم أخرى هنا
  ];

  useEffect(() => {
    // محاكاة تفعيل تقنية CAT المتوافقة مع INPDP
    // نصوص الـ consent يجب أن تظهر هنا في حال التطوير الحقيقي
    setCatActive(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header - White Luxury with Gold Accent */}
        <header className="flex justify-between items-center mb-12 animate-fade-in-down border-b border-gray-100 pb-5 bg-white/60 backdrop-blur-md sticky top-0 z-40 px-4 py-3 rounded-2xl shadow-sm">
          <h1 className="text-4xl font-black tracking-widest">
            <span className="text-[#1A1A1A]">EAGLE</span><span className="text-[#FFD700]">.tn</span>
          </h1>
          {catActive && (
            <div className="bg-[#FFD700]/10 border border-[#FFD700]/40 px-4 py-2 rounded-full shadow-inner">
              <span className="text-[#FFD700] text-sm font-bold tracking-wider">📡 تتبع CAT نَشِط</span>
            </div>
          )}
        </header>

        {/* Section 1: Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-[#1A1A1A]">Que désirez-vous commander ?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.map((cat, index) => (
              <div 
                key={cat.id} 
                onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)}
                className={`bg-white border border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up delay-${index * 100}`}
              >
                <span className="text-5xl mb-4">{cat.icon}</span>
                <span className="text-base font-semibold text-[#1A1A1A]">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Restaurants (Haut Recommandé - Chez Am Ali) */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Restaurants Recommandés</h2>
            <button className="text-[#FFD700] font-semibold text-sm hover:underline">Voir tout</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {restaurantsData.map((res) => (
              <div key={res.id} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <img src={res.image} alt={res.name} className="w-full h-48 object-cover rounded-2xl mb-5" />
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-[#1A1A1A]">{res.name}</h3>
                    <p className="text-eagle-textSec text-sm mt-1">{res.category}</p>
                  </div>
                  <div className="flex items-center bg-[#FFD700]/10 px-3 py-1 rounded-full border border-[#FFD700]/30">
                    <span className="text-[#FFD700] mr-1">⭐</span>
                    <span className="text-[#FFD700] font-bold text-sm">{res.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-5 pt-5 border-t border-gray-100 text-sm text-eagle-textSec">
                  <span>⏱️ {res.deliveryTime}</span>
                  <button onClick={() => navigate('/order/track')} className="text-[#FFD700] font-semibold">Tchatter & Commander</button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Section 3: Professional Access (Glassmorphism Light) */}
        <section className="bg-white border border-gray-100 rounded-3xl p-8 mb-12 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-[#1A1A1A]">Espace Professionnel Eagle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <button 
              onClick={() => navigate('/partner')}
              className="bg-[#FFD700] text-[#0A0A0A] font-bold uppercase py-4 rounded-xl transition-transform hover:scale-[1.01] shadow-md"
            >
              Devenir Partenaire (Restaurant)
            </button>
            <button 
              onClick={() => navigate('/livreur')}
              className="bg-[#FAF9F6] border border-gray-100 text-[#707070] font-bold uppercase py-4 rounded-xl transition-transform hover:scale-[1.01]"
            >
              Devenir Coursier (Portefeuille)
            </button>
          </div>
        </section>

        {/* Footer Legal (White Theme) */}
        <footer className="mt-20 pt-10 border-t border-gray-100 text-center opacity-70">
          <p className="text-[#FFD700] font-bold text-sm tracking-wider">COPYRIGHT BY EAGLE GROUPE.TN</p>
          <p className="text-xs mt-2 text-[#707070]">Conforme à la Loi N° 2004-63 (INPDP Tunisie) - Protection stricte des المعطيات الشخصية.</p>
        </footer>

      </div>
    </div>
  );
};

export default ClientHome;
