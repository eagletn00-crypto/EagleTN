import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(`خطأ: ${error.message}`);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) alert(`خطأ أثناء الاتصال بجوجل: ${error.message}`);
    setLoading(false);
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) alert(`خطأ أثناء الاتصال بفيسبوك: ${error.message}`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 font-sans text-white" dir="rtl">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-amber-500">مرحباً بك في Eagle TN 🦅</h1>
          <p className="text-gray-400 text-xs mt-1">سجل دخولك بضغطة زر واحدة لتجربة توصيل ذكية وسريعة</p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-100 text-slate-900 font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.435 2.184 15.618 1 12.24 1s-9.24 4.14-9.24 9.24 4.14 9.24 9.24 9.24c4.81 0 8.014-3.355 8.014-8.125 0-.55-.06-1.073-.174-1.57H12.24z"/>
            </svg>
            التسجيل السريع بواسطة Google
          </button>

          <button
            onClick={handleFacebookLogin}
            disabled={loading}
            className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#1877F2]/10"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            التسجيل السريع بواسطة Facebook
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-xs font-bold">أو عن طريق الحساب المشترك</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-all text-left"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-all text-left"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 px-4 rounded-xl text-sm transition-all active:scale-95 mt-2"
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
