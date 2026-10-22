import React, { memo, useState, useEffect } from 'react';
import { ArrowLeft, Loader2, LogOut, Package, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

export interface ProfileScreenProps {
  onBack?: () => void;
  onNavigateOrders?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = memo(({ onBack, onNavigateOrders }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState<any>(null);
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && isMounted) {
        syncCustomerProfile(session.user);
      } else if (isMounted) {
        setIsLoadingSession(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && isMounted) {
        syncCustomerProfile(session.user);
      } else if (isMounted) {
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleFacebookLogin = async () => {
    try {
      setIsLoggingIn(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: window.location.origin,
          skipBrowserRedirect: false
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error("[EAGLE TN Engine] Facebook Auth Error:", err);
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoadingSession(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error("[EAGLE TN Engine] Logout Error:", error);
    } finally {
      setIsLoadingSession(false);
    }
  };

  // ألوان النيومورفيزم المركزية لسهولة التعديل
  const bgNeumorphic = "bg-[#EAEFF5]";
  const shadowOut = "shadow-[6px_6px_14px_#D0D8E6,-6px_-6px_14px_#FFFFFF]";
  const shadowIn = "shadow-[inset_4px_4px_8px_#D0D8E6,inset_-4px_-4px_8px_#FFFFFF]";
  const shadowActive = "active:shadow-[inset_4px_4px_8px_#D0D8E6,inset_-4px_-4px_8px_#FFFFFF]";

  return (
    <div className={`min-h-[100dvh] ${bgNeumorphic} font-sans text-slate-800 pb-32 selection:bg-emerald-500/20 antialiased overflow-x-hidden`}>
      
      {/* HEADER NEUMORPHIC */}
      <header className="pt-10 pb-4 px-5 flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={onBack}
          aria-label="Retour"
          className={`w-11 h-11 flex items-center justify-center rounded-2xl ${bgNeumorphic} ${shadowOut} ${shadowActive} transition-all duration-200`}
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 stroke-[2.5]" />
        </button>
        <h1 className="text-xs font-black text-slate-800 tracking-widest uppercase flex-1 text-center pr-11">
          Espace VIP
        </h1>
      </header>

      <main className="px-5 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {isLoadingSession ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className={`w-16 h-16 rounded-full ${bgNeumorphic} ${shadowIn} flex items-center justify-center`}>
              <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            </div>
          </div>
        ) : user ? (
          /* ========================================= */
          /* LOGGED IN VIEW                            */
          /* ========================================= */
          <div className="space-y-6">
            <div className={`rounded-[2rem] p-8 flex flex-col items-center text-center ${bgNeumorphic} ${shadowOut}`}>
              
              <div className={`w-24 h-24 rounded-full p-2 mb-6 ${bgNeumorphic} ${shadowIn} relative`}>
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <span className="text-3xl font-black text-emerald-600">{user.email?.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 rounded-full p-2 ${bgNeumorphic} ${shadowOut}`}>
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                </div>
              </div>

              <h2 className="text-xl font-black text-slate-800 mb-1 tracking-tight">
                {user.user_metadata?.full_name || 'Client VIP'}
              </h2>
              <p className="text-xs font-bold text-slate-400 mb-8 truncate w-full px-4">
                {user.email}
              </p>

              <div className="w-full grid grid-cols-2 gap-4 mb-8">
                <div className={`rounded-2xl p-4 flex flex-col items-center justify-center ${bgNeumorphic} ${shadowOut} ${shadowActive} cursor-pointer transition-all`}>
                  <MapPin className="w-5 h-5 text-emerald-500 mb-2" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Adresses</span>
                </div>
                <div className={`rounded-2xl p-4 flex flex-col items-center justify-center ${bgNeumorphic} ${shadowOut} ${shadowActive} cursor-pointer transition-all`}>
                  <Phone className="w-5 h-5 text-emerald-500 mb-2" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact</span>
                </div>
              </div>

              <button
                onClick={onNavigateOrders}
                className={`w-full flex items-center justify-center gap-3 text-emerald-600 font-black rounded-2xl py-4 ${bgNeumorphic} ${shadowOut} ${shadowActive} transition-all duration-200`}
              >
                <Package className="w-5 h-5" />
                <span className="tracking-widest text-xs uppercase">Mes Commandes</span>
              </button>
            </div>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center gap-3 text-rose-500 font-bold rounded-2xl py-4 ${bgNeumorphic} ${shadowOut} ${shadowActive} transition-all duration-200`}
            >
              <LogOut className="w-5 h-5" />
              <span className="tracking-widest text-xs uppercase">Se Déconnecter</span>
            </button>
          </div>
        ) : (
          /* ========================================= */
          /* LOGGED OUT VIEW                           */
          /* ========================================= */
          <div className={`rounded-[2rem] p-8 flex flex-col items-center text-center ${bgNeumorphic} ${shadowOut}`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${bgNeumorphic} ${shadowIn}`}>
              <ShieldCheck className="w-10 h-10 text-slate-400" />
            </div>

            <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">
              EAGLE TN
            </h2>
            <p className="text-xs font-bold text-slate-400 leading-relaxed px-2 mb-10">
              Sécurisez votre compte pour suivre vos commandes en temps réel et gérer vos adresses.
            </p>

            <button
              onClick={handleFacebookLogin}
              disabled={isLoggingIn}
              className={`w-full flex items-center justify-center gap-3 text-[#1877F2] font-black rounded-2xl py-4 ${bgNeumorphic} ${shadowOut} ${shadowActive} transition-all duration-200 disabled:opacity-50`}
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )}
              <span className="tracking-wide text-sm">
                {isLoggingIn ? 'Connexion...' : 'Continuer avec Facebook'}
              </span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
});

ProfileScreen.displayName = 'ProfileScreen';
export default ProfileScreen;
