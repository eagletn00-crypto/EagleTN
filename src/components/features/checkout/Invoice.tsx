import React from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

const Invoice = () => {
  const navigate = useNavigate();

  // بيانات المحاكاة للفاتورة (في الواقع تأتي من Supabase Orders)
  const invoiceData = {
    orderId: 'EGL-2026-8901',
    date: new Date().toLocaleString('fr-FR'),
    customer: 'Sonia Ben Youssef',
    restaurant: 'Chez Am Ali',
    items: [
      { name: 'Couscous au Poulet', qty: 1, price: 18.000 },
      { name: 'Brik à l\'œuf', qty: 2, price: 3.500 }
    ],
    delivery: 3.000
  };

  const subTotal = invoiceData.items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const total = subTotal + invoiceData.delivery;

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 flex flex-col items-center py-10">
      
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
        
        {/* شريط علوي ذهبي */}
        <div className="h-3 bg-[#FFD700] w-full"></div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-black text-[#1A1A1A]">EAGLE<span className="text-[#FFD700]">.tn</span></h1>
              <p className="text-xs text-gray-500 font-mono mt-1">Facture Fiscale (SaaS)</p>
            </div>
            {/* QR Code للتتبع */}
            <div className="p-2 bg-white border border-gray-200 rounded-xl shadow-sm">
              <QRCode value={`https://eagle.tn/track/${invoiceData.orderId}`} size={64} />
            </div>
          </div>

          <div className="border-t border-b border-gray-100 py-4 mb-6 text-sm text-[#1A1A1A]">
            <p className="flex justify-between mb-2"><span>N° Commande:</span> <span className="font-bold">{invoiceData.orderId}</span></p>
            <p className="flex justify-between mb-2"><span>Date:</span> <span className="font-bold">{invoiceData.date}</span></p>
            <p className="flex justify-between mb-2"><span>Client:</span> <span className="font-bold">{invoiceData.customer}</span></p>
            <p className="flex justify-between"><span>Partenaire:</span> <span className="font-bold text-[#B8860B]">{invoiceData.restaurant}</span></p>
          </div>

          <table className="w-full text-left mb-6 text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100">
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 font-medium text-center">Qté</th>
                <th className="pb-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-3 font-semibold text-[#1A1A1A]">{item.name}</td>
                  <td className="py-3 text-center">{item.qty}</td>
                  <td className="py-3 text-right font-mono">{item.price.toFixed(3)} TND</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bg-[#FAF9F6] p-4 rounded-xl space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total HT</span>
              <span className="font-mono">{subTotal.toFixed(3)} TND</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Frais de Livraison (CAT)</span>
              <span className="font-mono">{invoiceData.delivery.toFixed(3)} TND</span>
            </div>
            <div className="flex justify-between text-lg font-black text-[#1A1A1A] pt-2 border-t border-gray-200 mt-2">
              <span>TOTAL TTC</span>
              <span className="text-[#FFD700] font-mono">{total.toFixed(3)} TND</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] text-center p-4">
          <p className="text-[#FFD700] text-xs font-mono tracking-widest">MERCI POUR VOTRE CONFIANCE</p>
        </div>
      </div>

      <button onClick={() => navigate('/restaurant')} className="mt-8 bg-transparent border border-gray-300 text-gray-600 px-6 py-2 rounded-full text-sm font-bold hover:bg-white transition-colors">
        Retour à l'accueil
      </button>
    </div>
  );
};

export default Invoice;
