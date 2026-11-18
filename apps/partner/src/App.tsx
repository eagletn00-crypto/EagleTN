import React, { useState, useEffect } from 'react';
import PartnerDashboard from './screens/PartnerDashboard';
import { PartnerLogin } from './components/auth/PartnerLogin';
import { supabase } from './lib/supabase';
import { RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
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
        <p className="text-white text-sm font-black tracking-widest uppercase">Initialisation EAGLE TN...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans">
      {!session ? <PartnerLogin onSuccess={() => {}} /> : <PartnerDashboard />}
    </div>
  );
};

export default App;
