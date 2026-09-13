import React, { useState } from 'react';

export interface PartnerDetailScreenProps {
  onBack?: () => void;
}

export const PartnerDetailScreen: React.FC<PartnerDetailScreenProps> = ({ onBack }) => {
  const [favorite, setFavorite] = useState(false);

  const partner = {
    id: '1',
    name: 'Chez Am Ali',
    category: 'Restaurant Traditionnel',
    rating: 5.0,
    reviewsCount: 142,
    deliveryFee: '2.500 DT',
    deliveryTime: '15 - 25 min',
    status: 'Ouvert',
    isTrackingAvailable: true,
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    menuCategories: ['Les Plus Demandés', 'Plats Traditionnels', 'Grillades', 'Boissons'],
  };

  const menuItems = [
    {
      id: 'm1',
      name: 'Couscous d\'Agneau Traditionnel',
      description: 'Couscous tunisien authentique servi avec de la viande d\'agneau tendre et légumes de saison.',
      price: '18.500 DT',
      prepTime: '20 min',
      popular: true,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    },
    {
      id: 'm2',
      name: 'Plat Tunisien au Gargoulette',
      description: 'Plat mijoté traditionnel assaisonné aux épices locales et à l\'huile d\'olive extra vierge.',
      price: '16.000 DT',
      prepTime: '25 min',
      popular: true,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    },
    {
      id: 'm3',
      name: 'Ojja aux Crevettes',
      description: 'Ojja tunisienne piquante aux crevettes fraîches et œufs pochés.',
      price: '22.000 DT',
      prepTime: '15 min',
      popular: false,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-28 selection:bg-emerald-500 selection:text-white">
      {/* Cover Image & Header Nav */}
      <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
        <img
          src={partner.coverImage}
          alt={partner.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Floating Buttons */}
        <div className="absolute top-4 left-0 right-0 px-4 flex items-center justify-between z-10">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-slate-900/80 active:scale-95 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFavorite(!favorite)}
              className="w-10 h-10 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-slate-900/80 active:scale-95 transition-all"
            >
              <span className="text-base">{favorite ? '❤️' : '🤍'}</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-slate-900/80 active:scale-95 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Partner Card Info */}
      <div className="max-w-md mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 text-white shadow-2xl">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-xl font-black tracking-tight">{partner.name}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{partner.category}</p>
            </div>
            <div className="bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-lg shadow-emerald-500/20 whitespace-nowrap">
              Frais : {partner.deliveryFee}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
              ⭐ {partner.rating} <span className="text-slate-400 font-normal">({partner.reviewsCount})</span>
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-lg">
              ● {partner.status}
            </span>
          </div>

          <hr className="border-slate-800 my-4" />

          {/* Delivery Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-base">⏱️</span>
              <div>
                <div className="text-[10px] text-slate-400">Temps estimé</div>
                <div className="font-bold">{partner.deliveryTime}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-base">🚴</span>
              <div>
                <div className="text-[10px] text-slate-400">Suivi GPS</div>
                <div className="font-bold text-emerald-400">En direct</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="max-w-md mx-auto px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>🔥</span> Les Plus Demandés
          </h2>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Menu interactif</span>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center gap-3.5 hover:shadow-md transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-800 truncate">{item.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center gap-3 mt-2.5">
                  <span className="text-sm font-black text-emerald-600">{item.price}</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    ⏱️ {item.prepTime}
                  </span>
                </div>
              </div>

              <div className="relative flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover bg-slate-100"
                />
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-500/30 active:scale-95 transition-all">
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailScreen;
