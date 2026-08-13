import React from 'react';

export interface MenuItemData {
  id: string;
  name: string;
  nameAr?: string;
  nameFr?: string;
  price: number;
  description?: string;
  descriptionAr?: string;
  descriptionFr?: string;
  imgUrl?: string;
  image_url?: string;
}

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: MenuItemData | null;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold">{item.nameFr || item.name}</h2>
        {item.nameAr && <p className="text-sm font-medium text-slate-500">{item.nameAr}</p>}
        <p className="text-sm text-slate-500">{item.descriptionFr || item.description}</p>
        <button 
          onClick={onClose}
          className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default ItemDetailModal;
