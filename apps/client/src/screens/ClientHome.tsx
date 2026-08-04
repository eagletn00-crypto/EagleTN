import React, { useState } from 'react';
import {
  Search,
  Home as HomeIcon,
  User as UserIcon,
  Sparkles,
  Star,
  Clock,
  ChevronRight,
  Headphones,
  X,
  CheckCircle2,
  Percent,
  SlidersHorizontal,
  Store,
  Bike,
  ArrowUpRight,
  Crown,
  Lock,
  Trash2,
  ShoppingCart
} from 'lucide-react';
import RestaurantMenuScreen from './RestaurantMenu';
import { useCartStore } from '../store/useCartStore';

interface ClientHomeProps {
  onSelectPartner?: (partnerId: string) => void;
  onOpenCart?: () => void;
}

const CATEGORIES = [
  { id: 'resto', name: 'Gastronomie', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80', color: '#FFF7ED', available: true },
  { id: 'gateaux', name: 'Pâtisserie', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80', color: '#FDF2F8', available: false },
  { id: 'mode', name: 'Boutique Mode', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80', color: '#F8FAFC', available: false },
  { id: 'beaute', name: 'Soin & Beauté', image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&auto=format&fit=crop&q=80', color: '#FAF5FF', available: false },
  { id: 'fleurs', name: 'Art Floral', image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&auto=format&fit=crop&q=80', color: '#F0FDF4', available: false },
];

export function ClientHome({ onSelectPartner, onOpenCart }: ClientHomeProps) {
  const [selectedCat, setSelectedCat] = useState('resto');
  const [activeTab, setActiveTab] = useState('accueil');
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);

  // Zustand Store
  const { items, clearCart } = useCartStore();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Modal State
  const [modalType, setModalType] = useState<'partenaire' | 'coursier' | 'contact' | null>(null);

  // Form State
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [note, setNote] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms && modalType !== 'contact') return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setModalType(null);
      setNom('');
      setPrenom('');
      setAdresse('');
      setTelephone('');
      setNote('');
      setAcceptedTerms(false);
    }, 2200);
  };

  const handleSelectPartner = (partnerId: string) => {
    if (onSelectPartner) {
      onSelectPartner(partnerId);
    } else {
      setActivePartnerId(partnerId);
    }
  };

  if (activePartnerId) {
    return (
      <RestaurantMenuScreen
        partnerId={activePartnerId}
        onBack={() => setActivePartnerId(null)}
      />
    );
  }

  const currentCategory = CATEGORIES.find(c => c.id === selectedCat);

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', paddingBottom: '120px', fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#111827' }}>
      {/* 👑 HEADER */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-md shadow-red-500/20">
              🦅
            </div>
            <div>
              <h1 className="font-black text-slate-900 text-sm tracking-tight leading-none">EAGLE.TN</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tunisie Livraison</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItemCount > 0 && (
              <button
                onClick={clearCart}
                className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100"
                title="Vider le panier"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-all"
            >
              <ShoppingCart size={18} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher un établissement, un plat..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-red-500 transition-all"
            />
          </div>
          <button className="p-2 bg-slate-50 border border-slate-200/80 rounded-xl">
            <SlidersHorizontal size={16} className="text-slate-700" />
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-4 space-y-6">
        {/* 📢 BANNER MARKETING */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 text-white shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
              <Percent size={10} /> OFFRE SPÉCIALE 🇹🇳
            </span>
          </div>
          <h3 className="font-black text-sm tracking-tight mb-1">
            أقل نسبة عمولة في تونس 10% فقط
          </h3>
          <p className="text-[11px] text-slate-300">
            أسبوعين تجربة مجانية بدون التزام + تسهيلات ودعم كامل للموصلين والمتاجر.
          </p>
        </section>

        {/* 🏷️ CATÉGORIES */}
        <section className="space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            CATÉGORIES OFFICIELLES
          </h4>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((c) => {
              const active = selectedCat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCat(c.id)}
                  style={{
                    width: '92px',
                    height: '116px',
                    borderRadius: '20px',
                    backgroundColor: active ? '#FFFFFF' : c.color,
                    border: active ? '2px solid #C8102E' : '1px solid rgba(229, 231, 235, 0.8)',
                    padding: '12px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    boxShadow: active ? '0 8px 25px rgba(200, 16, 46, 0.08)' : 'none',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <img src={c.image} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                  <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 🍲 ÉTABLISSEMENTS CERTIFIÉS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-500" />
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                {currentCategory?.name || 'ÉTABLISSEMENTS'}
              </h4>
            </div>
            {currentCategory?.available && (
              <button className="text-xs font-bold text-red-600 flex items-center">
                VOIR TOUT <ChevronRight size={14} />
              </button>
            )}
          </div>

          {currentCategory?.available ? (
            <div
              onClick={() => handleSelectPartner('am-ali')}
              className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm flex items-center justify-between cursor-pointer hover:border-red-500 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-1">
                    <Crown size={10} /> VIP PARTNER
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                    CERTIFIÉ
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">مطعم عم علي - Am Ali</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock size={12} /> 15-25 min</span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold"><Star size={12} fill="#F59E0B" /> 4.8</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 text-center space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                {currentCategory?.name} - À bientôt !
              </h3>
              <p className="text-xs text-slate-500">
                Nous préparons le lancement des meilleurs partenaires pour cette catégorie dans votre zone.
              </p>
            </div>
          )}
        </section>

        {/* 🚀 DUAL-CARD PARTNER SECTION */}
        <section className="space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            GRANDISSEZ AVEC EAGLE.TN
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setModalType('partenaire')}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between text-left hover:border-red-500 transition-all space-y-3"
            >
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Store size={18} />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">Inscrire Restaurant</span>
                <span className="text-[10px] text-slate-400">Devenir partenaire</span>
              </div>
            </button>

            <button
              onClick={() => setModalType('coursier')}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between text-left hover:border-emerald-500 transition-all space-y-3"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Bike size={18} />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">Rejoindre la Flotte</span>
                <span className="text-[10px] text-slate-400">Devenir livreur</span>
              </div>
            </button>
          </div>
        </section>

        {/* 📞 SUPPORT HUB */}
        <section>
          <div
            onClick={() => setModalType('contact')}
            className="bg-white rounded-2xl p-3 border border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Headphones size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Assistance & Support 24/7</h4>
                <p className="text-[10px] text-slate-400">Une équipe à votre écoute</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </div>
        </section>

        {/* 🏛️ FOOTER */}
        <footer className="pt-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-600">
            <Lock size={12} /> Données sécurisées & conforme INPDP Tunisie
          </div>
          <p className="text-[10px] text-slate-400 font-medium">© 2026 Eagle.tn - Tous droits réservés</p>
        </footer>
      </main>

      {/* 📱 BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-6 py-2 flex items-center justify-between z-30 max-w-xl mx-auto">
        <button onClick={() => setActiveTab('accueil')} className="flex flex-col items-center gap-1">
          <HomeIcon size={20} className={activeTab === 'accueil' ? 'text-red-600' : 'text-slate-400'} />
          <span className={`text-[10px] font-bold ${activeTab === 'accueil' ? 'text-red-600' : 'text-slate-400'}`}>Accueil</span>
        </button>

        <button onClick={() => setActiveTab('recherche')} className="flex flex-col items-center gap-1">
          <Search size={20} className={activeTab === 'recherche' ? 'text-red-600' : 'text-slate-400'} />
          <span className={`text-[10px] font-bold ${activeTab === 'recherche' ? 'text-red-600' : 'text-slate-400'}`}>Recherche</span>
        </button>

        <button onClick={onOpenCart} className="flex flex-col items-center gap-1 relative">
          <ShoppingCart size={20} className="text-slate-400" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 right-2 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
          <span className="text-[10px] font-bold text-slate-400">Panier</span>
        </button>

        <button onClick={() => setActiveTab('profil')} className="flex flex-col items-center gap-1">
          <UserIcon size={20} className={activeTab === 'profil' ? 'text-red-600' : 'text-slate-400'} />
          <span className={`text-[10px] font-bold ${activeTab === 'profil' ? 'text-red-600' : 'text-slate-400'}`}>Profil</span>
        </button>
      </nav>

      {/* 🪟 MODALS */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full relative shadow-2xl space-y-4">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X size={18} />
            </button>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
                <h3 className="font-bold text-slate-900">Demande envoyée !</h3>
                <p className="text-xs text-slate-500">Nous vous contacterons dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <h3 className="font-black text-slate-900 text-base">
                  {modalType === 'partenaire' && 'Inscrire un Restaurant'}
                  {modalType === 'coursier' && 'Rejoindre la Flotte'}
                  {modalType === 'contact' && 'Assistance & Support'}
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <input
                  type="tel"
                  required
                  placeholder="Numéro de Téléphone (ex: 20123456)"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />

                {modalType !== 'contact' && (
                  <input
                    type="text"
                    required
                    placeholder="Adresse / Ville"
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                )}

                <textarea
                  placeholder="Note ou message..."
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />

                {modalType !== 'contact' && (
                  <label className="flex items-center gap-2 text-[11px] text-slate-600">
                    <input
                      type="checkbox"
                      required
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>J'accepte les conditions d'utilisation et la politique INPDP.</span>
                  </label>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md"
                >
                  Envoyer ma demande
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientHome;
