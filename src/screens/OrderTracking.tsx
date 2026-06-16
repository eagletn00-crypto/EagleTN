import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderTracking: React.FC = () => {
  const navigate = useNavigate();
  // بيانات محاكاة للطلب وحالة التتبع
  const [orderStatus, setOrderStatus] = useState('Prep'); // Prep, OnWay, Delivered
  const [driverLocation, setDriverLocation] = useState({ lat: 36.8065, lng: 10.1815 }); // تونس العاصمة

  useEffect(() => {
    // محاكاة تحرك السائق وتحديث الحالة بعد وقت معين (في الحقيقي: الاستماع لـ Supabase Realtime)
    const timerStatus = setTimeout(() => setOrderStatus('OnWay'), 3000);
    
    // محاكاة تحديث الموقع (Real-time GPS CAT)
    const timerLocation = setInterval(() => {
      setDriverLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.005, // محاكاة حركة عشوائية بسيطة
        lng: prev.lng + (Math.random() - 0.5) * 0.005,
      }));
    }, 2000);

    return () => {
      clearTimeout(timerStatus);
      clearInterval(timerLocation);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-6 text-[#1A1A1A]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* Left Side: Real-Life Map stub (الخريطة الاحترافية -Verified) */}
        <div className="flex-grow bg-white rounded-3xl shadow-lg h-96 md:h-screen md:sticky md:top-6 overflow-hidden border border-gray-100">
          <div className="h-full flex flex-col items-center justify-center p-10 text-center">
            <span className="text-7xl mb-5">🗺️</span>
            <h2 className="text-2xl font-bold text-[#FFD700]">GPS CAT (Live Feed)</h2>
            <p className="text-sm text-eagle-textSec mt-3">
              Ici s'affichera la carte professionnelle Verified (ex: Mapbox/Google Maps).
            </p>
            <p className="text-xs bg-[#FFD700]/10 border border-[#FFD700]/30 px-3 py-1 rounded-full mt-3 font-mono text-[#FFD700]">
              Driver GPS: {driverLocation.lat.toFixed(4)}, {driverLocation.lng.toFixed(4)}
            </p>
          </div>
        </div>

        {/* Right Side: Order Details & Status (Luxury White) */}
        <div className="w-full md:w-96 flex-shrink-0 bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
          <header className="mb-8 pb-5 border-b border-gray-100 flex justify-between items-center">
            <h1 className="text-xl font-bold text-[#1A1A1A]">Détails du Suivi</h1>
            <button onClick={() => navigate('/invoice/print')} className="text-xs text-[#FFD700] hover:underline">Imprimer Facture</button>
          </header>

          <div className="mb-8">
            <p className="text-xs text-eagle-textSec uppercase tracking-wider">Commande ID</p>
            <p className="text-lg font-bold text-[#1A1A1A]">EAGLE-ORD00741</p>
          </div>

          {/* Status Timeline */}
          <div className="space-y-6 mb-10">
            <div className={`flex items-start ${orderStatus === 'Prep' || orderStatus === 'OnWay' || orderStatus === 'Delivered' ? 'text-eagle-success' : 'text-eagle-textSec'}`}>
              <span className="text-xl mr-4">🍳</span>
              <div>
                <p className="font-semibold">Préparation en cours</p>
                <p className="text-xs opacity-70">Restaurant Am Ali</p>
              </div>
            </div>
            <div className={`flex items-start ${orderStatus === 'OnWay' || orderStatus === 'Delivered' ? 'text-eagle-success' : 'text-eagle-textSec'}`}>
              <span className="text-xl mr-4">🛵</span>
              <div>
                <p className="font-semibold">En route</p>
                <p className="text-xs opacity-70">Livreur Sami</p>
              </div>
            </div>
            <div className={`flex items-start ${orderStatus === 'Delivered' ? 'text-eagle-success' : 'text-eagle-textSec'}`}>
              <span className="text-xl mr-4">✅</span>
              <div>
                <p className="font-semibold">Livré</p>
                <p className="text-xs opacity-70">Temps estimé</p>
              </div>
            </div>
          </div>
          
          <button onClick={() => navigate('/client')} className="w-full bg-[#FAF9F6] border border-gray-100 text-[#707070] font-bold uppercase py-3 rounded-xl transition-transform hover:scale-[1.01]">
            Retour Accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
