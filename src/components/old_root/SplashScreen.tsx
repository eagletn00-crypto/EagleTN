import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabaseClient';
import { ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [loadingStep, setLoadingStatus] = useState<string>("INITIALISATION DU CŒUR SÉCURISÉ...");

  useEffect(() => {
    let isMounted = true;

    const executeBootSequence = async () => {
      try {
        // 1. Délai d'exposition minimal pour la marque (UX Requirement)
        await new Promise(resolve => setTimeout(resolve, 600));

        // 2. HEALTH-CHECK & SESSION VALIDATION
        if (isMounted) setLoadingStatus("VALIDATION DU JETON D'AUTHENTIFICATION...");
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError) throw authError;

        if (!session) {
          // Visiteur non authentifié -> Routage B2C
          if (isMounted) setLoadingStatus("CHARGEMENT DE L'ENVIRONNEMENT PUBLIC...");
          await new Promise(resolve => setTimeout(resolve, 500));
          if (isMounted) triggerExit('/accueil');
          return;
        }

        // 3. RÉCUPÉRATION DU PROFIL B2B (Table: profiles)
        if (isMounted) setLoadingStatus("VÉRIFICATION DES HABILITATIONS (INMDP)...");
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') throw profileError;

        // 4. PRE-FETCH DATA ET ROUTAGE CONDITIONNEL
        if (profile?.role === 'partner') {
          if (isMounted) setLoadingStatus("SYNCHRONISATION DU LEDGER DES COMMANDES...");
          
          // Pre-fetch des commandes actives pour un affichage instantané dans le Dashboard (Table: orders)
          await supabase
            .from('orders')
            .select('id, status, created_at, customer_name, total_price')
            .eq('partner_id', session.user.id)
            .in('status', ['pending', 'accepted'])
            .limit(20);

          if (isMounted) triggerExit('/partner');
        } else if (profile?.role === 'livreur') {
          if (isMounted) triggerExit('/livreur');
        } else {
          // Client B2C authentifié
          if (isMounted) triggerExit('/accueil');
        }

      } catch (error) {
        console.error("Échec de la séquence d'amorçage :", error);
        // Fallback de sécurité garantissant que l'utilisateur n'est jamais bloqué sur un écran blanc
        if (isMounted) {
          setLoadingStatus("CONNEXION ANONYME (MODE DÉGRADÉ)...");
          setTimeout(() => triggerExit('/accueil'), 1200);
        }
      }
    };

    executeBootSequence();

    return () => {
      isMounted = false;
    };
  }, [navigate, onFinish]);

  const triggerExit = (targetRoute: string) => {
    setIsExiting(true);
    // Attendre la fin exacte de l'animation CSS (600ms) avant de démonter le composant du DOM
    setTimeout(() => {
      navigate(targetRoute, { replace: true });
      onFinish(); 
    }, 600);
  };

  return (
    <>
      <style>
        {`
          /* ========================================== */
          /* PREMIUM CORPORATE LIGHT THEME & ANIMATIONS */
          /* ========================================== */
          .eagle-bg-corporate {
            background-color: #F8F9FA;
            background-image: 
              linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(241,245,249,0.6) 100%);
          }
          
          .animate-eagle-reveal {
            animation: eagleReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            will-change: transform, opacity, filter;
          }

          .animate-slogan-rise {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
            animation: hardwareSloganRise 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
            animation-delay: 0.6s;
            will-change: transform, opacity;
          }

          .animate-loader-fade {
            opacity: 0;
            animation: hardwareFadeIn 0.5s ease-out forwards;
            animation-delay: 1s;
          }

          .animate-fade-out {
            animation: hardwareCinematicFadeOut 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          }

          @keyframes eagleReveal {
            0% { opacity: 0; transform: scale3d(0.9, 0.9, 1); filter: blur(5px); }
            100% { opacity: 1; transform: scale3d(1, 1, 1); filter: blur(0px); }
          }

          @keyframes hardwareSloganRise {
            0% { opacity: 0; transform: translate3d(0, 15px, 0); }
            100% { opacity: 1; transform: translate3d(0, 0, 0); }
          }
          
          @keyframes hardwareFadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }

          @keyframes hardwareCinematicFadeOut {
            0% { opacity: 1; transform: scale3d(1, 1, 1); }
            100% { opacity: 0; transform: scale3d(1.02, 1.02, 1); }
          }
        `}
      </style>

      {/* OVERLAY SÉCURISÉ GLOBAL */}
      <div className={`eagle-bg-corporate fixed inset-0 z-[9999] flex flex-col items-center justify-between overflow-hidden transition-opacity ${isExiting ? 'animate-fade-out' : ''}`}>
        
        {/* BARRE D'ACCENTUATION HAUTE (Corporate Slate/Gold) */}
        <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-80"></div>

        {/* CŒUR VISUEL (Logo + Identité) */}
        <div className="relative flex flex-col items-center z-10 flex-1 justify-center mt-[-4vh]">
          
          {/* Logo Container avec Ombre Portée Premium */}
          <div className="w-24 h-24 mb-6 relative animate-eagle-reveal flex items-center justify-center">
            <div className="absolute inset-0 bg-white rounded-2xl shadow-[0_15px_35px_-5px_rgba(15,23,42,0.08)] transform rotate-3 transition-transform"></div>
            
            {/* SVG Logo - Contrasté et net pour le fond clair */}
            <svg 
              className="w-14 h-14 text-slate-900 z-10" 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" className="text-amber-500" strokeWidth="2" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" className="text-slate-400" strokeWidth="1"/>
            </svg>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 animate-eagle-reveal" style={{ animationDelay: '0.1s' }}>
            EAGLE<span className="text-amber-500">.tn</span>
          </h1>

          <div className="mt-8 flex items-center gap-3 animate-slogan-rise">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">Rapidité</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">Discrétion</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500">Fiabilité</span>
          </div>

          {/* INDICATEUR D'ÉTAT ASYNCHRONE DYNAMIQUE */}
          <div className="mt-16 h-8 flex items-center justify-center animate-loader-fade">
             <div className="flex items-center gap-2 px-4 py-2 bg-white/60 border border-slate-200/60 rounded-full shadow-sm">
                <div className="w-3 h-3 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-600">
                  {loadingStep}
                </span>
             </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* FOOTER LÉGAL STRICT (Normes INMDP/INPDP)   */}
        {/* ========================================== */}
        <div className="w-full pb-8 pt-6 px-6 flex flex-col items-center gap-2 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA] to-transparent animate-loader-fade">
          <div className="flex items-center gap-1 mb-1">
            <ShieldCheck size={12} className="text-emerald-600" />
            <span className="text-[9px] font-bold tracking-widest text-emerald-700 uppercase">
              Connexion B2B Sécurisée
            </span>
          </div>
          <a href="/legal" className="text-[9px] font-semibold tracking-wider text-slate-500 hover:text-slate-800 transition-colors uppercase cursor-pointer text-center max-w-sm">
            Mentions Légales & Conditions d'utilisation (Conforme aux normes INMDP)
          </a>
          <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-1">
            © 2027 Eagle Groupe.tn. Tous droits réservés.
          </p>
        </div>

      </div>
    </>
  );
};

export default SplashScreen;
