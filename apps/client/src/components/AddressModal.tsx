import React, { useState } from 'react';

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
    setTimeout(() => {
      onSave(address);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-white border-b border-slate-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 font-bold text-lg border border-amber-100/60 shadow-xs">
              📍
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Adresse de Livraison Précise</h3>
              <p className="text-[11px] text-slate-400 font-medium">Optimisé pour la livraison en Tunisie</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 text-xs transition-all active:scale-90"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* City & District */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GOUVERNORAT / VILLE</label>
              <input
                type="text"
                required
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                placeholder="Ex: Tunis, Ariana, Sousse"
                className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QUARTIER / CITÉ</label>
              <input
                type="text"
                required
                value={address.district}
                onChange={(e) => setAddress({ ...address, district: e.target.value })}
                placeholder="Ex: Ennasr 2, Lac 2"
                className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Street / Avenue */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RUE / AVENUE</label>
            <input
              type="text"
              required
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              placeholder="Ex: Avenue Hédi Nouira"
              className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
            />
          </div>

          {/* Landmark (Repère) */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">POINT DE REPÈRE (REPÈRE LÉGENDAIRE)</label>
            <input
              type="text"
              value={address.landmark}
              onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
              placeholder="Ex: En face de la Pharmacie de Garde, près de la Mosquée"
              className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
            />
          </div>

          {/* Building & Floor */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RÉSIDENCE / IMMEUBLE</label>
              <input
                type="text"
                value={address.building}
                onChange={(e) => setAddress({ ...address, building: e.target.value })}
                placeholder="Ex: Résidence Les Palmiers, Bloc B"
                className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ÉTAGE / APPARTEMENT</label>
              <input
                type="text"
                value={address.floor}
                onChange={(e) => setAddress({ ...address, floor: e.target.value })}
                placeholder="Ex: 3ème étage, Apt 12"
                className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Instructions for Driver */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">INSTRUCTIONS POUR LE COURSIER</label>
            <textarea
              rows={2}
              value={address.notes}
              onChange={(e) => setAddress({ ...address, notes: e.target.value })}
              placeholder="Ex: Sonner à l'interphone B12, déposer devant la porte..."
              className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold text-xs shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer pt-3"
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer cette adresse ➔'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AddressModal;
