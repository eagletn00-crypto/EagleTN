import React, { useState } from 'react';

interface ProfileScreenProps {
  onBack?: () => void;
  onNavigateAddresses?: () => void;
  onNavigateOrders?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onNavigateAddresses,
  onNavigateOrders,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Youssef Mansour',
    phone: '+216 98 123 456',
    email: 'youssef.mansour@gmail.com',
  });

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // محاكاة طلب حذف الحساب والمعطيات وفق INPDP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Votre demande de suppression définitive de compte et des données personnelles a été enregistrée conformément à la loi INPDP n° 2004-63.');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-900">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-30 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all active:scale-90"
            >
              ←
            </button>
          )}
          <h1 className="font-bold text-base text-slate-900">Mon Profil Client</h1>
        </div>
        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-200/60">
          Compte Vérifié
        </span>
      </div>

      <div className="p-4 space-y-5 max-w-lg mx-auto">
        
        {/* User Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/70 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md">
            {userProfile.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-sm text-slate-900">{userProfile.name}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{userProfile.phone}</p>
            <p className="text-[11px] text-slate-400 font-medium">{userProfile.email}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">GESTION DU COMPTE</p>
          
          <div className="bg-white rounded-3xl border border-slate-200/70 shadow-2xs overflow-hidden divide-y divide-slate-100">
            <button 
              onClick={onNavigateAddresses}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-sm font-bold border border-amber-100">📍</span>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">Adresses de Livraison</h3>
                  <p className="text-[10px] text-slate-400">Repères, quartiers et détails d'accès</p>
                </div>
              </div>
              <span className="text-slate-400 text-xs font-bold">➔</span>
            </button>

            <button 
              onClick={onNavigateOrders}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-sm font-bold border border-emerald-100">📦</span>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">Historique des Commandes</h3>
                  <p className="text-[10px] text-slate-400">Factures et détails de suivi</p>
                </div>
              </div>
              <span className="text-slate-400 text-xs font-bold">➔</span>
            </button>
          </div>
        </div>

        {/* Legal & INPDP Section */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">CONFIDENTIALITÉ & LÉGISLATION TUNISIENNE</p>
          
          <div className="bg-white rounded-3xl border border-slate-200/70 shadow-2xs p-4 space-y-3">
            <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
              <span className="text-emerald-600 text-sm">🛡️</span>
              <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                Vos données sont protégées et traitées conformément à la <strong>loi n° 2004-63 du 27 juillet 2004</strong> relative à la protection des données à caractère personnel (INPDP Tunisie).
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-700">Politique de Confidentialité</span>
              <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">Consulter ➔</a>
            </div>
          </div>
        </div>

        {/* Delete Account Button (INPDP Compliance) */}
        <div className="pt-2">
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="w-full bg-red-50 hover:bg-red-100/80 border border-red-200/80 text-red-700 py-3.5 rounded-2xl font-bold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>🗑️</span>
            Supprimer mon compte et mes données (INPDP)
          </button>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 text-xl font-bold border border-red-100 mx-auto">
              ⚠️
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-sm text-slate-900">Suppression définitive ?</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Conformément aux normes INPDP, cette action supprimera définitivement votre profil, vos adresses et l'historique de vos données.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-2xl font-bold text-xs shadow-md shadow-red-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Suppression en cours...' : 'Oui, supprimer définitivement'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold text-xs transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileScreen;
