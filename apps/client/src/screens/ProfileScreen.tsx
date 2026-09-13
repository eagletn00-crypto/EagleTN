import React, { useState } from 'react';

export interface ProfileScreenProps {
  onBack?: () => void;
  onNavigateOrders?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onNavigateOrders,
}) => {
  const [user] = useState({
    name: 'Mohamed Ali Majri',
    email: 'm.majri@eagletn.tn',
    phone: '+216 98 123 456',
    address: 'Avenue Habib Bourguiba, Tunis',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    totalOrders: 14,
    savedAddressesCount: 2,
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 selection:bg-emerald-500 selection:text-white dir-ltr">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white pt-8 pb-16 px-5 rounded-b-[2.5rem] shadow-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl -mr-10 -mb-10 pointer-events-none" />

        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          {onBack ? (
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : <div />}
          
          <h1 className="text-lg font-bold tracking-wide">Mon Profil</h1>
          <button className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full hover:bg-emerald-500/20 transition-all">
            Éditer
          </button>
        </div>

        {/* User Card */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500/30 shadow-2xl"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">{user.name}</h2>
          <p className="text-xs text-slate-300 font-mono mt-0.5">{user.phone}</p>
        </div>

        {/* User Quick Stats */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mt-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-3">
          <div 
            onClick={onNavigateOrders}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all"
          >
            <span className="text-lg font-bold text-emerald-400">{user.totalOrders}</span>
            <span className="text-xs text-slate-300">Commandes</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border-l border-white/10">
            <span className="text-lg font-bold text-amber-400">{user.savedAddressesCount}</span>
            <span className="text-xs text-slate-300">Adresses</span>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="max-w-md mx-auto px-4 -mt-6 relative z-20 space-y-4">
        {/* Account Management */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">GESTION DU COMPTE</h3>

          <button 
            onClick={onNavigateOrders}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                📦
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-800">Historique des Commandes</div>
                <div className="text-xs text-slate-400">Suivi et commandes précédentes</div>
              </div>
            </div>
            <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                📍
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-800">Adresses Enregistrées</div>
                <div className="text-xs text-slate-400">{user.address}</div>
              </div>
            </div>
            <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">PRÉFÉRENCES</h3>

          <div className="flex items-center justify-between p-3 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                🔔
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-800">Notifications Push</div>
                <div className="text-xs text-slate-400">Mises à jour en temps réel</div>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                🌐
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-800">Langue</div>
                <div className="text-xs text-slate-400">Français (TN)</div>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Modifier</span>
          </button>
        </div>

        {/* Logout */}
        <div className="pt-2">
          <button className="w-full flex items-center justify-center gap-2 p-3.5 bg-rose-50 text-rose-600 font-bold rounded-2xl hover:bg-rose-100 active:scale-[0.98] transition-all border border-rose-100">
            <span>Déconnexion</span>
            <span>🚪</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
