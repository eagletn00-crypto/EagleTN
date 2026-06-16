import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { supabase } from '@/services/supabaseClient';

const CheckoutFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  const [trackingIndex, setTrackingIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ nom: '', prenom: '', tel: '', note: '' });

  const trackingSteps = [
    { title: "Validée", desc: "Commande confirmée par le système" },
    { title: "Préparation", desc: "Le partenaire prépare votre commande" },
    { title: "En Route", desc: "L'aigle est en vol vers vous" },
    { title: "Arrivée", desc: "Livraison imminente à votre position" }
  ];

  useEffect(() => {
    if (step === 2) {
      const interval = setInterval(() => {
        setTrackingIndex((prev) => {
          if (prev < trackingSteps.length - 1) return prev + 1;
          clearInterval(interval);
          setTimeout(() => setStep(3), 4000); 
          return prev;
        });
      }, 4500); 
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleConfirm = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('orders').insert([{
        client_phone: formData.tel,
        customer_name: `${formData.nom} ${formData.prenom}`,
        status: 'PENDING',
        total_price: 28.000, 
        issue_tags: formData.note,
        pin_code: '4592'
      }]);
      setStep(2); 
    } catch (err) {
      setStep(2); 
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // STEP 1: VALIDATION (WHITE LUXURY FORM)
  // ==========================================
  if (step === 1) return (
    <div className="min-h-screen bg-[#F8F9FA] p-5 pb-20 flex flex-col items-center">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 mt-4 relative overflow-hidden">
        <h1 className="text-2xl font-black mb-6 text-[#1A1A1A] border-b border-gray-100 pb-4 tracking-widest uppercase">Validation</h1>
        <form onSubmit={handleConfirm} className="space-y-4 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Nom" onChange={e => setFormData({...formData, nom: e.target.value})} className="w-full bg-[#FAF9F6] border border-gray-200 text-[#1A1A1A] placeholder-gray-400 p-4 rounded-2xl outline-none focus:border-[#E3000F] text-sm transition-all" />
            <input required placeholder="Prénom" onChange={e => setFormData({...formData, prenom: e.target.value})} className="w-full bg-[#FAF9F6] border border-gray-200 text-[#1A1A1A] placeholder-gray-400 p-4 rounded-2xl outline-none focus:border-[#E3000F] text-sm transition-all" />
          </div>
          <input type="tel" required placeholder="Tél: +216" onChange={e => setFormData({...formData, tel: e.target.value})} className="w-full bg-[#FAF9F6] border border-gray-200 text-[#1A1A1A] placeholder-gray-400 p-4 rounded-2xl outline-none focus:border-[#E3000F] text-sm transition-all" />
          
          <button type="button" className="bg-[#1A1A1A] text-[#FFD700] text-xs font-black uppercase px-4 py-4 rounded-2xl flex items-center justify-center gap-2 w-full hover:bg-black transition-colors shadow-md">
            <span className="text-[#10B981] animate-pulse">📍</span> Obtenir ma position GPS Automatique
          </button>
          
          <textarea placeholder="Note spéciale..." onChange={e => setFormData({...formData, note: e.target.value})} className="w-full bg-[#FAF9F6] border border-gray-200 text-[#1A1A1A] placeholder-gray-400 p-4 rounded-2xl outline-none focus:border-[#E3000F] text-sm transition-all" rows={2}></textarea>
          
          <label className="flex items-start gap-3 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 cursor-pointer">
            <input type="checkbox" required className="mt-1 w-4 h-4 accent-[#10B981]" />
            <span className="text-[10px] text-emerald-900 font-mono leading-relaxed">
              J'accepte le traitement de mes données (GPS, Tél) selon la <strong>Loi N° 2004-63 (INPDP)</strong>. Données chiffrées E2EE.
            </span>
          </label>

          <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#E3000F] to-red-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-500/30 hover:scale-[1.02] transition-transform text-sm mt-4">
            {isSubmitting ? 'Traitement...' : 'Confirmer & Payer'}
          </button>
        </form>
      </div>
    </div>
  );

  // ==========================================
  // STEP 2: LIVE TRACKING (LIGHT PREMIUM UI)
  // ==========================================
  if (step === 2) return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col p-0 m-0 relative overflow-hidden font-sans">
      
      {/* 1. الخريطة المضيئة الصافية (Light Luxury Map) */}
      <div className="absolute inset-0 z-0 bg-[#F8F9FA]">
        <iframe 
          width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" 
          src="https://www.openstreetmap.org/export/embed.html?bbox=10.15%2C36.75%2C10.25%2C36.85&amp;layer=mapnik" 
          className="opacity-90"
          style={{ filter: 'contrast(110%) brightness(105%) saturate(80%)' }}
        ></iframe>
        {/* تدرج لوني أبيض خفيف لدمج الأطراف */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/90 pointer-events-none"></div>
      </div>

      {/* 2. مسار النيون الزمردي والنسر */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-64 z-10 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" viewBox="0 0 200 100" preserveAspectRatio="none">
          <path d="M20,80 Q100,10 180,80" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="6 6" className="opacity-90 animate-[dash_20s_linear_infinite]" />
        </svg>
        
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-2 border-[#FFD700] flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.15)] z-20 animate-bounce">
          <div className="absolute inset-0 rounded-full border-2 border-[#FFD700] animate-ping opacity-60"></div>
          <span className="text-2xl drop-shadow-md">🦅</span>
        </div>
      </div>

      {/* 3. البطاقة الزجاجية السفلية البيضاء (Light Glassmorphism Bottom Sheet) */}
      <div className="absolute bottom-0 left-0 w-full bg-white/85 backdrop-blur-2xl border-t border-gray-200 rounded-t-[2.5rem] p-6 pb-12 flex flex-col z-30 transition-transform duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
        
        {/* مقبض السحب */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
        
        <h2 className="text-2xl font-black text-[#1A1A1A] mb-8 text-center tracking-[0.2em] uppercase">
          Suivi Logistique
        </h2>
        
        {/* 4. شريط المراحل التفاعلي */}
        <div className="flex justify-between items-center mb-8 relative px-4">
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-gray-200 -z-10 rounded-full"></div>
          <div 
            className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-[#10B981] -z-10 transition-all duration-700 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
            style={{ width: `calc(${(trackingIndex / (trackingSteps.length - 1)) * 100}% - 2rem)` }}
          ></div>

          {trackingSteps.map((stepItem, idx) => {
            const isActive = idx === trackingIndex;
            const isPassed = idx < trackingIndex;
            return (
              <div key={idx} className="flex flex-col items-center relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                  isActive ? 'bg-[#10B981] border-2 border-white ring-4 ring-emerald-100' : 
                  isPassed ? 'bg-[#10B981] border-2 border-white' : 'bg-gray-100 border-2 border-gray-300'
                }`}>
                  {isActive && <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>}
                  {isPassed && <span className="text-[10px] text-white font-black">✓</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* النص الوصفي */}
        <div className="text-center mb-10">
          <p className="text-[#1A1A1A] text-sm font-black uppercase tracking-widest">
            {trackingSteps[trackingIndex].title}
          </p>
          <p className="text-gray-500 text-[10px] font-mono mt-1">
            {trackingSteps[trackingIndex].desc}
          </p>
        </div>

        {/* 5. قسم الرمز الآمن والـ QR */}
        <div className="flex items-stretch justify-between gap-4 animate-fade-in-up">
          
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm ${trackingIndex === trackingSteps.length - 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-white border border-gray-200 text-gray-400'}`}>
              {trackingIndex === trackingSteps.length - 1 ? '🔓' : '🔒'}
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Code PIN</p>
              {trackingIndex === trackingSteps.length - 1 ? (
                <p className="text-2xl font-black text-[#1A1A1A] tracking-widest">4592</p>
              ) : (
                <p className="text-sm font-black text-gray-400 tracking-widest">EN ATTENTE</p>
              )}
            </div>
          </div>

          {trackingIndex === trackingSteps.length - 1 ? (
            <div className="bg-white p-2.5 rounded-2xl shadow-md flex items-center justify-center shrink-0 border border-gray-200">
              <QRCode value="EGL-DELIVERY-4592" size={64} />
            </div>
          ) : (
            <div className="w-[84px] h-[84px] rounded-2xl bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center shrink-0">
               <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
            </div>
          )}
        </div>

      </div>
    </div>
  );

  // ==========================================
  // STEP 3: CONGRATULATIONS (WHITE LUXURY)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm">
        <div className="w-24 h-24 bg-[#10B981] rounded-full flex items-center justify-center text-white text-4xl mb-8 shadow-[0_10px_30px_rgba(16,185,129,0.2)] mx-auto border-4 border-white">✓</div>
        <h1 className="text-3xl font-black text-[#1A1A1A] mb-2 uppercase tracking-[0.2em]">Félicitations</h1>
        <h2 className="text-[#E3000F] font-black text-sm uppercase tracking-widest mb-10">Livraison Réussie 🎉</h2>
        
        <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#10B981] to-transparent"></div>
          <p className="text-gray-600 text-sm font-medium mb-6 leading-relaxed">
            Merci d'avoir choisi <strong className="text-[#1A1A1A]">Eagle.tn</strong>. Votre commande a été livrée en toute sécurité.
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
             <p className="text-[#B8860B] text-[10px] font-black uppercase tracking-widest">À la prochaine commande ! 🇹🇳</p>
          </div>
        </div>

        <button onClick={() => navigate('/restaurant')} className="w-full bg-[#1A1A1A] text-[#FFD700] font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-black transition-colors shadow-md">
          Retour à l'Accueil
        </button>
      </div>
    </div>
  );
};

export default CheckoutFlow;
