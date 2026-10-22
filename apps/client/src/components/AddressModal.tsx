import React, { useState } from 'react';
import { MapPin, X, Loader2, Navigation } from 'lucide-react';

interface AddressData {
  city: string;
  district: string;
  street: string;
  landmark: string;
  building: string;
  floor: string;
  notes: string;
}

interface AddressModalProps {
  onClose: () => void;
  onSave: (address: AddressData) => void;
  initialData?: Partial<AddressData>;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  onClose,
  onSave,
  initialData,
}) => {
  const [address, setAddress] = useState<AddressData>({
    city: initialData?.city || 'Tunis',
    district: initialData?.district || '',
    street: initialData?.street || '',
    landmark: initialData?.landmark || '',
    building: initialData?.building || '',
    floor: initialData?.floor || '',
    notes: initialData?.notes || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network latency for the premium loading feel
    setTimeout(() => {
      onSave(address);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans animate-in fade-in duration-300">
      
      {/* Modal Container - Glassmorphism & iOS Sheet Physics */}
      <div 
        className="bg-white/95 backdrop-blur-3xl w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-[0_-20px_40px_rgb(0,0,0,0.1)] sm:shadow-[0_20px_60px_rgb(0,0,0,0.15)] border-t sm:border border-white/80 animate-in slide-in-from-bottom-full duration-400 ease-out flex flex-col max-h-[90vh]"
      >
        
        {/* Native Pull Handle for Mobile */}
        <div className="w-12 h-1.5 bg-slate-200/80 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-emerald-50 rounded-[18px] flex items-center justify-center text-emerald-600 border border-emerald-100/60 shadow-inner">
              <MapPin className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-[15px] text-slate-900 tracking-tight">
                Adresse de Livraison
              </h3>
              <p className="text-[11px] text-slate-400 font-bold tracking-wide mt-0.5">
                Précision requise pour le coursier
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="w-9 h-9 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors active:scale-90 cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto overflow-x-hidden custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">

            {/* City & District */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] pl-1 transition-colors group-focus-within:text-emerald-600">
                  Ville
                </label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="Ex: Tunis"
                  className="w-full p-3.5 bg-slate-50/80 border border-slate-200/60 rounded-[18px] text-[13px] font-extrabold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-inner"
                />
              </div>
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] pl-1 transition-colors group-focus-within:text-emerald-600">
                  Quartier
                </label>
                <input
                  type="text"
                  required
                  value={address.district}
                  onChange={(e) => setAddress({ ...address, district: e.target.value })}
                  placeholder="Ex: Ennasr 2"
                  className="w-full p-3.5 bg-slate-50/80 border border-slate-200/60 rounded-[18px] text-[13px] font-extrabold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-inner"
                />
              </div>
            </div>

            {/* Street / Avenue */}
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] pl-1 transition-colors group-focus-within:text-emerald-600">
                Rue / Avenue
              </label>
              <input
                type="text"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                placeholder="Ex: Avenue Hédi Nouira"
                className="w-full p-3.5 bg-slate-50/80 border border-slate-200/60 rounded-[18px] text-[13px] font-extrabold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-inner"
              />
            </div>

            {/* Landmark */}
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] pl-1 transition-colors group-focus-within:text-emerald-600">
                Point de repère
              </label>
              <input
                type="text"
                value={address.landmark}
                onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                placeholder="Ex: En face de la Pharmacie..."
                className="w-full p-3.5 bg-slate-50/80 border border-slate-200/60 rounded-[18px] text-[13px] font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-inner"
              />
            </div>

            {/* Building & Floor */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] pl-1 transition-colors group-focus-within:text-emerald-600">
                  Résidence
                </label>
                <input
                  type="text"
                  value={address.building}
                  onChange={(e) => setAddress({ ...address, building: e.target.value })}
                  placeholder="Ex: Bloc B"
                  className="w-full p-3.5 bg-slate-50/80 border border-slate-200/60 rounded-[18px] text-[13px] font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-inner"
                />
              </div>
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] pl-1 transition-colors group-focus-within:text-emerald-600">
                  Étage / Appt
                </label>
                <input
                  type="text"
                  value={address.floor}
                  onChange={(e) => setAddress({ ...address, floor: e.target.value })}
                  placeholder="Ex: 3ème, Apt 12"
                  className="w-full p-3.5 bg-slate-50/80 border border-slate-200/60 rounded-[18px] text-[13px] font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-inner"
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] pl-1 transition-colors group-focus-within:text-emerald-600">
                Instructions pour le coursier
              </label>
              <textarea
                rows={2}
                value={address.notes}
                onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                placeholder="Sonner à l'interphone..."
                className="w-full p-3.5 bg-slate-50/80 border border-slate-200/60 rounded-[18px] text-[13px] font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-inner resize-none"
              />
            </div>

            {/* Action Footer */}
            <div className="pt-2 pb-2 sticky bottom-0 bg-white/95 backdrop-blur-sm z-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-300 text-white py-4.5 rounded-[20px] font-black text-[13px] uppercase tracking-widest shadow-[0_8px_20px_rgb(15,23,42,0.2)] hover:shadow-[0_8px_25px_rgb(16,185,129,0.3)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin stroke-[3]" />
                    <span>Validation...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 stroke-[3]" />
                    <span>Confirmer l'adresse</span>
                  </>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
