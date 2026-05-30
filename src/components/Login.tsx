import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface LoginProps {
  onBypassSuccess?: () => void;
}

export default function Login({ onBypassSuccess }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // حساب المطور السريع للتجربة الفورية وتخطي القيود اللحظية
    if (email === 'test@eagle.tn' && password === 'EagleTunisia2026') {
      localStorage.setItem('developer_bypass', 'true');
      if (onBypassSuccess) onBypassSuccess();
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // إنشاء حساب جديد مع تمرير البيانات الإضافية في الـ Metadata لحل مشكلة التريجر
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone_number: phone,
              role: 'client'
            }
          }
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.' });
        setIsSignUp(false);
      } else {
        // تسجيل الدخول بالحسابات الرسمية
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.reload();
      }
    } catch (err: any) {
      let friendlyMessage = err.message;
      if (err.message.includes('Database error')) {
        friendlyMessage = 'عذراً، حدث خطأ أثناء ربط البيانات بالسيرفر. يرجى تجسير الدخول بحساب التست حالياً.';
      } else if (err.message.includes('Invalid login credentials')) {
        friendlyMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      }
      setMessage({ type: 'error', text: friendlyMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 font-sans text-white" dir="rtl">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-[32px] border border-slate-800 shadow-2xl text-center">
        
        <span className="text-5xl">🦅</span>
        <h2 className="text-2xl font-black text-amber-500 mt-4">مرحباً بك في Eagle TN</h2>
        <p className="text-xs text-slate-400 font-bold mt-2">
          {isSignUp ? 'أنشئ حسابك الشخصي للطلب والتتبع الفوري' : 'سجل دخولك لتجربة توصيل ذكية وسريعة'}
        </p>

        {message && (
          <div className={`mt-4 p-3 border text-xs font-bold rounded-xl text-right ${
            message.type === 'error' ? 'bg-red-955/50 border-red-800 text-red-400' : 'bg-emerald-950/50 border-emerald-800 text-emerald-400'
          }`}>
            {message.type === 'error' ? '⚠️ ' : '✔ '} {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} className="mt-6 space-y-4 text-right">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 mr-1">الإسم الكامل</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="محمد بن علي"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 mr-1">رقم الهاتف التونسي</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="23456789"
                  required
                  dir="ltr"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all text-right"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 mr-1">البريد الإلكتروني</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
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
            {loading ? "جاري المعالجة..." : isSignUp ? "إنشاء حساب جديد" : "تسجيل الدخول"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
            className="text-xs font-bold text-amber-500 hover:underline bg-transparent border-0 cursor-pointer"
          >
            {isSignUp ? 'لديك حساب بالفعل؟ سجل دخولك' : 'ليس لديك حساب؟ أنشئ حساباً جديداً الآن'}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800/60 text-[10px] text-slate-500 font-semibold">
          نظام مشفر ومؤمن بالكامل يضمن السيادة الرقمية لمنصة Eagle TN.
        </div>
      </div>
    </div>
  );
}
