import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const CustomizeItemScreen: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div className="min-h-screen bg-slate-50 p-4 max-w-md mx-auto">
      <header className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-xl">⬅️</button>
        <h1 className="text-lg font-black text-slate-900">Personnaliser</h1>
      </header>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <p className="text-xs font-bold text-slate-500">Article ID: {id}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700">Quantité</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 font-black"
            >
              -
            </button>
            <span className="text-xs font-black text-slate-900">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-black"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="w-full py-3 bg-amber-500 text-slate-950 font-black rounded-xl text-xs"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default CustomizeItemScreen;
