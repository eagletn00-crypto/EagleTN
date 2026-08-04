import React, { useState } from 'react';

export interface ProfilScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export const ProfilScreen: React.FC<ProfilScreenProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<'info' | 'otp'>('info');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    phone: '',
  });
  const [otpCode, setOtpCode] = useState('');

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone && formData.nom) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length >= 4) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col justify-between dir-rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-400"
        >
          ←
        </button>
        <h2 className="text-sm font-black text-amber-400">
          {step === 'info' ? 'إنشاء حساب / تسجيل الدخول' : 'تأكيد رقم الهاتف'}
        </h2>
        <div className="w-10" />
      </div>

      {step === 'info' ? (
        <form onSubmit={handleSubmitInfo} className="space-y-4 my-auto max-w-sm mx-auto w-full">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-bold">Prénom / الاسم</label>
            <input
              type="text"
              required
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              placeholder="محمد"
              className="w-full py-3 px-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-bold">Nom / اللقب</label>
            <input
              type="text"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="الطرابلسي"
              className="w-full py-3 px-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-bold">Adresse E-mail / البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.tn"
              className="w-full py-3 px-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-bold">Téléphone / رقم الهاتف (تونس)</label>
            <div className="flex gap-2">
              <span className="py-3 px-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-amber-400 font-mono font-bold flex items-center">
                +216
              </span>
              <input
                type="tel"
                required
                maxLength={8}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="20 123 456"
                className="w-full py-3 px-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl shadow-xl transition active:scale-98 text-xs"
          >
            إرسال رمز التأكيد SMS 📲
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6 my-auto max-w-sm mx-auto w-full text-center">
          <div className="space-y-2">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-2xl">
              💬
            </div>
            <h3 className="text-base font-black text-white">رمز التأكيد</h3>
            <p className="text-xs text-slate-400">
              أدخل الرمز المكون من 4 أرقام المرسل إلى <br />
              <span className="text-amber-400 font-mono font-bold">+216 {formData.phone}</span>
            </p>
          </div>

          <input
            type="text"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="• • • •"
            className="w-full py-4 bg-slate-900 border border-amber-500/40 rounded-2xl text-center text-xl font-mono tracking-widest text-amber-400 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-xl transition active:scale-98 text-xs"
          >
            تأكيد وتفعيل الحساب ✅
          </button>
        </form>
      )}

      <div className="text-center text-[10px] text-slate-600">
        Eagle TN Guarantee • Protections des données INPDP
      </div>
    </div>
  );
};

export default ProfilScreen;
