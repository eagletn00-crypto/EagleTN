import React, { useRef, useState } from 'react';
import {
  Printer,
  Download,
  Share2,
  CreditCard,
  Banknote,
  Bike,
  CheckCircle2,
  Clock,
  Building2,
  UserCheck,
  MapPin,
  Phone,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Receipt,
  X
} from 'lucide-react';

export interface InvoiceLineItem {
  id: string;
  designation: string;
  quantity: number;
  unitPriceHT: number;
  tvaRate?: number;
  totalHT: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  orderReference: string;
  issueDate: string;
  dueDate?: string;
  paymentStatus: 'COD_PENDING' | 'PAID' | 'ONLINE_PENDING' | 'CANCELLED';
  paymentMethod: 'CASH_ON_DELIVERY' | 'ELECTRONIC_CARD' | 'BANK_TRANSFER';
  deliveryMode: 'EXPRESS_MOTORCYCLE' | 'CARGO_COMMERCIAL' | 'PICKUP';
  
  issuer: {
    companyName: string;
    tradeName: string;
    taxId: string;
    address: string;
    phone: string;
    email: string;
    logoUrl?: string;
  };

  client: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    governorate?: string;
    notes?: string;
    customPinCode?: string;
  };

  items: InvoiceLineItem[];
  subtotalHT: number;
  tvaAmount: number;
  deliveryFeeTTC: number;
  driverCommissionShare?: number;
  grandTotalTTC: number;
}

export interface InvoiceModalProps {
  invoice: InvoiceData;
  onClose?: () => void;
  onInitiateOnlinePayment?: (invoiceNumber: string, amount: number) => Promise<void>;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  invoice,
  onClose,
  onInitiateOnlinePayment,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const formatDT = (amount: number) => {
    return new Intl.NumberFormat('fr-TN', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(amount) + ' DT';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Facture ${invoice.invoiceNumber} - EAGLE TN`,
      text: `Facture officielle EAGLE TN N° ${invoice.invoiceNumber} pour la commande ${invoice.orderReference}. Total: ${formatDT(invoice.grandTotalTTC)}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.info('Partage annulé:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  const handleEPayment = async () => {
    if (!onInitiateOnlinePayment) return;
    setIsProcessingPayment(true);
    try {
      await onInitiateOnlinePayment(invoice.invoiceNumber, invoice.grandTotalTTC);
    } catch (error) {
      console.error('Erreur paiement:', error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <>
      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          .print-card {
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto no-print">
        <div className="bg-[#F8FAFC] w-full max-w-3xl rounded-[2.5rem] border border-slate-200/80 shadow-[0_25px_70px_-15px_rgba(15,23,42,0.25)] overflow-hidden transition-all duration-300 my-auto flex flex-col max-h-[92vh]">
          
          {/* TOOLBAR */}
          <div className="no-print bg-white/90 backdrop-blur-xl border-b border-slate-200/70 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#059669]">
                <Receipt className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Facture Complète</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {invoice.invoiceNumber}
                  </span>
                </h2>
                <p className="text-[11px] font-bold text-slate-400">Paiement à la livraison & Bordereau NTS</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all active:scale-95"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Imprimer</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all active:scale-95"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">PDF</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all active:scale-95"
              >
                <Share2 className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">{copySuccess ? 'Copié !' : 'Partager'}</span>
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 flex items-center justify-center transition-colors ml-1"
                >
                  <X className="w-5 h-5 stroke-[2.2]" />
                </button>
              )}
            </div>
          </div>

          {/* BODY */}
          <div className="overflow-y-auto p-6 md:p-10 space-y-8 flex-1 print-container bg-[#FAFAFA]" ref={printRef}>
            
            {/* HEADER */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200/70 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6 print-card">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm tracking-tighter">
                    EG
                  </div>
                  <div>
                    <span className="text-base font-black text-slate-900 tracking-tight block leading-none">
                      EAGLE TN
                    </span>
                    <span className="text-[10px] font-bold text-[#059669] uppercase tracking-widest">
                      Platform Logistique & Commerce
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium max-w-xs pt-1">
                  Plateforme numérique d'intermédiation commerciale et logistique n°1 en Tunisie.
                </p>
              </div>

              <div className="text-left md:text-right space-y-1.5 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[#059669] text-xs font-black uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>FACTURE OFFICIELLE</span>
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight font-mono">
                  {invoice.invoiceNumber}
                </h1>
                <div className="text-xs font-semibold text-slate-500 space-y-0.5">
                  <p>Réf. Commande: <strong className="text-slate-800 font-mono">{invoice.orderReference}</strong></p>
                  <p>Date d'émission: <span className="text-slate-800 font-medium">{invoice.issueDate}</span></p>
                </div>
              </div>
            </div>

            {/* STATUS BAR */}
            <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200/70 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-4 print-card">
              <div className="flex items-center gap-2.5">
                {invoice.paymentStatus === 'PAID' ? (
                  <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-extrabold">
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                    <span>Payé intégralement</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-extrabold">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>En attente de paiement (Espèces)</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-slate-700 bg-slate-100/80 px-3 py-1.5 rounded-xl text-xs font-bold">
                {invoice.paymentMethod === 'CASH_ON_DELIVERY' ? (
                  <>
                    <Banknote className="w-4 h-4 text-[#059669]" />
                    <span>Paiement à la livraison (COD)</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Carte Bancaire En Ligne</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 text-slate-700 bg-slate-100/80 px-3 py-1.5 rounded-xl text-xs font-bold">
                <Bike className="w-4 h-4 text-slate-800" />
                <span>Livraison Express Motorisée 🛵</span>
              </div>
            </div>

            {/* ENTITIES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-xs space-y-3 print-card">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#059669]" />
                    Émetteur & Partenaire
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">Vendeur</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900">{invoice.issuer.tradeName}</h3>
                  <p className="text-xs font-semibold text-slate-600">{invoice.issuer.companyName}</p>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 pt-1 font-medium">
                  <p className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>MF: <strong className="text-slate-800 font-mono">{invoice.issuer.taxId}</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{invoice.issuer.address}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{invoice.issuer.phone}</span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/70 shadow-xs space-y-3 print-card">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#059669]" />
                    Client & Destinataire
                  </span>
                  {invoice.client.customPinCode && (
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60 font-mono">
                      PIN: {invoice.client.customPinCode}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900">{invoice.client.fullName}</h3>
                  <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>+216 {invoice.client.phone}</span>
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 pt-1 font-medium">
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{invoice.client.address}, {invoice.client.city} {invoice.client.governorate ? `(${invoice.client.governorate})` : ''}</span>
                  </p>
                  {invoice.client.notes && (
                    <p className="text-[10px] italic text-slate-400 bg-slate-50 p-2 rounded-xl border border-slate-100 mt-2">
                      « {invoice.client.notes} »
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-xs overflow-hidden print-card">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Détail des articles & Prestations
                </h3>
                <span className="text-[11px] font-extrabold text-slate-400">
                  {invoice.items.length} Article{invoice.items.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/30">
                      <th className="py-3 px-6">Désignation</th>
                      <th className="py-3 px-4 text-center">Qté</th>
                      <th className="py-3 px-4 text-right">Prix Unitaire HT</th>
                      <th className="py-3 px-6 text-right">Total HT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-800">
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-6 font-bold text-slate-900">
                          {item.designation}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                          {item.quantity}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                          {formatDT(item.unitPriceHT)}
                        </td>
                        <td className="py-3.5 px-6 text-right font-mono font-bold text-slate-900">
                          {formatDT(item.totalHT)}
                        </td>
                      </tr>
                    ))}

                    <tr className="bg-slate-50/40 font-bold text-slate-700">
                      <td className="py-3.5 px-6 flex items-center gap-2">
                        <span>Frais d'intermédiation & Livraison Express</span>
                        <span className="text-[10px] bg-emerald-100/80 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          Livraison 🛵
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono">1</td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                        {formatDT(invoice.deliveryFeeTTC)}
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono font-bold text-slate-900">
                        {formatDT(invoice.deliveryFeeTTC)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TOTALS & LEGAL */}
            <div className="flex flex-col md:flex-row items-stretch justify-between gap-6">
              <div className="flex-1 bg-white p-6 rounded-3xl border border-slate-200/70 shadow-xs flex flex-col justify-between space-y-3 print-card">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#059669]">
                    <ShieldCheck className="w-4 h-4 shrink-0 stroke-[2.2]" />
                    <span className="text-xs font-black uppercase tracking-wider">Mention Légale d'Intermédiation</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Conformément à la réglementation tunisienne, <strong>EAGLE TN</strong> agit en qualité de plateforme numérique d’intermédiation. La responsabilité de la conformité des biens livrés incombe exclusivement au partenaire marchand <strong>{invoice.issuer.tradeName}</strong>.
                  </p>
                </div>

                {invoice.driverCommissionShare && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>Part commission coursier estimée:</span>
                    <span className="font-mono text-slate-800">{formatDT(invoice.driverCommissionShare)}</span>
                  </div>
                )}
              </div>

              <div className="w-full md:w-80 bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-3.5 print-card">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                  Récapitulatif Financier
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-medium text-slate-300">
                    <span>Sous-total HT articles</span>
                    <span className="font-mono font-bold text-white">{formatDT(invoice.subtotalHT)}</span>
                  </div>
                  
                  <div className="flex justify-between font-medium text-slate-300">
                    <span>Frais de livraison TTC</span>
                    <span className="font-mono font-bold text-white">{formatDT(invoice.deliveryFeeTTC)}</span>
                  </div>

                  {invoice.tvaAmount > 0 && (
                    <div className="flex justify-between font-medium text-slate-400">
                      <span>TVA (applicable)</span>
                      <span className="font-mono">{formatDT(invoice.tvaAmount)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                    <div>
                      <span className="text-xs font-black uppercase text-emerald-400 tracking-wider block">Total TTC à Payer</span>
                      <span className="text-[10px] text-slate-400 font-medium">Espèces à la livraison</span>
                    </div>
                    <span className="text-xl font-black font-mono text-emerald-400">
                      {formatDT(invoice.grandTotalTTC)}
                    </span>
                  </div>
                </div>

                {onInitiateOnlinePayment && invoice.paymentStatus !== 'PAID' && (
                  <div className="pt-2 no-print">
                    <button
                      type="button"
                      onClick={handleEPayment}
                      disabled={isProcessingPayment}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{isProcessingPayment ? 'Traitement en cours...' : 'Payer par Carte Bancaire'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center pt-4 border-t border-slate-200/60 text-[10px] text-slate-400 font-semibold space-y-1">
              <p>EAGLE TN — Plateforme de Transport & Logistique Commerciale en Tunisie</p>
              <p>Document généré électroniquement • Valable comme bordereau de livraison & décharge</p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceModal;
