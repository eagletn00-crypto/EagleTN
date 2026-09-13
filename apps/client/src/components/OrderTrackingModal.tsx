import React, { useRef } from 'react';

export const OrderTrackingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const timerRef = useRef<any>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center">
        <h2 className="text-lg font-black">Suivi de commande</h2>
        <button onClick={onClose} className="mt-4 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold">
          Fermer
        </button>
      </div>
    </div>
  );
};
