import React, { useState } from 'react';
import { ArrowLeft, MapPin, Phone, User, FileText, Navigation, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CheckoutProps {
  partner: any;
  cartItems: any[];
  customerAddress?: string;
  customerPhone?: string;
  onConfirmOrder: (orderData: {
    address: string;
    phone: string;
    notes: string;
    pin: string;
    totalAmount: number;
    fullName?: string;
    partnerNote?: string;
    driverNote?: string;
    clientLat?: number;
    clientLng?: number;
  }) => Promise<void> | void;
  onBack: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({
  partner,
  cartItems = [],
  customerAddress = '',
  customerPhone = '+216 ',
  onConfirmOrder,
  onBack,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState(customerPhone || '+216 ');
  const [address, setAddress] = useState(customerAddress || '');
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [partnerNote, setPartnerNote] = useState('');
  const [driverNote, setDriverNote] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // حساب الحساب المالي للفاتورة الموحدة
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || item.unit_price || 0) * (item.quantity || 1),
    0
  );
  const deliveryFee = partner?.delivery_fee || 2.500;
  const total = subtotal + deliveryFee;

  // تحديد الموقع التلقائي والتحويل البشري للعنوان (Reverse Geocoding Layer)
  const handleAutoLocation = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatLng({ lat: latitude, lng: longitude });

        try {
          // تحويل الإحداثيات إلى نص إنساني واقِعي
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          if (data && data.display_name) {
            // استخراج اسم الشارع والمنطقة فقط لراحة العين
            const parts = data.display_name.split(',');
            const shortAddress = parts.slice(0, 3).join(',').trim();
            setAddress(shortAddress);
          } else {
            setAddress(`Position Validée • Tunis (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
          }
        } catch {
          setAddress(`Position GPS Capturée • Tunis`);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Erreur GPS:", error);
        alert("Impossible d'obtenir la position GPS automatique.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || phone.length < 8) {
      alert('Veuillez remplir votre Nom, Prénom et un numéro de téléphone valide.');
      return;
    }

    if (!address.trim()) {
      alert('Veuillez cliquer sur GPS Auto pour valider votre position.');
      return;
    }

    if (!acceptedTerms) {
      alert('Veuillez accepter les conditions légales de livraison.');
      return;
    }

    setIsSubmitting(true);
    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();

    try {
      await onConfirmOrder({
        address,
        phone,
        notes: `Resto: ${partnerNote} | Livre: ${driverNote}`,
        pin: generatedPin,
        totalAmount: total,
        fullName,
        partnerNote,
        driverNote,
        clientLat: latLng?.lat || 36.8065,
        clientLng: latLng?.lng || 10.1815,
      });
    } catch (err) {
      console.error("Erreur confirmation:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans'] pb-28 max-w-md mx-auto shadow-2xl border-x border-slate-200/60">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} type="button" className="p-2 rounded-xl hover:bg-slate-100 transition-all">
          <ArrowLeft className="w-5 h-5 text-slate-800" />
        </button>
        <h1 className="text-sm font-black text-slate-900">Validation de la Commande</h1>
        <div className="w-9" />
      </div>

      <form onSubmit={handleSubmitOrder} className="p-4 space-y-4">
        {/* Partenaire Info */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Partenaire</span>
            <h2 className="text-sm font-black text-slate-900">{partner?.name || 'Chez Om Ali'}</h2>
          </div>
          <span className="text-xs font-black bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
            {cartItems.length} articles
          </span>
        </div>

        {/* Customer Identity */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="text-xs font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-500" />
            <span>Informations du Client</span>
          </h3>

          <div>
            <label className="text-[10px] font-extrabold text-slate-500 uppercase">Nom & Prénom *</label>
            <input
              type="text"
              required
              placeholder="ex: Mohamed Ali"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-slate-500 uppercase">Numéro Téléphone *</label>
            <div className="relative mt-1">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Automatic GPS Location (Human readable address) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Position de Livraison (GPS)</span>
            </h3>
            <button
              type="button"
              onClick={handleAutoLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-[11px] font-black hover:bg-amber-100 transition-all shadow-sm active:scale-95"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Recherche GPS...' : 'Localisation Automatique'}</span>
            </button>
          </div>

          <div>
            <textarea
              rows={2}
              required
              readOnly
              placeholder="Cliquez sur 'Localisation Automatique' pour définir votre adresse"
              value={address}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none cursor-not-allowed"
            />
          </div>
        </div>

        {/* Operational Notes */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="text-xs font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Instructions & Remarques</span>
          </h3>

          <div>
            <label className="text-[10px] font-extrabold text-slate-500 uppercase">Note pour le Partenaire</label>
            <input
              type="text"
              placeholder="ex: Sauce piquante à part, sans oignons..."
              value={partnerNote}
              onChange={(e) => setPartnerNote(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-slate-500 uppercase">Note pour le Livreur</label>
            <input
              type="text"
              placeholder="ex: Appeler à l'arrivée, 2ème étage..."
              value={driverNote}
              onChange={(e) => setDriverNote(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Legal Legal Disclaimer */}
        <div className="bg-slate-100/80 rounded-2xl p-3.5 border border-slate-200/60 space-y-2">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[10px] font-medium text-slate-600 leading-relaxed">
              En confirmant cette commande, vous vous engagez à régler le montant exact au livreur à la réception conformément au Code du Commerce et de la Consommation.
            </p>
          </div>
          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded"
            />
            <span className="text-[10px] font-bold text-slate-800">J'accepte les conditions de livraison EAGLE TN</span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-white text-xs font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Traitement en cours...' : `Confirmer la Commande • ${total.toFixed(3)} DT`}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
