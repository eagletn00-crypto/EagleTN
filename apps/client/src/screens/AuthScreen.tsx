import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { LegalModal } from '../components/LegalModal';

type AuthMode = 'OAUTH' | 'EMAIL_LOGIN' | 'EMAIL_SIGNUP';

export const AuthScreen: React.FC = () => {
  const navigate = useNavigate();
  
  const [authMode, setAuthMode] = useState<AuthMode>('OAUTH');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showLegalModal, setShowLegalModal] = useState(false);

  useEffect(() => {
    setErrorMsg(null);
  }, [authMode]);

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await Haptics.impact({ style: ImpactStyle.Heavy });
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/checkout',
        },
      });
      
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      await Haptics.notification({ type: NotificationType.Error });
      setErrorMsg(err.message || 'Une erreur est survenue lors de la connexion.');
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Veuillez remplir tous les champs.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      await Haptics.impact({ style: ImpactStyle.Heavy });

      if (authMode === 'EMAIL_SIGNUP') {
        if (!fullName) {
          setErrorMsg("Veuillez saisir votre nom complet.");
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (error) throw error;
        await Haptics.notification({ type: NotificationType.Success });
        navigate('/checkout', { replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        await Haptics.notification({ type: NotificationType.Success });
        navigate('/checkout', { replace: true });
      }
    } catch (err: any) {
      console.error(err);
      await Haptics.notification({ type: NotificationType.Error });
      setErrorMsg(err.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#FAF8F5] font-sans flex flex-col items-center justify-between p-6">
      <div className="w-full flex flex-col items-center justify-center flex-1">
        
        {/* Luxury Brand Header */}
        <div className="flex flex-col items-center mb-10">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 drop-shadow-sm">
            <path d="M12 2C7 2 3 6 2 11C4 9 7 9 9 10C8 11 7 13 7 15C9 14 11 14 13 15C12 17.5 10 21 8.5 23C13.5 21.5 19 16 21.5 9.5C22.5 6.5 22.5 3.5 22.5 3.5L16.5 5.5L12 2Z" fill="#C59648"/>
            <circle cx="10.5" cy="9.5" r="1.5" fill="#141413"/>
          </svg>
          <h1 className="tracking-[0.2em] font-black text-3xl text-[#141413] uppercase leading-none">
            EAGLE TN
          </h1>
          <p className="text-[12px] font-medium text-[#78716C] mt-2 uppercase tracking-widest">
            Q-Commerce de Luxe
          </p>
        </div>

        {/* Inline Error Banner */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10, height: 0 }} 
              animate={{ opacity: 1, y: 0, height: 'auto' }} 
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="w-full max-w-sm bg-[#FFF1F2] border border-[#E70013]/20 text-[#E70013] px-4 py-3 rounded-xl mb-4 flex items-start gap-3 shadow-sm overflow-hidden"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-[13px] font-bold leading-snug flex-1">{errorMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Auth Card */}
        <div className="w-full max-w-sm bg-[#FFFFFF] rounded-3xl shadow-[0_8px_30px_rgba(20,20,19,0.06)] border border-[#1C1917]/10 p-6 flex flex-col gap-4 overflow-hidden relative">
          <AnimatePresence mode="wait">
            
            {authMode === 'OAUTH' && (
              <motion.div 
                key="oauth"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="flex flex-col w-full"
              >
                <div className="mb-6">
                  <h2 className="text-[20px] font-black text-[#141413] tracking-tight">Bienvenue</h2>
                  <p className="text-[13px] font-medium text-[#78716C] mt-1">Connectez-vous pour continuer vos achats.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOAuth('google')}
                    disabled={loading}
                    className="w-full h-14 bg-[#FFFFFF] text-[#141413] rounded-xl font-bold text-[14px] flex items-center justify-center gap-3 border border-[#1C1917]/20 shadow-sm outline-none disabled:opacity-70 transition-all"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continuer avec Google
                  </motion.button>
                  
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOAuth('facebook')}
                    disabled={loading}
                    className="w-full h-14 bg-[#1877F2] text-[#FFFFFF] rounded-xl font-bold text-[14px] flex items-center justify-center gap-3 shadow-md outline-none disabled:opacity-70 transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="#FFFFFF" width="20" height="20">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continuer avec Facebook
                  </motion.button>
                </div>

                <div className="flex items-center gap-3 my-5 opacity-60">
                  <div className="flex-1 h-px bg-[#1C1917]/20" />
                  <span className="text-[11px] font-black tracking-widest text-[#141413]">OU</span>
                  <div className="flex-1 h-px bg-[#1C1917]/20" />
                </div>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAuthMode('EMAIL_LOGIN')}
                  className="w-full h-14 bg-[#FAF8F5] text-[#141413] rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 border border-[#1C1917]/10 outline-none transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Connexion par E-mail
                </motion.button>
              </motion.div>
            )}

            {(authMode === 'EMAIL_LOGIN' || authMode === 'EMAIL_SIGNUP') && (
              <motion.form 
                key="email"
                onSubmit={handleEmailAuth}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col w-full"
              >
                <div className="flex items-center mb-6 gap-3">
                  <button type="button" onClick={() => setAuthMode('OAUTH')} className="w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center border border-[#1C1917]/10 outline-none">
                    <ArrowLeft className="w-4 h-4 text-[#141413]" />
                  </button>
                  <div>
                    <h2 className="text-[18px] font-black text-[#141413] tracking-tight">
                      {authMode === 'EMAIL_LOGIN' ? 'Connexion' : 'Créer un compte'}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {authMode === 'EMAIL_SIGNUP' && (
                    <input 
                      type="text" 
                      placeholder="Nom complet" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-12 px-4 bg-[#FAF8F5] rounded-xl text-[14px] font-bold text-[#141413] outline-none border border-[#1C1917]/10 focus:border-[#C59648] transition-colors placeholder:text-[#A8A29E]" 
                    />
                  )}
                  <input 
                    type="email" 
                    placeholder="Adresse e-mail" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 bg-[#FAF8F5] rounded-xl text-[14px] font-bold text-[#141413] outline-none border border-[#1C1917]/10 focus:border-[#C59648] transition-colors placeholder:text-[#A8A29E]" 
                  />
                  <input 
                    type="password" 
                    placeholder="Mot de passe" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 bg-[#FAF8F5] rounded-xl text-[14px] font-bold text-[#141413] outline-none border border-[#1C1917]/10 focus:border-[#C59648] transition-colors placeholder:text-[#A8A29E]" 
                  />
                </div>

                <motion.button 
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full h-14 bg-[#141413] text-[#FFFFFF] rounded-xl font-bold text-[15px] mt-4 flex items-center justify-center gap-2 shadow-md outline-none disabled:opacity-70 transition-all"
                >
                  {loading ? 'Traitement...' : (authMode === 'EMAIL_LOGIN' ? 'Se connecter' : 'S\'inscrire')} 
                  {!loading && <ChevronRight className="w-5 h-5" />}
                </motion.button>

                <div className="mt-5 text-center">
                  <button 
                    type="button" 
                    onClick={() => setAuthMode(authMode === 'EMAIL_LOGIN' ? 'EMAIL_SIGNUP' : 'EMAIL_LOGIN')}
                    className="text-[13px] font-bold text-[#78716C] hover:text-[#141413] underline outline-none"
                  >
                    {authMode === 'EMAIL_LOGIN' ? "Je n'ai pas de compte ? S'inscrire" : "J'ai déjà un compte ? Se connecter"}
                  </button>
                </div>
              </motion.form>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Strict Legal Compliance Footer */}
      <div className="w-full max-w-sm mt-8 flex flex-col items-center text-center px-4">
        <p className="text-[11px] font-medium text-[#78716C] leading-relaxed">
          En continuant, vous acceptez nos{' '}
          <span onClick={() => setShowLegalModal(true)} className="font-bold text-[#141413] underline cursor-pointer">Conditions Générales d'Utilisation</span> 
          {' '}et notre{' '}
          <span onClick={() => setShowLegalModal(true)} className="font-bold text-[#141413] underline cursor-pointer">Politique de Confidentialité</span>.
        </p>
      </div>

      <LegalModal isOpen={showLegalModal} onClose={() => setShowLegalModal(false)} />
    </div>
  );
};

export default AuthScreen;
