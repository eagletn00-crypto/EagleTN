import React from "react";
import { Utensils, Cake, ShoppingBag, Truck } from "lucide-react";

interface EcosystemGridProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const EcosystemGrid: React.FC<EcosystemGridProps> = ({ selectedCategory, onSelectCategory }) => {
  const categories = [
    {
      id: "restaurants",
      title: "Restaurants",
      desc: "Plats chauds & healthy",
      icon: <Utensils className="w-5 h-5 stroke-[1.8] stroke-linejoin-round" />,
      activeColor: "text-amber-500",
      iconBg: "bg-amber-50 text-amber-600 border-amber-100/40"
    },
    {
      id: "patisserie",
      title: "Pâtisseries",
      desc: "Gâteaux & douceurs",
      icon: <Cake className="w-5 h-5 stroke-[1.8] stroke-linejoin-round" />,
      activeColor: "text-rose-500",
      iconBg: "bg-rose-50 text-rose-600 border-rose-100/40"
    },
    {
      id: "shopping",
      title: "Shopping",
      desc: "Épiceries & courses",
      icon: <ShoppingBag className="w-5 h-5 stroke-[1.8] stroke-linejoin-round" />,
      activeColor: "text-cyan-500",
      iconBg: "bg-cyan-50 text-cyan-600 border-cyan-100/40"
    },
    {
      id: "livraison",
      title: "Eagle Express",
      desc: "Colis & documents 🛵",
      icon: <Truck className="w-5 h-5 stroke-[1.8] stroke-linejoin-round" />,
      activeColor: "text-emerald-500",
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100/40"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(isSelected ? null : cat.id)}
            // Eagle Wing Geometry: Non-symmetrical rounded corners
            className={`group p-5 rounded-tr-[2.2rem] rounded-bl-[2.2rem] rounded-tl-2xl rounded-br-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between h-36 active:scale-95 active:translate-y-[1px] relative overflow-hidden ${
              isSelected
                ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15 border-transparent"
                : "bg-white border border-slate-100/50 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.05)] active:bg-slate-50/80"
            }`}
          >
            {/* Micro-Glow Shift active background */}
            {isSelected && (
              <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none" />
            )}

            <div className="flex items-start justify-between relative z-10">
              <div className={`w-11 h-11 rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md flex items-center justify-center border transition-all duration-250 ${
                isSelected ? "bg-white/10 border-white/10 text-white" : `${cat.iconBg}`
              }`}>
                {cat.icon}
              </div>
              {isSelected && (
                <span className={`w-2 h-2 rounded-full ${cat.activeColor} bg-current animate-pulse shadow-md`}></span>
              )}
            </div>

            <div className="space-y-0.5 relative z-10">
              <h3 className={`text-xs font-black tracking-tight ${isSelected ? "text-white" : "text-slate-950"}`}>
                {cat.title}
              </h3>
              <p className={`text-[10px] font-semibold leading-tight ${isSelected ? "text-slate-300/95" : "text-slate-400"}`}>
                {cat.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
