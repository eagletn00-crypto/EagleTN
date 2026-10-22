import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

interface PartnerLoginProps {
  onSuccess: () => void;
}

export const PartnerLogin: React.FC<PartnerLoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!supabase) throw new Error('Connexion au serveur impossible.');

      // 1. تسجيل الدخول عبر Supabase Auth
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authErr) throw authErr;

      // 2. التحقق والتقيد بجدول partners
      const { data: partnerData, error: partnerErr } = await supabase
        .from('partners')
        .select('id, name, status')
        .eq('id', authData.user.id)
        .single();

      if (partnerErr || !partnerData) {
        await supabase.auth.signOut();
        throw new Error('Compte non autorisé. ID partenaire introuvable dans la base.');
      }

      if (partnerData.status !== 'active') {
        await supabase.auth.signOut();
        throw new Error('Ce compte partenaire est actuellement inactif.');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-slate-200/80 shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">EAGLE TN • Partner</h1>
          <p className="text-xs text-slate-500 font-semibold">
            Accès sécurisé réservé aux établissements partenaires
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Identifiant / E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partenaire@eagletn.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black py-3.5 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="text-sm font-bold">Vérification en cours...</span>
            ) : (
              <>
                <span className="text-sm">Se connecter au Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
