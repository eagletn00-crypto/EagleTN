import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  full_name?: string;
  phone_number?: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  created_at?: string;
}

interface ProfileScreenProps {
  onBack?: () => void;
  onNavigateAddresses?: () => void;
  onNavigateOrders?: () => void;
  onNavigateFavorites?: () => void;
  onNavigateSupport?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onNavigateAddresses,
  onNavigateOrders,
  onNavigateFavorites,
  onNavigateSupport,
}) => {
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string; name?: string; avatar_url?: string; picture?: string }; phone?: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals States
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Phone Input State
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [phoneSaving, setPhoneSaving] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Auth States
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data as UserProfile | null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement du profil';
      console.error('Error fetching profile:', message);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user && mounted) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur d’initialisation de la session';
        console.error('Error initializing session:', message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const handleOAuthLogin = async (provider: 'facebook' | 'google') => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const redirectUrl = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            display: 'touch',
            auth_type: 'rerequest',
          },
        },
      });
      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : `Échec de la connexion via ${provider}`;
      console.error(`${provider} Login Error:`, err);
      setAuthError(message);
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('eagle_pending_checkout');
      setUser(null);
      setProfile(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de déconnexion';
      console.error('Error signing out:', message);
    }
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 8);
    setPhoneInput(rawVal);
    if (phoneError) setPhoneError(null);
  };

  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    if (!user) return;

    if (!/^[24579]\d{7}$/.test(phoneInput)) {
      setPhoneError('Veuillez saisir un numéro tunisien valide à 8 chiffres (ex: 98123456).');
      return;
    }

    setPhoneSaving(true);
    const fullPhone = `+216${phoneInput}`;
    const resolvedName = profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || 'Client Eagle TN';

    try {
      // 1. التحديث المباشر بحقلي phone_number و phone لتغطية السكيمة
      const { data: updatedData, error: updateErr } = await supabase
        .from('profiles')
        .update({ 
          phone_number: fullPhone,
          phone: fullPhone,
          full_name: resolvedName 
        })
        .eq('id', user.id)
        .select();

      if (updateErr) throw updateErr;

      // 2. إذا لم يرجع الصف (غير موجود مسبقاً)
      if (!updatedData || updatedData.length === 0) {
        const { error: insertErr } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            phone_number: fullPhone,
            phone: fullPhone,
            full_name: resolvedName,
          });

        if (insertErr) throw insertErr;
      }

      await fetchProfile(user.id);
      setPhoneInput('');
    } catch (err: any) {
      console.error('Error updating phone full details:', err);
      const message = err?.message || err?.details || 'Impossible d’enregistrer le numéro.';
      setPhoneError(message);
    } finally {
      setPhoneSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.rpc('delete_user_account');
      if (error) throw error;

      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setShowDeleteModal(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur système.';
      console.error('Error deleting account:', error);
      setAuthError('Erreur lors de la suppression: ' + message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          <div className="absolute w-8 h-8 border-4 border-emerald-50 border-b-emerald-400 rounded-full animate-spin" />
        </div>
        <p className="mt-6 text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] animate-pulse">
          EAGLE SYSTEM • Chargement
        </p>
      </div>
    );
  }

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const clientName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'Client Eagle TN';
  const clientPhone = profile?.phone_number || profile?.phone || user?.phone || null;
  const clientEmail = profile?.email || user?.email || 'Compte vérifié';

  const isPhoneMissing = Boolean(user && !clientPhone);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] antialiased">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-32 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px]" />
      </div>

      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-5 py-4 flex items-center justify-between shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Retour"
              className="w-10 h-10 rounded-2xl bg-slate-100/80 border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 transition-all active:scale-95 text-sm font-bold"
            >
              ←
            </button>
          )}
          <div>
            <h1 className="font-extrabold text-base text-slate-900 tracking-tight">Espace Client</h1>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              EAGLE TN VIP
            </p>
          </div>
        </div>

        <div>
          {user ? (
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-2xs">
              COMPTE ACTIF
            </span>
          ) : (
            <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-3.5 py-1.5 rounded-full border border-amber-200/80">
              INVITÉ
            </span>
          )}
        </div>
      </header>

      <main className="relative z-10 p-5 space-y-6 max-w-lg mx-auto">
        {!user ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-[32px] p-7 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-emerald-600/20 mx-auto font-black">
                🦅
              </div>
              <h2 className="font-black text-xl text-slate-900 tracking-tight">Connexion Privilégiée</h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Connectez-vous pour accéder à vos adresses, vos commandes en temps réel et votre profil.
              </p>
            </div>

            {authError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-xs font-bold flex items-center gap-2">
                <span>⚠️</span>
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                type="button"
                disabled={authLoading}
                onClick={() => handleOAuthLogin('facebook')}
                className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white h-13 rounded-2xl font-black text-xs flex items-center justify-center gap-3 shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                {authLoading ? 'Connexion...' : 'Continuer avec Facebook'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="bg-white/90 backdrop-blur-xl rounded-[32px] p-6 border border-slate-200/80 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] space-y-6">
              <div className="flex items-center gap-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={clientName}
                    className="w-18 h-18 rounded-2xl object-cover shadow-md ring-2 ring-slate-100 shrink-0"
                  />
                ) : (
                  <div className="w-18 h-18 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                    {clientName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-black text-base text-slate-900 truncate tracking-tight">{clientName}</h2>
                  <p className="text-xs text-emerald-600 font-extrabold mt-0.5 flex items-center gap-1">
                    {clientPhone ? (
                      <><span>🇹🇳</span> {clientPhone}</>
                    ) : (
                      <span className="text-amber-600">⚠️ Téléphone Requis</span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{clientEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {onNavigateOrders && (
                  <button
                    onClick={onNavigateOrders}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:bg-white hover:border-emerald-500/40 hover:shadow-md transition-all text-left group active:scale-[0.98]"
                  >
                    <span className="text-xl block mb-1">📦</span>
                    <span className="text-xs font-black text-slate-800 group-hover:text-emerald-600 transition-colors">Mes Commandes</span>
                  </button>
                )}
                {onNavigateAddresses && (
                  <button
                    onClick={onNavigateAddresses}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:bg-white hover:border-emerald-500/40 hover:shadow-md transition-all text-left group active:scale-[0.98]"
                  >
                    <span className="text-xl block mb-1">📍</span>
                    <span className="text-xs font-black text-slate-800 group-hover:text-emerald-600 transition-colors">Mes Adresses</span>
                  </button>
                )}
                {onNavigateFavorites && (
                  <button
                    onClick={onNavigateFavorites}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:bg-white hover:border-emerald-500/40 hover:shadow-md transition-all text-left group active:scale-[0.98]"
                  >
                    <span className="text-xl block mb-1">❤️</span>
                    <span className="text-xs font-black text-slate-800 group-hover:text-emerald-600 transition-colors">Mes Favoris</span>
                  </button>
                )}
                {onNavigateSupport && (
                  <button
                    onClick={onNavigateSupport}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:bg-white hover:border-emerald-500/40 hover:shadow-md transition-all text-left group active:scale-[0.98]"
                  >
                    <span className="text-xl block mb-1">🎧</span>
                    <span className="text-xs font-black text-slate-800 group-hover:text-emerald-600 transition-colors">Support Client</span>
                  </button>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={handleSignOut}
                  className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 h-12 rounded-2xl text-xs font-black transition-all border border-slate-200/80 active:scale-[0.98]"
                >
                  Se déconnecter
                </button>
                
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="text-[11px] text-rose-500 hover:text-rose-600 font-bold py-1.5 transition-colors text-center"
                >
                  Supprimer définitivement mon compte
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="pt-6 pb-2 text-center space-y-1">
          <p className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
            Tous droits réservés © EAGLE TN DIGITAL SYSTEM
          </p>
          <p className="text-[9px] font-semibold text-slate-300">
            Avril 2026 • Platform Premium Version 2.4.0
          </p>
        </footer>
      </main>

      {/* Mandatory Phone Modal Gate */}
      {isPhoneMissing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-5">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full space-y-5 border border-slate-200/80 shadow-2xl">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mx-auto border border-emerald-100 font-black">
              📱
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-black text-base text-slate-900">Numéro de Téléphone Requis</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Nécessaire pour la confirmation et la livraison immédiate de vos commandes.
              </p>
            </div>

            {phoneError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold text-center">
                ⚠️ {phoneError}
              </div>
            )}

            <form onSubmit={handleSavePhone} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Numéro Tunisien (+216) *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-black text-xs text-slate-400">+216</span>
                  <input
                    type="tel"
                    required
                    maxLength={8}
                    value={phoneInput}
                    onChange={handlePhoneInputChange}
                    placeholder="98 123 456"
                    className="w-full h-13 pl-16 pr-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={phoneSaving || phoneInput.length !== 8}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-13 rounded-2xl font-black text-xs shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all disabled:opacity-40"
              >
                {phoneSaving ? 'Enregistrement...' : 'Valider et Continuer 🚀'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Account Deletion Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-5">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full space-y-5 border border-slate-200/80 shadow-2xl text-center">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-2xl mx-auto border border-rose-100 font-black">
              ⚠️
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-base text-slate-900">Supprimer le Compte?</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Cette action est irréversible. Vos données et votre historique seront définitivement supprimés.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white h-12 rounded-2xl font-black text-xs shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Suppression...' : 'Oui, Supprimer'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 h-12 rounded-2xl font-black text-xs transition-all border border-slate-200/80"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
