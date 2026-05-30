import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // التحقق المحلي الصارم والسريع للمطور
    if (email === 'test@eagle.tn' && password === 'EagleTunisia2026') {
      localStorage.setItem('developer_bypass', 'true');
      // توجيه المتصفح حتماً وقسراً إلى الواجهة الرئيسية البيضاء وتحديث الحالة كلياً
      window.location.href = '/';
      return;
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 font-sans text-white" dir="rtl">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-[32px] border border-slate-800 shadow-2xl text-center">
        
        <span className="text-5xl">🦅</span>
        <h2 className="text-2xl font-black text-amber-500 mt-4">مرحباً بك في Eagle TN</h2>
        <p className="text-xs text-slate-400 font-bold mt-2">منطقة التطوير السريع والعبور الحتمي</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 mr-1">البريد الإلكتروني</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@eagle.tn"
              required
              dir="ltr"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all text-left"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 mr-1">كلمة المرور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              dir="ltr"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all text-left"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-black py-3.5 px-4 rounded-2xl border-0 shadow-lg transition-all active:scale-[0.98] mt-2"
          >
            {loading ? "جاري العبور..." : "تسجيل الدخول الفوري"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800/60 text-[10px] text-slate-500 font-semibold">
          سيتم نقلك فوراً إلى الصفحة الرئيسية دون تدخل السيرفر.
        </div>
      </div>
    </div>
  );
}
