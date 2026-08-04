import React, { useState } from 'react';
import { Percent, Gift, Handshake, Bike, Phone, ShieldCheck, X } from 'lucide-react';

export default function MarketingAndCompliance() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="w-full bg-[#0B0F19] pt-16 pb-8 border-t border-white/5 relative z-10" dir="ltr">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Commercial Growth Grid Infrastructure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Partner Growth Card */}
          <div className="bg-[#1E2538] border border-white/5 p-6 rounded-2xl shadow-xl flex flex-col justify-between group hover:border-white/10 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/20 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Commission Fixe 10%</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Aucun frais caché ni mauvaise surprise. Nous grandissons lorsque votre business se développe en Tunisie.</p>
            </div>
            <button className="mt-6 w-full py-2.5 bg-[#141925] hover:bg-red-600 text-slate-300 hover:text-white border border-white/5 rounded-xl text-xs font-bold transition-all duration-300">
              Devenir partenaire
            </button>
          </div>

          {/* Client Growth Card */}
          <div className="bg-[#1E2538] border border-white/5 p-6 rounded-2xl shadow-xl flex flex-col justify-between group hover:border-white/10 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/20 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">🎁 2 Semaines d'Essai</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Profitez de notre infrastructure logistique gratuitement pendant 14 jours. Livraison offerte sur les premiers ordres.</p>
            </div>
            <button className="mt-6 w-full py-2.5 bg-[#141925] hover:bg-amber-600 text-slate-300 hover:text-white border border-white/5 rounded-xl text-xs font-bold transition-all duration-300">
              Tester Gratuitement
            </button>
          </div>

          {/* Courier Growth Card */}
          <div className="bg-[#1E2538] border border-white/5 p-6 rounded-2xl shadow-xl flex flex-col justify-between group hover:border-white/10 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <Bike className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Devenir coursier 🛵</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Gagnez un revenu compétitif avec des horaires flexibles. Rejoignez l'escadron de livraison le plus rapide de Tunisie.</p>
            </div>
            <button className="mt-6 w-full py-2.5 bg-[#141925] hover:bg-blue-600 text-slate-300 hover:text-white border border-white/5 rounded-xl text-xs font-bold transition-all duration-300">
              Postuler en Ligne
            </button>
          </div>

          {/* Contact Support Card */}
          <div className="bg-[#1E2538] border border-white/5 p-6 rounded-2xl shadow-xl flex flex-col justify-between group hover:border-white/10 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Contacter nous 📞</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Une question technique ou opérationnelle ? Notre cellule de support d'ingénierie répond H24 7j/7.</p>
            </div>
            <a href="tel:+21671000000" className="mt-6 w-full py-2.5 bg-[#141925] hover:bg-emerald-600 text-slate-300 hover:text-white border border-white/5 rounded-xl text-xs font-bold block text-center transition-all duration-300">
              Ligne Directe (Tunisie)
            </a>
          </div>

        </div>

        {/* INPDP Compliance Trigger Row */}
        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-red-950/40 hover:bg-red-950/80 text-red-400 border border-red-900/50 px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Conformité INPDP & Sécurité Données Actives</span>
          </button>
        </div>

        {/* Cyber Copyright Footer Layer */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-slate-500 font-medium">Tous droits de reproduction et d'intégration réservés à Eagle Groupe.</span>
          <span className="font-mono font-bold tracking-wider text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
            © Copyright réservé by EagleTN DIGITAL SYSTEM ✅
          </span>
        </div>

      </div>

      {/* Glassmorphic INPDP Cyber Red Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
            onClick={() => setIsModalOpen(false)}
          />
          
          <div className="bg-[#0e1424] border border-red-500/30 rounded-2xl w-full max-w-lg p-6 shadow-[0_0_40px_rgba(220,38,38,0.15)] relative z-10 animate-[fadeIn_0.2s_ease-out]">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-mono tracking-wide uppercase text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  CONFORMITÉ INPDP TUNISIE
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">Instance Nationale de Protection des Données Personnelles</p>
              </div>
            </div>

            <div className="mt-4 space-y-3.5 text-slate-300 text-xs leading-relaxed font-sans">
              <p>
                Conformément à la législation tunisienne en vigueur, <strong className="text-slate-100">Eagle.tn</strong> applique un protocole de chiffrement asymétrique de bout en bout sur l'ensemble des coordonnées géographiques récoltées.
              </p>
              <div className="p-3 bg-[#141b2d] rounded-xl border border-white/5 font-mono text-[11px] text-slate-400 space-y-1.5">
                <div>• <span className="text-red-400 font-bold">Cryptage :</span> AES-256 GCM Node Structure</div>
                <div>• <span className="text-red-400 font-bold">Rétention :</span> Purge automatisée après livraison</div>
                <div>• <span className="text-red-400 font-bold">Souveraineté :</span> Base Supabase Production isolée</div>
              </div>
              <p className="text-[11px] text-slate-400">
                Aucune donnée marchande ou identifiant client n'est cédé à des tiers sans un consentement explicite signé électroniquement via nos terminaux sécurisés.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                Accepter et Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
