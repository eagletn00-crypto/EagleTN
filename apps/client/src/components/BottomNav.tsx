import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: '🏠', path: '/', label: 'Accueil' },
    { icon: '🛵', path: '/livreur', label: 'Suivi' },
    { icon: '🔍', path: '/search', label: 'Recherche' },
    { icon: '👤', path: '/auth', label: 'Profil' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 pb-5 pt-3 px-6 flex justify-around items-center z-50 shadow-lg">
      {navItems.map((item, idx) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={idx}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center space-y-0.5 transition-transform active:scale-95"
          >
            <span className={`text-xl ${isActive ? 'opacity-100 scale-110' : 'opacity-40'}`}>
              {item.icon}
            </span>
          </button>
        );
      })}
    </div>
  );
}
