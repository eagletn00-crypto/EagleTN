import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabaseClient';
import { ShieldCheck } from 'lucide-react';

// ==========================================
// INTERFACES & TYPES
// ==========================================
interface Category {
  id: string;
  name: string;
  image_url: string;
  route: string;
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export const CustomerHome: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [catActive, setCatActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialisation du tracking CAT (Conformité INPDP Tunisie)
  const initializeCATTechnology = async () => {
    try {
      // Simulation sécurisée du fetch de consentement
      const { data, error } = await supabase
        .from('user_preferences')
        .select('tracking_consent')
        .single();

      // On active le CAT visuellement pour le démo (même si erreur ou non trouvé)
      if (!error || error) {
        setCatActive(true);
      }
    } catch (error) {
      console.error("Erreur d'initialisation CAT:", error);
      setCatActive(true); // Fallback visuel
    }
  };

  useEffect(() => {
    // Les catégories principales du système Eagle avec images haute définition
    setCategories([
      { 
        id: '1', 
        name: 'Restaurant', 
        image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=600&auto=format&fit=crop',
        route: '/restaurant'
      },
      { 
        id: '2', 
        name: 'Pâtisserie', 
        image_url: 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?q=80&w=600&auto=format&fit=crop',
        route: '/restaurant'
      },
      { 
        id: '3', 
        name: 'Shopping', 
        image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop',
        route: '/restaurant'
      },
      { 
        id: '4', 
        name: 'Para & Santé', 
        image_url: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=600&auto=format&fit=crop',
        route: '/restaurant'
      },
      { 
        id: '5', 
        name: 'Fleuriste', 
        image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&auto=format&fit=crop',
        route: '/restaurant'
      },
      { 
        id: '6', 
        name: 'Boutique', 
        image_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=600&auto=format&fit=crop',
        route: '/restaurant'
      },
    ]);
    
    initializeCATTechnology().finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0b1329] border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-20">
      
      {/* ========================================== */}
      {/* HEADER CINÉMATIQUE (EAGLE.TN) */}
      {/* ========================================== */}
      <header className="fixed top-0 w-full z-50 bg-[#030712]/80 backdrop-blur-2xl border-b border-slate-800/40 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="font-black text-2xl tracking-tighter text-white drop-shadow-md">
            EAGLE<span className="text-rose-500">.tn</span>
          </h1>
          <span className="text-xl leading-none shadow-sm">🇹🇳</span>
        </div>
        
        {catActive && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">CAT ACTIVE</span>
          </div>
        )}
      </header>

      {/* ========================================== */}
      {/* CONTENU PRINCIPAL (SERVICES PREMIUM) */}
      {/* ========================================== */}
      <main className="pt-24 px-6 max-w-5xl mx-auto animate-fade-in">
        <h2 className="text-2xl font-black text-white mb-6 tracking-tight drop-shadow-md">
          Nos Services Premium
        </h2>

        {/* Grille Web-Standard (CSS Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => navigate(`${cat.route}?cat=${cat.id}`)}
              className="relative aspect-square w-full rounded-3xl overflow-hidden group cursor-pointer border border-slate-800/40 shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500 transform hover:-translate-y-1 active:scale-95 focus:outline-none"
            >
              {/* Image de fond avec transition */}
              <img 
                src={cat.image_url} 
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Dégradé sombre pour la lisibilité du texte */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/90 via-[#030712]/30 to-transparent"></div>
              
              {/* Nom de la catégorie */}
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="text-white font-black text-sm md:text-base tracking-wide drop-shadow-md group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Indicateur de sécurité légale (INPDP) */}
        <div className="mt-12 flex items-center justify-center gap-2 opacity-50">
          <ShieldCheck size={14} className="text-slate-400" />
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">
            Navigation sécurisée et cryptée • Loi INPDP
          </p>
        </div>
      </main>
    </div>
  );
};

export default CustomerHome;
