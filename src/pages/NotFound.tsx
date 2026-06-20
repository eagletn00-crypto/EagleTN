import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
      <h1 className="text-6xl font-extrabold text-amber-500 mb-4 animate-pulse">404</h1>
      <p className="text-zinc-400 text-lg mb-6">Page introuvable — Eagle.TN System</p>
      <a href="/client" className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600 transition-colors">
        Retour à l'accueil
      </a>
    </div>
  );
};
export default NotFound;
