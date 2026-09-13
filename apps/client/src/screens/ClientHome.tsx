import React, { useState, useEffect } from 'react';
import { Partner } from '../types/partner';
import { supabase } from '../lib/supabase';

interface ClientHomeProps {
  onSelectPartner?: (partner: Partner) => void;
  onNavigate?: (screen: string) => void;
}

export const ClientHome: React.FC<ClientHomeProps> = ({ onSelectPartner, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .eq('is_active', true);

        if (error || !data || data.length === 0) {
          setPartners([
            {
              id: 'partner-om-ali',
              name: 'Chez Om Ali (مطعم عم علي)',
              legal_name: 'Chez Om Ali SARL',
              tax_id: '1234567/A/M/000',
              rating: 5.0,
              delivery_fee: 2.500,
              estimated_time: '15-25 min',
              is_active: true,
              latitude: 36.8065,
              longitude: 10.1815,
              created_at: new Date().toISOString(),
            },
            {
              id: 'partner-el-mida',
              name: 'RESTAURANT EL MIDA',
              legal_name: 'EL MIDA SARL',
              tax_id: '9876543/B/M/000',
              rating: 4.8,
              delivery_fee: 3.000,
              estimated_time: '20-30 min',
              is_active: true,
              latitude: 36.8065,
              longitude: 10.1815,
              created_at: new Date().toISOString(),
            }
          ]);
        } else {
          setPartners(data);
        }
      } catch (err) {
        console.error('Error fetching partners:', err);
      }
    }

    fetchPartners();
  }, []);

  // أيقونات SVG بريميوم فائقة الاحترافية ومريحة للبصر
  const categories = [
    {
      id: 'rest',
      label: 'Restaurants',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      )
    },
    {
      id: 'pat',
      label: 'Pâtisserie',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
          <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
          <path d="M2 21h20" />
          <path d="M7 8v3" /><path d="M12 8v3" /><path d="M17 8v3" />
          <path d="M7 4h10" />
        </svg>
      )
    },
    {
      id: 'mode',
      label: 'Shopping',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      )
    },
    {
      id: 'cosm',
      label: 'Cosmétique',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z" />
        </svg>
      )
    },
  ];

  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 font-sans pb-36 antialiased select-none">
      
      {/* Header Premium */}
      <div className="bg-white px-5 pt-5 pb-4 border-b border-slate-100 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Eagle <span className="text-red-600">TN</span>
            </span>
            <span className="text-xs bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full border border-red-100">
              🇹🇳 Tunisie
            </span>
          </div>

          <button 
            onClick={() => alert('Service Client EAGLE TN: +216 98 000 000')}
            className="text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition active:scale-95 flex items-center gap-1.5"
          >
            <span>📞</span> Service Client
          </button>
        </div>

        {/* Location Bar */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2 mb-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="text-xs font-bold text-slate-800 truncate">
              Avenue Habib Bourguiba, Tunis
            </span>
          </div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">Changer</span>
        </div>

        {/* Search Input */}
        <div className="relative flex items-center">
          <svg className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Chercher un restaurant, plat, produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 text-slate-400 text-xs hover:text-slate-600">✕</button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="mt-5 px-5">
        <h3 className="text-[11px] font-black text-slate-400 tracking-wider uppercase mb-3">
          Catégories
        </h3>

        <div className="grid grid-cols-4 gap-2.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition duration-200 active:scale-95 ${
                  isSelected 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white border border-slate-200/70 text-slate-700 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className={isSelected ? 'text-white' : 'text-slate-700'}>
                  {cat.icon}
                </div>
                <span className="text-[10px] font-bold tracking-tight text-center truncate w-full">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Banner - Marketing & Appetite Psychology */}
      <div className="mt-5 mx-5 bg-gradient-to-r from-red-600 to-amber-600 rounded-3xl p-4 text-white relative overflow-hidden shadow-lg shadow-red-950/10">
        <div className="relative z-10">
          <span className="bg-white/20 backdrop-blur-md text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full">
            Livraison Express 🇹🇳
          </span>
          <h4 className="text-base font-black mt-2 leading-tight">
            أبَنّ المأكولات التونسية
          </h4>
          <p className="text-xs text-red-100 font-medium mt-1">
            وصول سريع، دفع عند الاستلام وسعر شفاف.
          </p>
        </div>
        <div className="absolute -right-4 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* Partners Section */}
      <div className="mt-6 px-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-black text-slate-400 tracking-wider uppercase">
            Nos Partenaires
          </h3>
          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            {filteredPartners.length} Ouverts
          </span>
        </div>

        <div className="space-y-4">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              onClick={() => {
                if (onSelectPartner) {
                  onSelectPartner(partner);
                }
              }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md cursor-pointer active:scale-[0.98] transition duration-200 group"
            >
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                  alt={partner.name}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
                />
                
                {/* Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-900 font-black text-[11px] px-3 py-1 rounded-full shadow-md">
                  {partner.name}
                </div>

                {/* Rating */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <span className="text-amber-400">★</span> {partner.rating} <span className="text-slate-300 font-normal">(142)</span>
                </div>
              </div>

              {/* Bottom Metadata Bar */}
              <div className="p-3.5 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                    ⏱️ {partner.estimated_time}
                  </span>
                  <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-xl">
                    🛵 {partner.delivery_fee.toFixed(3)} DT
                  </span>
                </div>

                <span className="text-emerald-600 font-black text-[11px] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Commander
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Bottom Navigation Bar - Fixed */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-full p-1.5 shadow-2xl flex items-center justify-between z-50">
        <button 
          onClick={() => onNavigate && onNavigate('HOME')}
          className="flex-1 py-2 rounded-full bg-slate-900 text-white shadow-xs flex items-center justify-center gap-2 font-bold text-xs"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          Accueil
        </button>

        <button 
          onClick={() => onNavigate && onNavigate('ORDER_TRACKING')}
          className="flex-1 py-2 text-slate-500 hover:text-slate-900 flex items-center justify-center gap-2 font-bold text-xs transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          Suivi
        </button>
      </div>

    </div>
  );
};

export default ClientHome;
