import React from 'react';
import { 
  Utensils, Cake, ShoppingBag, Pill, 
  Flower, ShieldCheck, UserCheck, Bike, ArrowRight 
} from 'lucide-react';

const categories = [
  { id: 'restaurant', name: 'Restaurant (مطاعم)', icon: Utensils, desc: 'توصيل سريع من أشهر المطاعم' },
  { id: 'patisserie', name: 'Pâtisserie (حلويات)', icon: Cake, desc: 'أرقى محلات الحلويات والمخبوزات' },
  { id: 'shopping', name: 'Shopping (تسوق)', icon: ShoppingBag, desc: 'المقاضي والاحتياجات اليومية للمنزل' },
  { id: 'parapharmacie', name: 'Parapharmacie (شبه طبية)', icon: Pill, desc: 'المستلزمات الطبية وشبه الطبية الآمنة' },
  { id: 'fleuriste', name: 'Fleuriste (زهور)', icon: Flower, desc: 'تنسيق وتوصيل الهدايا والزهور اللحظية' },
  { id: 'boutique', name: 'Boutique (متاجر)', icon: ShieldCheck, desc: 'الملابس، الإكسسوارات والمتاجر المتخصصة' },
  { id: 'partner', name: 'Devenir Partenaire', icon: UserCheck, desc: 'انضم كشريك بـ 10% عمولة وأسبوع مجاني', highlight: true },
  { id: 'courier', name: 'Devenir Coursier', icon: Bike, desc: 'انضم لشبكة النسور وحقق مداخيل يومية ممتازة', highlight: true }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-amber-500 selection:text-black">
      {/* البلف الشاعري والتسويقي الفاخر */}
      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-400 text-xs font-semibold mb-6 backdrop-blur-md">
          <span className="flex h-2 h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
          المنظومة اللوجستية الأحدث والأقوى في تونس 🇹🇳
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
          قوة النسر في خدمة <br/>
          <span className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]">تجارتك ولوجستياتك</span>
        </h1>

        <p className="max-w-2xl mx-auto text-zinc-400 text-base md:text-lg mb-8 leading-relaxed">
          نحطم الاحتكار الأجنبي ونقدم للشركاء والمطاعم <span className="text-white font-bold">العمولة الأقل في تونس (10% فقط)</span> مع أسبوع تجريبي مجاني بالكامل بدون أي التزامات.
        </p>
      </div>

      {/* شبكة الأقسام الثمانية بأسلوب الـ Glassmorphism */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div 
                key={cat.id}
                className={`group p-6 rounded-2xl border transition-all duration-300 backdrop-blur-xl hover:-translate-y-1 ${
                  cat.highlight 
                    ? 'border-amber-500/40 bg-zinc-900/40 shadow-[0_0_20px_rgba(245,158,11,0.05)]' 
                    : 'border-zinc-800 bg-zinc-900/20 hover:border-zinc-700'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  cat.highlight ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-amber-400 group-hover:bg-amber-500/10'
                }`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  {cat.name}
                  <ArrowRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-amber-400" />
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{cat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
