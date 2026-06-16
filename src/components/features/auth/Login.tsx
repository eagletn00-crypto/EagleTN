import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // 1. 🛠️ العبور السريع والمضمون (Keep this!)
    if (email === 'test@eagle.tn' && password === 'Eagle2026') {
      localStorage.setItem('developer_bypass', 'true');
      localStorage.setItem('user_role', 'admin'); 
      window.location.href = '/admin-dashboard'; 
      return;
    }

    // 2. 🔐 تسجيل الدخول الحقيقي عبر Supabase
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        // جلب الدور الحقيقي من جدول profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        localStorage.setItem('user_role', profile?.role || 'client');
        
        // التوجيه الذكي بناءً على الصلاحيات
        if (profile?.role === 'admin') {
          window.location.href = '/admin-dashboard';
        } else {
          window.location.href = '/';
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur de connexion');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 w-full max-w-sm">
        <h2 className="text-xl font-black text-slate-800 mb-6">Connexion Pro</h2>
        
        {errorMessage && <p className="text-red-500 text-[10px] font-black mb-4">{errorMessage}</p>}
        
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email" 
          className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold mb-4 focus:border-yellow-500 outline-none"
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe" 
          className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold mb-6 focus:border-yellow-500 outline-none"
        />
        
        <button 
          disabled={loading}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
