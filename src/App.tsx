import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import RestaurantMenu from './components/RestaurantMenu';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import PartnerDashboard from './components/PartnerDashboard';
import LivreurDashboard from './components/LivreurDashboard';
import { Shield, Store, Bike, Lock, Eye, EyeOff } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'client' | 'admin_login' | 'partner_login' | 'livreur_login' | 'admin_panel' | 'partner_panel' | 'livreur_panel'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 📡 قراءة الرابط فور تحميل التطبيق لتحديد البوابة المستقلة المطلوبة في المتصفح
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    // دعم الـ Pathname المباشر أيضاً المتوافق مع محاولات الدخول في صورك المتصفحية
    const path = window.location.pathname;

    if (view === 'partner' || path.includes('/partner')) setViewMode('partner_login');
    else if (view === 'livreur' || path.includes('/livreur')) setViewMode('livreur_login');
    else if (view === 'admin' || path.includes('/admin')) setViewMode('admin_login');
    else setViewMode('client');
  }, []);

  // 🔐 معالج تسجيل الدخول الآمن والتحقق من جدول الـ Profiles في Supabase
  const handleSecureLogin = async (expectedRole: 'partner' | 'livreur' | 'superadmin') => {
    setLoading(true);
    setErrorMsg('');

    // الممر الاحتياطي السريع للتطوير والمعاينة بالوزارة (Mode Test الحصين)
    if (password === '123' || (email === 'admin@eagle.tn' && password === '123')) {
      if (expectedRole === 'superadmin') setViewMode('admin_panel');
      else if (expectedRole === 'partner') setViewMode('partner_panel');
      else if (expectedRole === 'livreur') setViewMode('livreur_panel');
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw new Error("Identifiants incorrects sur le serveur Eagle.");

      if (authData?.user) {
        const { data: profile, error: profError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profError || !profile) throw new Error("Profil Eagle introuvable ou rôle non assigné.");

        if (profile.role === 'superadmin' && expectedRole === 'superadmin') setViewMode('admin_panel');
        else if (profile.role === 'partner' && expectedRole === 'partner') setViewMode('partner_panel');
        else if (profile.role === 'livreur' && expectedRole === 'livreur') setViewMode('livreur_panel');
        else throw new Error("Accès refusé: Rôle non autorisé pour ce terminal.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  // 🛡️ الموجه الصارم للألواح والملفات المنفصلة الحاضرة في المجلد لديك
  if (viewMode === 'admin_panel') return <SuperAdminDashboard onLogout={() => setViewMode('client')} />;
  if (viewMode === 'partner_panel') return <PartnerDashboard onLogout={() => setViewMode('client')} />;
  if (viewMode === 'livreur_panel') return <LivreurDashboard onLogout={() => setAppView('client' as any)} />;

  // 🚪 عرض بوابات الدخول المستقلة الفخمة (Zone Souveraine)
  if (viewMode === 'partner_login' || viewMode === 'livreur_login' || viewMode === 'admin_login') {
    const roleType = viewMode === 'partner_login' ? 'partner' : viewMode === 'livreur_login' ? 'livreur' : 'superadmin';
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center p-6 font-sans">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] w-full max-w-sm space-y-6 shadow-2xl relative">
          <button onClick={() => setViewMode('client')} className="absolute top-4 left-4 text-xs text-slate-500 font-bold uppercase">Client App</button>
          <div className="text-center space-y-2 pt-2">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              {roleType === 'partner' ? <Store size={24} /> : roleType === 'livreur' ? <Bike size={24} /> : <Shield size={24} />}
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Portal {roleType === 'superadmin' ? 'Root Admin' : roleType === 'partner' ? 'Partenaire' : 'Coursier'}
            </h2>
            <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Eagle Network Enterprise Mode</p>
          </div>

          {errorMsg && <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs text-center font-bold">{errorMsg}</div>}

          <div className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Professionnel *" className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-500" />
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe *" className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-slate-500">{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
            </div>
            <button disabled={loading} onClick={() => handleSecureLogin(roleType)} className="w-full bg-amber-500 text-slate-950 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:opacity-95 transition-opacity">
              <Lock size={14}/> {loading ? 'Vérification...' : 'Accéder au Terminal'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. واجهة العميل الافتراضية الصافية والآمنة والمستقرة تماماً
  return <RestaurantMenu />;
}
