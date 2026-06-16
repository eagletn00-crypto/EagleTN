import React, { useState } from 'react';
import { LayoutDashboard, ShoppingCart, Settings, Power, Bell, CheckCircle, XCircle, Clock } from 'lucide-react';

const ProfessionalPartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans text-slate-900">
      {/* Sidebar - Navigation */}
      <nav className="fixed left-0 top-0 w-20 h-full bg-[#1A1A1A] text-white flex flex-col items-center py-8 gap-8 z-50">
        <div className="w-12 h-12 bg-[#FFD700] rounded-2xl flex items-center justify-center font-black text-xl text-black">🦅</div>
        <LayoutDashboard className="text-[#FFD700] cursor-pointer" />
        <ShoppingCart className="text-gray-500 hover:text-white cursor-pointer" />
        <Settings className="text-gray-500 hover:text-white cursor-pointer" />
        <Power className="mt-auto text-red-500 cursor-pointer" />
      </nav>

      {/* Main Viewport */}
      <main className="ml-20 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black">Dashboard <span className="text-red-600">Am Ali</span></h1>
            <p className="text-slate-500">Système Logistique Centralisé - Eagle.tn</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold uppercase tracking-widest">En Ligne</span>
            </div>
            <button className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-sm shadow-lg hover:bg-red-700 transition-all">
              Nouvelle Commande
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Section: Commandes en cours */}
          <section className="col-span-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <Bell className="text-amber-500" /> Commandes Immédiates
            </h2>
            <div className="space-y-4">
              {/* Order Card Example */}
              <div className="flex items-center justify-between bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="font-black text-lg">Commande #4592</h4>
                  <p className="text-sm text-slate-500">Client: Ahmed (Ibn Khaldoun) - 28.000 TND</p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-red-100 text-red-600 p-4 rounded-xl hover:bg-red-600 hover:text-white"><XCircle /></button>
                  <button className="bg-green-100 text-green-600 p-4 rounded-xl hover:bg-green-600 hover:text-white"><CheckCircle /></button>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Menu Edit */}
          <section className="col-span-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black mb-6">Éditeur de Menu</h2>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase">Plat Spécial</label>
                <input className="w-full mt-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none focus:border-red-500 font-bold" defaultValue="Hergma Royale" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase">Prix (TND)</label>
                <input type="number" className="w-full mt-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none focus:border-red-500 font-bold" defaultValue="15.000" />
              </div>
              <button className="w-full bg-[#1A1A1A] text-[#FFD700] py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform">
                Mise à jour directe
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalPartnerDashboard;
