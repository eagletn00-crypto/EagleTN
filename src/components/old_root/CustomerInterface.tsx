import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChevronRight, ShieldCheck, Truck, Users, ArrowUpRight, Loader2, Scale } from 'lucide-react';
import { legalText, LegalSection } from './legalData';

const supabaseUrl: string = process.env.REACT_APP_SUPABASE_URL || "";
const supabaseKey: string = process.env.REACT_APP_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface ServiceItem {
  id: number;
  title_fr: string;
  image_url: string;
}

export default function CustomerInterface(): React.JSX.Element {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function getServices() {
      try {
        const { data, error } = await supabase.from('services').select('id, title_fr, image_url');
        if (error) throw error;
        if (data) setServices(data as ServiceItem[]);
      } catch (err: any) {
        console.error(err.message);
        setServices([
          { id: 1, title_fr: "Restaurant", image_url: "https://unsplash.com" },
          { id: 2, title_fr: "Pâtisserie", image_url: "https://unsplash.com" },
          { id: 3, title_fr: "Shopping", image_url: "https://unsplash.com" },
          { id: 4, title_fr: "Para & Santé", image_url: "https://unsplash.com" }
        ]);
      } finally {
        setLoading(false);
      }
    }
    getServices();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 overflow-y-auto font-sans antialiased">
      
      <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-slate-900">EAGLE<span className="text-red-600 font-medium">.tn</span></span>
            <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100 flex items-center gap-1">
              <span>TN</span><span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
            </span>
          </div>
          <button className="bg-slate-950 text-white text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-sm">
            B2B Accès
          </button>
        </div>
      </nav>

      <header className="relative max-w-7xl mx-auto pt-16 pb-12 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200/80 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-medium text-slate-600">Solutions Logistiques Premium B2B</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
          انقل أعمالك إلى مستوى <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500">الاحترافية المطلقة</span>
        </h1>
        <p className="max-w-xl mx-auto text-base text-slate-500 leading-relaxed mb-10">
          منصة لوجستية ذكية متكاملة ومطابقة للتشريعات الجبائية التونسية الحديثة. نربط منظومتك بأساطيل التوصيل بسلاسة وأمان.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Nos Services Premium</h2>
            <p className="text-xs text-slate-400 mt-1">الخدمات النشطة المستضافة عبر قواعد البيانات</p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">Supabase Live</span>
        </div>

        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-200/60 p-3 hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[340px]">
                <div className="w-full h-56 rounded-2xl overflow-hidden bg-slate-100">
                  <img src={service.image_url} alt={service.title_fr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="pt-4 pb-2 px-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{service.title_fr}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Premium Delivery</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between items-start gap-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-sm"><Users className="w-5 h-5" /></div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Devenir Partenaire</h3>
              <p className="text-sm text-slate-500 leading-relaxed">اربط متجرك الإلكتروني أو شركتك الـ B2B معنا الآن ووفر لعملائك تجربة شحن وتوصيل بريميوم تغطي كامل التراب التونسي.</p>
            </div>
            <button className="text-sm font-bold text-slate-950 flex items-center gap-1 group">
              <span>انضم كشريك تجاري</span><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between items-start gap-6">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-sm"><Truck className="w-5 h-5" /></div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Devenir Coursier</h3>
              <p className="text-sm text-slate-500 leading-relaxed">انضم إلى كوكبة الموصلين المحترفين in Eagle، ضاعف مداخيلك الشهرية، وتحكم في أوقات عملك بكل حرية ومرونة.</p>
            </div>
            <button className="text-sm font-bold text-red-600 flex items-center gap-1 group">
              <span>تقديم طلب انضمام ككابتن</span><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-24 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Copyright réservé by eagle groupe.tn 2026
          </div>
          <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors">
            <Scale className="w-3.5 h-3.5" />
            <span>Conditions Générales d'Utilisation (CGU)</span>
          </button>
        </div>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-lg text-slate-900">{legalText.title}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-full transition-colors">إغلاق</button>
            </div>
            <div className="p-6 overflow-y-auto text-sm text-slate-600 space-y-6 text-right" dir="rtl">
              {legalText.sections.map((section: LegalSection, index: number) => (
                <div key={index} className={index === 0 ? "bg-amber-50/60 p-4 rounded-2xl border border-amber-100/70" : ""}>
                  <h4 className="font-bold text-slate-900 mb-1">{section.title_ar}</h4>
                  <p className="text-xs text-slate-500 mb-2">{section.text_ar}</p>
                  <p className="text-[11px] text-slate-400 font-mono text-left" dir="ltr">{section.text_fr}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
