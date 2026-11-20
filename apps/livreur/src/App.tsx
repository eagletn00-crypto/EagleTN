import React, { useState, useEffect } from 'react';
import LivreurDashboard from './screens/LivreurDashboard';
import { supabase } from './lib/supabase';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Bike, RefreshCw, LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        const msg = error.message.toLowerCase().includes('invalid')
          ? 'Email ou mot de passe incorrect. (البريد أو كلمة المرور غير صحيحة)'
          : error.message;
        setErrorMsg(msg);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erreur de connexion réseau.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1917] flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 text-[#C1121F] animate-spin mb-4" />
        <p className="text-white text-sm font-black tracking-widest uppercase">EAGLE FLEET INIT...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#1C1917] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-[#C1121F] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(193,18,31,0.4)] mb-5">
              <Bike className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-1 tracking-tight">EAGLE Livreur</h1>
            <p className="text-gray-400 text-sm font-medium">Portail des coursiers souverains</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="Email du coursier"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-13 pl-12 pr-4 rounded-xl bg-white/10 border border-white/15 text-white placeholder-gray-400 text-sm font-medium outline-none focus:border-[#C1121F] focus:bg-white/15 transition"
              />
            </div>

            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-13 pl-12 pr-12 rounded-xl bg-white/10 border border-white/15 text-white placeholder-gray-400 text-sm font-medium outline-none focus:border-[#C1121F] focus:bg-white/15 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                aria-label="Afficher le mot de passe"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 rounded-xl bg-red-500/15 border border-red-500/30 p-3 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-14 bg-white text-[#1C1917] rounded-xl font-black text-base flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-60 transition-transform"
            >
              {submitting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              <span>{submitting ? 'Connexion...' : 'Connexion Pilote (تسجيل الدخول)'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#FAF8F5] text-gray-900 antialiased font-sans" dir="ltr">
        <LivreurDashboard driverId={session.user.id} />
      </div>
    </ErrorBoundary>
  );
}
