import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabaseClient';
import { 
  ArrowLeft, Star, Clock, MapPin, Search, 
  Crown, ShieldCheck, ChevronRight, AlertTriangle 
} from 'lucide-react';

// ==========================================
// INTERFACES & TYPES
// ==========================================
type SubscriptionTier = 'GOLD' | 'SILVER' | 'BRONZE';

interface Shop {
  id: string;
  category_id: string;
  name: string;
  description: string;
  rating: number;
  delivery_time: string;
  delivery_fee: number;
  is_open: boolean;
  cover_url: string;
  logo_url: string;
  subscription_tier: SubscriptionTier;
  tags: string[];
}

// ==========================================
// MOCK DATA (Données Simulées Riches)
// ==========================================
const MOCK_SHOPS: Shop[] = [
  // 1: Restaurants
  {
    id: '1', category_id: '1', name: 'Chez Am Ali', description: 'Cuisine traditionnelle tunisienne', rating: 4.9, delivery_time: '20-30 min', delivery_fee: 2500, is_open: true, cover_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800', logo_url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=200', subscription_tier: 'GOLD', tags: ['Tunisien', 'Fait Maison']
  },
  {
    id: '2', category_id: '1', name: 'El Khir w El Baraka', description: 'Grillades et Sandwichs', rating: 4.6, delivery_time: '15-25 min', delivery_fee: 1500, is_open: true, cover_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800', logo_url: 'https://images.unsplash.com/photo-1542834369-f81dc3311ce8?q=80&w=200', subscription_tier: 'SILVER', tags: ['Grillades', 'Fast Food']
  },
  // 2: Pâtisseries
  {
    id: '3', category_id: '2', name: 'Gourmandise TN', description: 'Pâtisserie fine et viennoiseries', rating: 4.8, delivery_time: '30-40 min', delivery_fee: 3000, is_open: true, cover_url: 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?q=80&w=800', logo_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=200', subscription_tier: 'GOLD', tags: ['Sucré', 'Premium']
  },
  // 3: Shopping
  {
    id: '4', category_id: '3', name: 'Zara Tunis', description: 'Mode et vêtements', rating: 4.5, delivery_time: '24h', delivery_fee: 5000, is_open: false, cover_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800', logo_url: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=200', subscription_tier: 'GOLD', tags: ['Vêtements', 'Mode']
  },
  // 4: Parapharmacie
  {
    id: '5', category_id: '4', name: 'Para Santé Express', description: 'Cosmétiques et soins', rating: 4.7, delivery_time: '30-45 min', delivery_fee: 2000, is_open: true, cover_url: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=800', logo_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=200', subscription_tier: 'SILVER', tags: ['Santé', 'Beauté']
  },
  // 5: Fleuriste
  {
    id: '6', category_id: '5', name: 'Rose de Sable', description: 'Bouquets et compositions florales', rating: 4.9, delivery_time: '1h', delivery_fee: 3500, is_open: true, cover_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800', logo_url: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=200', subscription_tier: 'BRONZE', tags: ['Cadeaux', 'Fleurs']
  }
];

const CATEGORY_NAMES: Record<string, string> = {
  '1': 'Restaurants',
  '2': 'Pâtisseries',
  '3': 'Shopping',
  '4': 'Parapharmacies',
  '5': 'Fleuristes',
  '6': 'Boutiques'
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export const ShopListing: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('cat') || '1'; // Default to 1 (Restaurant)
  
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const categoryName = CATEGORY_NAMES[categoryId] || 'Commerces';

  // ==========================================
  // DATA FETCHING & SORTING LOGIC
  // ==========================================
  useEffect(() => {
    // Simulation d'un appel réseau Supabase
    setIsLoading(true);
    
    setTimeout(() => {
      // 1. Filtrer par ID de catégorie
      let filteredShops = MOCK_SHOPS.filter(shop => shop.category_id === categoryId);
      
      // 2. Moteur de tri basé sur l'Abonnement SaaS (GOLD > SILVER > BRONZE)
      filteredShops.sort((a, b) => {
        const tierWeight = { 'GOLD': 3, 'SILVER': 2, 'BRONZE': 1 };
        // Tri primaire par abonnement
        if (tierWeight[a.subscription_tier] > tierWeight[b.subscription_tier]) return -1;
        if (tierWeight[a.subscription_tier] < tierWeight[b.subscription_tier]) return 1;
        // Tri secondaire par note (rating)
        return b.rating - a.rating;
      });

      setShops(filteredShops);
      setIsLoading(false);
    }, 600); // 600ms délai artificiel pour UX
  }, [categoryId]);

  // ==========================================
  // RENDER HELPERS
  // ==========================================
  const formatCurrency = (millimes: number) => (millimes / 1000).toFixed(3) + ' DT';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0b1329] border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 pb-20">
      
      {/* ========================================== */}
      {/* HEADER CINÉMATIQUE */}
      {/* ========================================== */}
      <header className="fixed top-0 w-full z-50 bg-[#030712]/80 backdrop-blur-2xl border-b border-slate-800/40 px-4 py-4 flex items-center justify-between shadow-sm transition-all">
        <button 
          onClick={() => navigate('/accueil')} 
          className="p-2.5 bg-[#0b1329] text-slate-300 hover:text-white rounded-full border border-slate-800/40 hover:border-amber-500/50 transition-colors active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        
        <h1 className="font-black text-lg tracking-wide text-white drop-shadow-md">
          {categoryName}
        </h1>
        
        <button className="p-2.5 bg-[#0b1329] text-slate-300 hover:text-white rounded-full border border-slate-800/40 hover:border-amber-500/50 transition-colors active:scale-95">
          <Search size={20} />
        </button>
      </header>

      {/* ========================================== */}
      {/* LISTE DES COMMERCES */}
      {/* ========================================== */}
      <main className="pt-24 px-4 max-w-3xl mx-auto animate-fade-in">
        
        {/* Résultat Rapide */}
        <div className="mb-6 flex justify-between items-center px-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {shops.length} Partenaire{shops.length > 1 ? 's' : ''} trouvé{shops.length > 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
            <ShieldCheck size={12}/> Partenaires Vérifiés
          </span>
        </div>

        {/* Grille des Magasins */}
        <div className="space-y-6">
          {shops.length === 0 ? (
            <div className="bg-[#0b1329]/40 border border-slate-800/40 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
               <AlertTriangle size={48} className="text-slate-600 mb-4" />
               <h3 className="text-lg font-black text-slate-300">Aucun partenaire disponible</h3>
               <p className="text-xs text-slate-500 mt-2 max-w-xs">Nous n'avons pas encore de partenaires actifs dans cette catégorie pour votre zone.</p>
               <button onClick={() => navigate('/accueil')} className="mt-6 bg-amber-500 text-[#030712] font-black text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-amber-400 transition-colors">
                 Retour à l'accueil
               </button>
            </div>
          ) : (
            shops.map((shop) => (
              <button 
                key={shop.id}
                onClick={() => navigate(`/restaurant/${shop.id}`)}
                className="w-full text-left bg-[#0b1329]/40 border border-slate-800/40 rounded-[2rem] overflow-hidden group hover:border-amber-500/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.05)] transform hover:-translate-y-1 block focus:outline-none"
              >
                {/* Couverture et Badges */}
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img src={shop.cover_url} alt={shop.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent"></div>
                  
                  {/* Badge Ouverture */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#030712]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50 shadow-lg">
                     <span className={`w-2 h-2 rounded-full ${shop.is_open ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                     <span className={`text-[9px] font-black uppercase tracking-widest ${shop.is_open ? 'text-emerald-400' : 'text-rose-400'}`}>
                       {shop.is_open ? 'Ouvert' : 'Fermé'}
                     </span>
                  </div>

                  {/* Badge Abonnement SaaS Premium (GOLD) */}
                  {shop.subscription_tier === 'GOLD' && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-gradient-to-r from-amber-600 to-amber-400 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                      <Crown size={12} className="text-white fill-white" />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Sponsorisé</span>
                    </div>
                  )}
                </div>

                {/* Détails du Magasin */}
                <div className="p-5 relative">
                  {/* Logo Flottant */}
                  <div className="absolute -top-12 right-6 w-16 h-16 rounded-2xl bg-[#030712] p-1 shadow-2xl border border-slate-700/50">
                    <img src={shop.logo_url} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                  </div>

                  {/* Titre et Tags */}
                  <div className="pr-20">
                    <h2 className="text-xl font-black text-white tracking-tight group-hover:text-amber-400 transition-colors">{shop.name}</h2>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{shop.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {shop.tags.map((tag, idx) => (
                        <span key={idx} className="bg-slate-800/60 text-slate-300 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-slate-700/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* KPIs de Livraison */}
                  <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-800/40">
                    <div className="flex items-center gap-1.5">
                      <Star size={14} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs font-black text-white">{shop.rating}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock size={14} />
                      <span className="text-xs font-bold">{shop.delivery_time}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin size={14} />
                      <span className="text-xs font-bold">{formatCurrency(shop.delivery_fee)}</span>
                    </div>
                    
                    <div className="ml-auto text-amber-500 group-hover:translate-x-1 transition-transform">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>

              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ShopListing;
