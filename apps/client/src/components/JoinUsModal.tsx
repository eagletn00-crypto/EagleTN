import React, { useState } from 'react';

export type JoinRole = 'partner' | 'livreur' | 'contact';

export interface FormDataPayload {
  role: JoinRole;
  fullName: string;
  phone: string;
  governorate: string;
  businessType?: string;
  vehicleType?: string;
  notes?: string;
  document?: File | null;
}

interface JoinUsModalProps {
  isOpen: boolean;
  initialRole?: JoinRole;
  onClose: () => void;
  onSubmit?: (payload: FormDataPayload) => Promise<void> | void;
}

const GOUVERNORATS_TN = [
  'Tunis', 'Ariana', 'Ben Arous', 'Manouba',
  'Sousse', 'Monastir', 'Sfax', 'Nabeul',
  'Bizerte', 'Gabès', 'Autre'
];

const BUSINESS_TYPES = [
  'Restaurant / Fast Food',
  'Pâtisserie / Boulangerie',
  'Superette / Épicerie',
  'Fleuriste / Cadeaux',
  'Pharmacie / Parapharmacie',
  'Autre Commerce'
];

const VEHICLE_TYPES = [
  'Scooter / Moto',
  'Voiture',
  'Trottinette Électrique',
  'Camionnette'
];

export const JoinUsModal: React.FC<JoinUsModalProps> = ({
  isOpen,
  initialRole = 'partner',
  onClose,
  onSubmit,
}) => {
  const [activeRole, setActiveRole] = useState<JoinRole>(initialRole);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState('Tunis');
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [vehicleType, setVehicleType] = useState(VEHICLE_TYPES[0]);
  const [notes, setNotes] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  if (!isOpen) return null;

  const validateTunisianPhone = (value: string) => {
    const clean = value.replace(/\s+/g, '');
    const regex = /^(2|5|4|9)\d{7}$/;
    if (clean && !regex.test(clean)) {
      setPhoneError('Numéro invalide (ex: 20123456 ou 50123456)');
    } else {
      setPhoneError('');
    }
    setPhone(clean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneError || !phone) return;

    setIsSubmitting(true);
    try {
      const payload: FormDataPayload = {
        role: activeRole,
        fullName,
        phone,
        governorate,
        businessType: activeRole === 'partner' ? businessType : undefined,
        vehicleType: activeRole === 'livreur' ? vehicleType : undefined,
        notes,
        document: documentFile,
      };

      if (onSubmit) {
        await onSubmit(payload);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2200);
    } catch (err) {
      console.error('Error submitting recruitment lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 font-['Plus_Jakarta_Sans'] transition-opacity">
      <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-black text-xs flex items-center justify-center tracking-tighter shadow-md shadow-slate-900/10">
              EAGLE
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                Portail Partenariats & Recrutement
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                EAGLE TN LOGISTICS NETWORK
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs font-bold transition-all active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Role Tabs */}
        <div className="p-2 bg-slate-50/80 border-b border-slate-100 flex gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveRole('partner')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeRole === 'partner'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🏪 Devenir Partenaire
          </button>
          <button
            type="button"
            onClick={() => setActiveRole('livreur')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeRole === 'livreur'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🛵 Devenir Livreur
          </button>
          <button
            type="button"
            onClick={() => setActiveRole('contact')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeRole === 'contact'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            💬 Support
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 flex items-center justify-center text-2xl mx-auto shadow-xs">
                ✓
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">Candidature Transmise avec Succès !</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Notre responsable commercial vous contactera sous 24h ouvrées pour finaliser la validation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {activeRole === 'partner' && (
                <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-3.5 flex items-start gap-3">
                  <span className="text-emerald-700 font-bold text-base">🚀</span>
                  <div className="text-[11px] text-emerald-950 font-medium leading-relaxed">
                    <span className="font-extrabold text-emerald-900">Offre Partenaire Eagle TN :</span> Commission négociée de <strong className="font-extrabold text-emerald-700">10%</strong> avec <strong className="font-extrabold text-emerald-700">2 semaines d'essai gratuit</strong> sans engagement.
                  </div>
                </div>
              )}

              {activeRole === 'livreur' && (
                <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-3.5 flex items-start gap-3">
                  <span className="text-amber-700 font-bold text-base">💰</span>
                  <div className="text-[11px] text-amber-950 font-medium leading-relaxed">
                    <span className="font-extrabold text-amber-900">Rejoignez notre Flotte :</span> Rémunération attractive à la course, bonus de performance et flexibilité horaire totale.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Nom et Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ex. Mohamed Ali"
                    className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Téléphone (Tunisie) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => validateTunisianPhone(e.target.value)}
                    placeholder="20 123 456"
                    className={`w-full p-3 bg-slate-50/80 border rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                      phoneError ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-slate-900'
                    }`}
                  />
                  {phoneError && <p className="text-[10px] text-red-500 font-medium mt-1">{phoneError}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Gouvernorat *
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-slate-900 focus:outline-none transition-all"
                  >
                    {GOUVERNORATS_TN.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {activeRole === 'partner' && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                      Type d'établissement *
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-slate-900 focus:outline-none transition-all"
                    >
                      {BUSINESS_TYPES.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                )}

                {activeRole === 'livreur' && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                      Moyen de Transport *
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-slate-900 focus:outline-none transition-all"
                    >
                      {VEHICLE_TYPES.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {activeRole !== 'contact' && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    {activeRole === 'partner' ? 'Patente / Registre de Commerce (Optionnel)' : 'CIN / Permis de Conduire (Optionnel)'}
                  </label>
                  <div className="relative border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-100/50 text-center cursor-pointer transition-all">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 font-medium">
                      {documentFile ? `📄 ${documentFile.name}` : '📎 Joindre une photo ou document (PDF, PNG, JPG)'}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  Précisions Complémentaires
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adresse exacte, disponibilités ou remarques..."
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none transition-all resize-none"
                />
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                🔒 Données traitées conformément à la Loi Tunisienne N° 2004-63 (INPDP) pour la gestion des candidatures Eagle TN.
              </p>

              <button
                type="submit"
                disabled={isSubmitting || !!phoneError}
                className="w-full bg-slate-900 hover:bg-black active:scale-[0.99] disabled:opacity-50 text-white font-extrabold text-xs py-4 rounded-xl shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Enregistrement de la candidature...
                  </span>
                ) : (
                  'Envoyer la Candidature ➔'
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default JoinUsModal;
