import React, { memo, useState, useEffect } from 'react';
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { ArrowLeft, Loader2, LogOut, Package, ShieldCheck, MapPin, Phone, User, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { supabase } from '../lib/supabase';

export interface ProfileScreenProps {
  onBack?: () => void;
  onNavigateOrders?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = memo(({ onBack, onNavigateOrders }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState<any>(null); // Type strictly in a real environment
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const syncCustomerProfile = async (authUser: any) => {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authUser.id)
        .single();

      if (!existingProfile) {
        await supabase.from('profiles').insert([
          {
            id: authUser.id,
            full_name: authUser.user_metadata?.full_name || 'Client EAGLE',
            email: authUser.email,
            avatar_url: authUser.user_metadata?.avatar_url,
            updated_at: new Date().toISOString(),
          }
        ]);
      }
    } catch (error) {
      console.warn("[EAGLE TN Engine] Profile sync check:", error);
    } finally {
      setUser(authUser);
      setIsLoadingSession(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    window.scrollTo(0, 0);

    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session?.user && isMounted) syncCustomerProfile(session.user);
      else if (isMounted) setIsLoadingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user && isMounted) syncCustomerProfile(session.user);
      else if (isMounted) setUser(null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const triggerHaptic = async (style = ImpactStyle.Light) => {
    try { await Haptics.impact({ style }); } catch(e) {}
  };

  const handleFacebookLogin = async () => {
    try {
      await triggerHaptic();
      setIsLoggingIn(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: { redirectTo: window.location.origin, skipBrowserRedirect: false },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Auth Error:", err);
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await triggerHaptic(ImpactStyle.Heavy);
      setIsLoadingSession(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setIsLoadingSession(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5] font-sans text-[#1C1917] pb-[120px] selection:bg-[#C1121F]/20">
      
      {/* SOVEREIGN HEADER */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-gray-200/50 px-4 h-16 flex items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={async () => { await triggerHaptic(); onBack && onBack(); }}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center outline-none"
        >
          <ArrowLeft className="w-5 h-5 text-[#1C1917]" strokeWidth={2.5} />
        </motion.button>
        <h1 className="text-[16px] font-black text-[#1C1917] uppercase tracking-widest">
          Mon Compte <span className="text-[12px] text-[#C1121F] ml-1">(حسابي)</span>
        </h1>
        <div className="w-10" />
      </header>

      <main className="px-4 mt-6">
        <AnimatePresence mode="wait">
          {isLoadingSession ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-12 h-12 border-[3px] border-gray-200 border-t-[#C1121F] rounded-full animate-spin mb-4" />
            </motion.div>
          ) : user ? (
            /* ========================================= */
            /* VIP LOGGED IN VIEW                        */
            /* ========================================= */
            <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              
              {/* Profile Card */}
              <div className="bg-white p-6 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gray-50" />
                
                <div className="relative w-24 h-24 rounded-full bg-white p-1 shadow-md border border-gray-100 mb-4 z-10">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-[#C1121F] w-7 h-7 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                <h2 className="text-[20px] font-black text-[#1C1917] leading-tight">
                  {user.user_metadata?.full_name || 'Client VIP'}
                </h2>
                <p className="text-[13px] font-bold text-gray-400 mt-1 truncate w-full px-4">
                  {user.email}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={async () => { await triggerHaptic(); onNavigateOrders && onNavigateOrders(); }}
                  className="w-full bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex items-center justify-between outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#C1121F]">
                      <Package className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[14px] font-black text-[#1C1917] uppercase tracking-wide">Mes Commandes</span>
                      <span className="text-[11px] font-bold text-gray-400">سجل الطلبات والتتبع</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </motion.button>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button whileTap={{ scale: 0.95 }} className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 outline-none">
                    <MapPin className="w-6 h-6 text-[#1C1917]" strokeWidth={2} />
                    <span className="text-[12px] font-black uppercase text-[#1C1917]">Adresses</span>
                  </motion.button>
                  
                  <motion.button whileTap={{ scale: 0.95 }} className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 outline-none">
                    <Phone className="w-6 h-6 text-[#1C1917]" strokeWidth={2} />
                    <span className="text-[12px] font-black uppercase text-[#1C1917]">Contact</span>
                  </motion.button>
                </div>
              </div>

              {/* Logout Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="w-full mt-6 bg-gray-50 text-[#1C1917] font-black rounded-[20px] py-4 flex items-center justify-center gap-2 outline-none hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <LogOut className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-[13px] uppercase tracking-wider">Se déconnecter (تسجيل خروج)</span>
              </motion.button>
            </motion.div>
          ) : (
            /* ========================================= */
            /* LOGGED OUT VIEW                           */
            /* ========================================= */
            <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mt-10">
              
              <div className="w-24 h-24 bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 flex items-center justify-center mb-6 relative">
                <ShieldCheck className="w-10 h-10 text-[#C1121F]" strokeWidth={2} />
                <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
              </div>

              <h2 className="text-[26px] font-black text-[#1C1917] mb-3 tracking-tight leading-none text-center">
                Bienvenue sur <br/><span className="text-[#C1121F]">EAGLE TN</span>
              </h2>
              <p className="text-[13px] font-bold text-gray-500 leading-relaxed text-center px-6 mb-10">
                Connectez-vous pour suivre vos commandes en temps réel et profiter de l'excellence logistique.
                <br/><span className="font-arabic mt-1 block">سجل دخولك لتتبع طلباتك لحظة بلحظة.</span>
              </p>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleFacebookLogin}
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-black rounded-full py-4 shadow-[0_8px_24px_rgba(24,119,242,0.3)] transition-all outline-none disabled:opacity-70 disabled:grayscale-[50%]"
              >
                {isLoggingIn ? (
                  <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
                <span className="tracking-wide text-[14px] uppercase mt-0.5">
                  {isLoggingIn ? 'Connexion...' : 'Continuer avec Facebook'}
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
});

ProfileScreen.displayName = 'ProfileScreen';
export default ProfileScreen;
