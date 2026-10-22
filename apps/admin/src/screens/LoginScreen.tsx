import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Lock, Mail, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Accès refusé : Identifiants invalides.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E9EBEF] flex flex-col items-center justify-center p-4 font-sans select-none antialiased">
      
      {/* BRANDING */}
      <div className="mb-10 flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.2),8px_8px_16px_#c8cad0,-8px_-8px_16px_#ffffff] flex items-center justify-center mb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/20 animate-pulse"></div>
          <span className="text-white font-black text-4xl tracking-tighter relative z-10">E</span>
        </div>
        <h1 className="text-3xl font-black text-stone-800 tracking-tighter uppercase leading-none text-center">
          EAGLE <span className="text-emerald-600">TN</span>
        </h1>
        <p className="text-xs font-bold text-stone-500 uppercase tracking-[0.2em] mt-2">
          Portail Sécurisé
        </p>
      </div>

      {/* LOGIN FORM */}
      <div className="w-full max-w-sm bg-[#E9EBEF] p-8 rounded-[2.5rem] shadow-[12px_12px_24px_#c8cad0,-12px_-12px_24px_#ffffff] border border-white/40">
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest px-2 flex items-center gap-1.5">
              <Mail className="w-3 h-3" /> Identifiant (Email)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#E9EBEF] shadow-[inset_6px_6px_12px_#c8cad0,inset_-6px_-6px_12px_#ffffff] rounded-2xl py-4 px-5 text-sm font-bold text-stone-700 outline-none border border-transparent focus:border-emerald-500/30 transition-all"
              placeholder="admin@eagle.tn"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest px-2 flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#E9EBEF] shadow-[inset_6px_6px_12px_#c8cad0,inset_-6px_-6px_12px_#ffffff] rounded-2xl py-4 px-5 text-sm font-bold text-stone-700 outline-none border border-transparent focus:border-emerald-500/30 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#E9EBEF] shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] border border-rose-200 text-rose-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-[#E9EBEF] shadow-[6px_6px_12px_#c8cad0,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 border border-white/50 disabled:opacity-50"
          >
            {loading ? (
              <span className="text-[12px] font-black text-emerald-600 uppercase tracking-widest animate-pulse">Vérification...</span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-[12px] font-black text-stone-800 uppercase tracking-widest">Connexion</span>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
