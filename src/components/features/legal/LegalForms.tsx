import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const LegalForms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  
  const isPartner = location.pathname.includes('partner');
  const isCourier = location.pathname.includes('courier');
  
  let title = "Contactez-nous";
  let desc = "Service Client Eagle.tn";
  
  if (isPartner) {
    title = "Devenir Partenaire Eagle";
    desc = "Rejoignez l'élite. Vendez plus, en toute sécurité légale.";
  } else if (isCourier) {
    title = "Devenir Coursier Eagle";
    desc = "Rejoignez notre flotte logistique agréée.";
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] p-6 pb-20">
      <header className="flex items-center gap-4 mb-6 max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="bg-white border border-gray-200 p-3 rounded-full shadow-sm hover:bg-[#E3000F] hover:text-white transition-colors">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
      </header>
      
      <div className="max-w-2xl mx-auto bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl relative overflow-hidden">
        {/* شريط الأمان */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-700"></div>
        
        <h1 className="text-3xl font-black mb-2 text-[#1A1A1A]">{title}</h1>
        <p className="text-gray-500 text-sm mb-8 font-medium">{desc}</p>
        
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); if(agreed) navigate('/restaurant'); }}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nom & Prénom / Raison Sociale</label>
              <input type="text" required className="w-full bg-[#FAF9F6] border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#E3000F] transition-all font-bold text-sm" placeholder="Ex: Société X / Foulen Ben Foulen" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Téléphone (TN)</label>
              <input type="tel" required className="w-full bg-[#FAF9F6] border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#E3000F] transition-all font-bold text-sm" placeholder="+216 00 000 000" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Gouvernorat</label>
              <select required className="w-full bg-[#FAF9F6] border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#E3000F] transition-all text-sm font-bold text-gray-700 appearance-none">
                <option value="">Sélectionnez...</option>
                <option value="Tunis">Tunis</option>
                <option value="Sousse">Sousse</option>
                <option value="Sfax">Sfax</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">CIN (Numéro)</label>
              <input type="text" required pattern="[0-9]{8}" className="w-full bg-[#FAF9F6] border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#E3000F] transition-all font-bold text-sm" placeholder="8 chiffres" />
            </div>
          </div>

          {/* المتطلبات القانونية الصارمة حسب نوع المستخدم */}
          {(isPartner || isCourier) && (
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-widest border-b border-gray-200 pb-2">Documents Légaux Requis</h3>
              
              {isPartner && (
                <div className="text-sm font-bold text-gray-600 space-y-2">
                  <p>📁 Copie de la Patente (المعرف الجبائي)</p>
                  <p>📁 Extrait du RNE (السجل الوطني للمؤسسات)</p>
                  <p>📁 RIB Bancaire (لتحويل الأرباح)</p>
                </div>
              )}
              
              {isCourier && (
                <div className="text-sm font-bold text-gray-600 space-y-2">
                  <p>📁 Permis de conduire valide (رخصة سياقة)</p>
                  <p>📁 Bulletin N°3 récent (بطاقة السوابق العدلية)</p>
                  <p>📁 Carte Grise & Assurance du véhicule (البطاقة الرمادية والتأمين)</p>
                </div>
              )}
              
              <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:border-[#E3000F] hover:bg-red-50 transition-all">
                <span className="text-xs font-bold text-gray-500">📥 Télécharger les documents (PDF/JPG)</span>
                <input type="file" multiple className="hidden" />
              </label>
            </div>
          )}

          {/* العقد القانوني (INPDP & E-Commerce) - إجباري */}
          <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-5 h-5 accent-emerald-500" />
              <div className="text-[10px] text-gray-600 font-mono leading-relaxed space-y-2">
                <p><strong>[FR]</strong> Je certifie l'exactitude des informations fournies. J'accepte les <Link to="/legal" className="text-blue-600 underline">Conditions Générales (CGU/CGV)</Link> régies par la <strong>Loi N° 2000-83</strong> sur le commerce électronique. J'autorise Eagle.tn à traiter mes données conformément à la <strong>Loi organique N° 2004-63 (INPDP)</strong>.</p>
                <p className="font-arabic text-right text-xs leading-relaxed" dir="rtl"><strong>[AR]</strong> أقر بصحة المعلومات المقدمة وأوافق على <Link to="/legal" className="text-blue-600 underline">الشروط والأحكام</Link> المنظمة بموجب <strong>القانون عدد 83 لسنة 2000</strong> المتعلق بالتجارة الإلكترونية. كما أفوض Eagle.tn بمعالجة بياناتي وفقاً <strong>للقانون الأساسي عدد 63 لسنة 2004</strong> المتعلق بحماية المعطيات الشخصية.</p>
              </div>
            </label>
          </div>

          <button type="submit" className={`w-full font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg transition-all text-sm ${agreed ? 'bg-[#1A1A1A] text-[#FFD700] hover:bg-[#E3000F] hover:text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
            Soumettre le Dossier Légalisé
          </button>
        </form>
      </div>
    </div>
  );
};

export default LegalForms;
