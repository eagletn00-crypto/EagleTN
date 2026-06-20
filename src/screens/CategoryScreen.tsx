import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const CategoryScreen = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const isRestaurant = categoryName === 'restaurant';
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(isRestaurant);

  useEffect(() => {
    if (isRestaurant) {
      const fetchAmAli = async () => {
        // جلب بيانات عم علي الحقيقية من قاعدة البيانات (بافتراض أن الـ id هو 1)
        const { data, error } = await supabase.from('partners').select('*').eq('id', 1).single();
        if (!error && data) {
          setPartner(data);
        } else {
          // بيانات احتياطية في حال فشل الاتصال للحفاظ على الواجهة
          setPartner({
            id: 1,
            name: 'Chez Am Ali',
            category: 'Spécialités Tunisiennes',
            cover_url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=800',
            logo_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=200'
          });
        }
        setLoading(false);
      };
      fetchAmAli();
    }
  }, [isRestaurant]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <header className="bg-white/80 backdrop-blur-md p-5 sticky top-0 z-40 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="bg-[#F8F9FA] p-2 rounded-full hover:bg-gray-200 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="text-xl font-black capitalize tracking-widest text-[#1A1A1A]">{categoryName}</h1>
      </header>

      <div className="max-w-4xl mx-auto p-5 mt-2">
        {isRestaurant && !loading && partner ? (
          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
            {/* Cover Image احترافي */}
            <div className="h-40 md:h-56 relative w-full bg-gray-100">
              <img src={partner.cover_url} className="w-full h-full object-cover" alt="Cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase flex items-center gap-1.5 shadow-md">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> OUVERT
              </div>
            </div>
            
            {/* معلومات المطعم (إصلاح تداخل الـ Logo) */}
            <div className="px-6 pb-6 relative">
              <div className="flex justify-between items-end -mt-10 mb-4">
                <div className="w-20 h-20 bg-white p-1 rounded-2xl shadow-lg relative z-10">
                  <img src={partner.logo_url} className="w-full h-full object-cover rounded-xl" alt="Logo" />
                </div>
                <div className="flex gap-2">
                  <span className="bg-[#FAF9F6] border border-gray-200 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-md">🕒 11:00 - 23:00</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-black text-[#1A1A1A]">{partner.name}</h2>
              <p className="text-xs text-gray-500 font-medium mt-1">{partner.category} · Cité Ibn Khaldoun</p>
              
              {/* زر الدخول للمينو (عصري ومناسب الحجم) */}
              <button onClick={() => navigate(`/restaurant/menu/${partner.id}`)} className="mt-6 w-full bg-[#1A1A1A] text-[#FFD700] py-3.5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-[#E3000F] hover:text-white transition-all shadow-md">
                Consulter le Menu
              </button>
            </div>
          </div>
        ) : isRestaurant && loading ? (
           <div className="h-64 bg-gray-100 animate-pulse rounded-3xl"></div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <span className="text-6xl mb-4 block animate-bounce">🚀</span>
            <h2 className="text-2xl font-black text-[#1A1A1A]">À Bientôt !</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">Ce service sera bientôt disponible avec les meilleurs partenaires.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryScreen;
