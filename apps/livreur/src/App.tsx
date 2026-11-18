import React, { useState, useEffect } from 'react';
import LivreurDashboard from './screens/LivreurDashboard';
import { supabase } from './lib/supabase';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Bike, RefreshCw, LogIn } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1917] flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 text-[#C1121F] animate-spin mb-4" />
        <p className="text-white text-sm font-black tracking-widest uppercase">EAGLE FLEET INIT...</p>
      </div>
    );
  }

  // شاشة دخول مؤقتة للمندوب إذا لم يكن مسجلاً
  if (!session) {
    return (
      <div className="min-h-screen bg-[#1C1917] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-[#C1121F] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(193,18,31,0.4)] mb-6">
          <Bike className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">EAGLE Livreur</h1>
        <p className="text-gray-400 font-bold mb-8">Portail des coursiers souverains</p>
        <button 
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
          className="w-full max-w-sm h-14 bg-white text-[#1C1917] rounded-xl font-black text-lg flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform"
        >
          <LogIn className="w-6 h-6" />
          Connexion Pilote (تسجيل الدخول)
        </button>
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
