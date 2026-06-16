import React from 'react';
import { useNavigate } from 'react-router-dom';

const LegalTerms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans pb-20">
      <header className="bg-white p-5 sticky top-0 z-40 border-b border-gray-200 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="text-lg font-black uppercase tracking-widest">Mentions Légales & Confidentialité</h1>
      </header>

      <div className="max-w-4xl mx-auto p-6 mt-4 space-y-8">
        
        {/* المقدمة */}
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⚖️</span>
            <h2 className="text-xl font-black text-[#E3000F]">Cadre Légal & Réglementaire</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            La plateforme <strong>Eagle.tn</strong> (ci-après "la Plateforme") est éditée par Eagle Groupe TN. L'utilisation de la plateforme implique l'acceptation intégrale des présentes conditions, régies par le droit Tunisien.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed font-arabic text-right" dir="rtl">
            تخضع منصة <strong>Eagle.tn</strong> للقانون التونسي. إن استخدامكم للمنصة يعني القبول التام بهذه الشروط والأحكام الموضحة أدناه.
          </p>
        </section>

        {/* حماية المعطيات الشخصية */}
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-black mb-4 border-l-4 border-emerald-500 pl-3">1. Protection des Données (INPDP)</h2>
          <div className="text-xs text-gray-600 space-y-4 leading-relaxed">
            <p><strong>[FR]</strong> Conformément à la <strong className="text-black">Loi organique N° 2004-63 du 27 juillet 2004</strong> portant sur la protection des données à caractère personnel :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Vos données (localisation GPS, téléphone, identité) sont collectées exclusivement pour assurer le service de livraison.</li>
              <li>Vos données sont cryptées de bout en bout (E2EE) et hébergées sur des serveurs sécurisés.</li>
              <li>Aucune donnée ne sera vendue à des tiers. Vous disposez d'un droit d'accès, de rectification et de suppression en nous contactant.</li>
            </ul>
            <div className="border-t border-gray-100 my-4"></div>
            <p className="font-arabic text-right text-sm" dir="rtl">
              <strong>[AR]</strong> عملاً بـ <strong className="text-black">القانون الأساسي عدد 63 لسنة 2004</strong> المتعلق بحماية المعطيات الشخصية:
            </p>
            <ul className="list-disc pr-5 space-y-2 font-arabic text-right text-sm" dir="rtl">
              <li>يتم جمع بياناتكم (الموقع الجغرافي، الهاتف، الهوية) حصرياً لضمان خدمة التوصيل.</li>
              <li>بياناتكم مشفرة ومؤمنة بالكامل. لا يتم بيع أي بيانات لأطراف خارجية، ولكم الحق في طلب مسحها أو تعديلها في أي وقت.</li>
            </ul>
          </div>
        </section>

        {/* التجارة الإلكترونية */}
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-black mb-4 border-l-4 border-[#FFD700] pl-3">2. Commerce Électronique (E-Commerce)</h2>
          <div className="text-xs text-gray-600 space-y-4 leading-relaxed">
            <p><strong>[FR]</strong> Conformément à la <strong className="text-black">Loi N° 2000-83 du 9 août 2000</strong> relative aux échanges et au commerce électronique :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Eagle.tn agit en tant qu'intermédiaire technologique entre le Client, le Partenaire (Restaurant/Boutique) et le Coursier.</li>
              <li>Les prix affichés sont en Dinar Tunisien (TND) Toutes Taxes Comprises (TTC). Une facture électronique fiscale est générée pour chaque commande.</li>
            </ul>
            <div className="border-t border-gray-100 my-4"></div>
            <p className="font-arabic text-right text-sm" dir="rtl">
              <strong>[AR]</strong> عملاً بـ <strong className="text-black">القانون عدد 83 لسنة 2000</strong> المتعلق بالمبادلات والتجارة الإلكترونية:
            </p>
            <ul className="list-disc pr-5 space-y-2 font-arabic text-right text-sm" dir="rtl">
              <li>تعمل المنصة كوسيط تكنولوجي بين الزبون، المطعم، وسائق التوصيل.</li>
              <li>الأسعار معروضة بالدينار التونسي شاملة الأداءات، ويتم إصدار فاتورة إلكترونية معتمدة لكل طلب.</li>
            </ul>
          </div>
        </section>

        {/* مسؤولية النقل اللوجستي */}
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-black mb-4 border-l-4 border-[#1A1A1A] pl-3">3. Transport et Logistique</h2>
          <div className="text-xs text-gray-600 space-y-4 leading-relaxed">
            <p><strong>[FR]</strong> L'ensemble de notre flotte de coursiers opère dans le strict respect du cahier des charges régissant le transport routier de marchandises en Tunisie. Chaque livreur est un prestataire indépendant vérifié (B3, Permis, Assurance).</p>
            <p className="font-arabic text-right text-sm" dir="rtl"><strong>[AR]</strong> يعمل أسطول التوصيل لدينا في إطار الاحترام التام لكراس الشروط المنظم للنقل البري للبضائع. يخضع كل سائق لتحريات دقيقة تشمل السجل العدلي والتأمين.</p>
          </div>
        </section>

        <div className="text-center pb-10">
          <p className="text-[#1A1A1A] font-black tracking-widest text-xs">COPYRIGHT © 2026 EAGLE GROUPE.TN</p>
        </div>

      </div>
    </div>
  );
};

export default LegalTerms;
