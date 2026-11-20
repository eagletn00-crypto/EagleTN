import React, { useRef, useState } from 'react';
import {
  Printer, Download, Share2, CreditCard, Banknote, Bike,
  CheckCircle2, Clock, Building2, UserCheck, MapPin, Phone,
  FileText, ShieldCheck, Sparkles, X, Receipt, AlertCircle
} from 'lucide-react';
import { InvoiceData, InvoiceLineItem } from '@eagletn/types';

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
    // في بيئة الويب/الهاتف، خيار الطباعة يتيح حفظ الملف كـ PDF محلياً بفضل الـ CSS
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Facture ${invoice.invoiceNumber} - EAGLE TN`,
      text: `Facture officielle (فاتورة رسمية) EAGLE TN N° ${invoice.invoiceNumber} pour la commande ${invoice.orderReference}. Total: ${formatDT(invoice.grandTotalTTC)}`,
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
            color: #1C1917 !important;
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

      <div className="fixed inset-0 z-[9999] bg-[#1C1917]/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto no-print">
        <div className="bg-[#FAF8F5] w-full max-w-3xl rounded-[32px] border border-white/20 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-300 my-auto flex flex-col max-h-[92vh]">
          
          {/* 🦅 TOOLBAR (Z-Index Secured) */}
          <div className="no-print bg-white/95 backdrop-blur-xl border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-[#C1121F] shadow-sm">
                <Receipt className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-[18px] font-black text-[#1C1917] tracking-tight flex items-center gap-2">
                  <span className="uppercase">Facture</span>
                  <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                    {invoice.invoiceNumber}
                  </span>
                </h2>
                <p className="text-[12px] font-bold text-gray-500 mt-0.5">Paiement & Bordereau (فاتورة رسمية)</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1C1917] text-[13px] font-black transition-all active:scale-95 outline-none border border-gray-200"
              >
                <Printer className="w-4 h-4 text-[#C1121F]" strokeWidth={2.5} />
                <span>Imprimer</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1C1917] text-[13px] font-black transition-all active:scale-95 outline-none border border-gray-200"
              >
                <Download className="w-4 h-4 text-[#C1121F]" strokeWidth={2.5} />
                <span className="hidden sm:inline">PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#1C1917] active:scale-95 transition-all outline-none border border-gray-200 ml-1"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* 🦅 BODY (Printable Area) */}
          <div className="overflow-y-auto p-6 md:p-8 space-y-8 flex-1 print-container bg-white" ref={printRef}>
            
            {/* HEADER FACTURE */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-[32px] border border-gray-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 print-card">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1C1917] text-white flex items-center justify-center font-black text-[18px] tracking-tighter shadow-md">
                    EG
                  </div>
                  <div>
                    <span className="text-[22px] font-black text-[#1C1917] tracking-tight block leading-none">
                      EAGLE TN
                    </span>
                    <span className="text-[11px] font-black text-[#C1121F] uppercase tracking-widest mt-1 block">
                      Platform Logistique & Commerce
                    </span>
                  </div>
                </div>
                <p className="text-[12px] text-gray-500 font-bold max-w-xs pt-1 leading-relaxed">
                  Plateforme numérique d'intermédiation commerciale et logistique N°1 en Tunisie.
                  <br /><span className="font-arabic mt-1 block text-gray-400">المنصة الرقمية الأولى للوساطة التجارية واللوجستية في تونس.</span>
                </p>
              </div>

              <div className="text-left md:text-right space-y-2 border-t md:border-t-0 border-gray-200 pt-5 md:pt-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-[#C1121F] text-[11px] font-black uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>FACTURE OFFICIELLE</span>
                </div>
                <h1 className="text-[26px] font-black text-[#1C1917] tracking-tight font-mono leading-none">
                  {invoice.invoiceNumber}
                </h1>
                <div className="text-[12px] font-bold text-gray-500 space-y-1 pt-1">
                  <p>Réf. Commande: <strong className="text-[#1C1917] font-mono">{invoice.orderReference}</strong></p>
                  <p>Date d'émission: <span className="text-[#1C1917] font-medium">{invoice.issuedDate}</span></p>
                </div>
              </div>
            </div>
            
            {/* STATUS & PAYMENT METHOD */}
            <div className="flex flex-wrap items-center gap-3">
              <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-black uppercase tracking-wider border ${
                invoice.paymentStatus === 'PAID' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {invoice.paymentStatus === 'PAID' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Payé intégralement (خالص)</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>En attente de paiement (في انتظار الدفع)</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 bg-gray-50 text-gray-700 border border-gray-200 px-3.5 py-2 rounded-xl text-[12px] font-black uppercase tracking-wider">
                {invoice.paymentMethod === 'CASH_ON_DELIVERY' ? (
                  <>
                    <Banknote className="w-4 h-4 text-[#C1121F]" />
                    <span>Paiement à la livraison (الدفع عند الاستلام)</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Carte Bancaire En Ligne (دفع إلكتروني)</span>
                  </>
                )}
              </div>
            </div>

            {/* ENTITIES (Issuer & Client) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ISSUER CARD */}
              <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm space-y-3 print-card">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-[12px] font-black text-[#1C1917] uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#C1121F]" />
                    Émetteur & Partenaire
                  </span>
                  <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md uppercase">Vendeur (البائع)</span>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-[15px] font-black text-[#1C1917]">{invoice.issuer.tradeName}</h3>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{invoice.issuer.companyName}</p>
                </div>
                
                <div className="text-[12px] text-gray-600 space-y-1.5 pt-2 font-medium">
                  <p className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>MF: <strong className="text-[#1C1917] font-mono">{invoice.issuer.taxId}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>{invoice.issuer.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>{invoice.issuer.phone}</span>
                  </p>
                </div>
              </div>
              
              {/* CLIENT CARD */}
              <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm space-y-3 print-card">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-[12px] font-black text-[#1C1917] uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    Client & Destinataire
                  </span>
                  {invoice.client.customPinCode && (
                    <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> PIN: {invoice.client.customPinCode}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-[15px] font-black text-[#1C1917]">{invoice.client.fullName}</h3>
                  <p className="text-[12px] font-bold text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span dir="ltr">+216 {invoice.client.phone}</span>
                  </p>
                </div>
                
                <div className="text-[12px] text-gray-600 space-y-1.5 pt-2 font-medium">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <span>{invoice.client.address}, {invoice.client.city} {invoice.client.governorate ? `(${invoice.client.governorate})` : ''}</span>
                  </p>
                  {invoice.client.notes && (
                    <p className="text-[11px] font-bold text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-200 mt-2 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{invoice.client.notes}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ITEMS TABLE */}
            <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden print-card">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="text-[13px] font-black text-[#1C1917] uppercase tracking-wider">
                  Détail des articles (تفاصيل الطلب)
                </h3>
                <span className="text-[12px] font-black text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                  {invoice.items.length} Article{invoice.items.length > 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-[11px] font-black text-gray-500 uppercase tracking-widest bg-white">
                      <th className="py-4 px-6">Désignation</th>
                      <th className="py-4 px-4 text-center">Qté</th>
                      <th className="py-4 px-4 text-right">Prix Unitaire</th>
                      <th className="py-4 px-6 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[13px] font-semibold text-[#1C1917] bg-white">
                    {invoice.items.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-black text-[#1C1917]">{item.designation}</td>
                        <td className="py-4 px-4 text-center font-black font-mono text-gray-600 bg-gray-50/50">{item.quantity}</td>
                        <td className="py-4 px-4 text-right font-black font-mono text-gray-500">{formatDT(item.unitPriceHT)}</td>
                        <td className="py-4 px-6 text-right font-black font-mono text-[#C1121F] bg-gray-50/50">{formatDT(item.totalHT)}</td>
                      </tr>
                    ))}
                    
                    {/* DELIVERY ROW */}
                    <tr className="bg-gray-50 font-bold text-[#1C1917]">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <span className="font-black">Frais de Livraison</span>
                        <span className="text-[10px] bg-[#C1121F]/10 text-[#C1121F] px-2.5 py-1 rounded-full font-black uppercase tracking-wider flex items-center gap-1 border border-[#C1121F]/20">
                          <Bike className="w-3 h-3" /> Express
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-black font-mono text-gray-500">1</td>
                      <td className="py-4 px-4 text-right font-black font-mono text-gray-500">{formatDT(invoice.deliveryFeeTTC)}</td>
                      <td className="py-4 px-6 text-right font-black font-mono text-[#C1121F]">{formatDT(invoice.deliveryFeeTTC)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* FINANCIAL SUMMARY & LEGAL */}
            <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 pb-6">
              
              {/* LEGAL DISCLAIMER */}
              <div className="flex-1 bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm flex flex-col justify-between space-y-4 print-card">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#C1121F]">
                    <ShieldCheck className="w-5 h-5 shrink-0 stroke-[2.5]" />
                    <span className="text-[12px] font-black uppercase tracking-widest">Mention Légale (إشعار قانوني)</span>
                  </div>
                  <p className="text-[12px] text-gray-500 leading-relaxed font-bold">
                    Conformément à la réglementation tunisienne, <strong className="text-[#1C1917]">EAGLE TN</strong> agit en qualité de plateforme numérique d’intermédiation. La responsabilité de la conformité des biens livrés incombe exclusivement au partenaire marchand <strong className="text-[#1C1917]">{invoice.issuer.tradeName}</strong>.
                  </p>
                </div>
                {invoice.driverCommissionShare !== undefined && invoice.driverCommissionShare > 0 && (
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-wider">
                    <span>Part coursier (نصيب المندوب):</span>
                    <span className="font-mono text-[#1C1917] bg-gray-100 px-2 py-1 rounded-md">{formatDT(invoice.driverCommissionShare)}</span>
                  </div>
                )}
              </div>

              {/* GRAND TOTAL CARD */}
              <div className="w-full md:w-80 bg-[#1C1917] text-white p-6 rounded-[24px] shadow-xl space-y-4 print-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                
                <h4 className="text-[13px] font-black uppercase tracking-widest text-gray-400 border-b border-white/10 pb-3 flex items-center justify-between">
                  <span>Total (الإجمالي)</span>
                  <Receipt className="w-4 h-4 text-white/50" />
                </h4>
                
                <div className="space-y-3 text-[13px]">
                  <div className="flex justify-between font-bold text-gray-300">
                    <span>Sous-total articles</span>
                    <span className="font-mono font-black text-white">{formatDT(invoice.subtotalHT)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-300">
                    <span>Frais de livraison</span>
                    <span className="font-mono font-black text-white">{formatDT(invoice.deliveryFeeTTC)}</span>
                  </div>
                  {invoice.tvaAmount > 0 && (
                    <div className="flex justify-between font-bold text-gray-400 pt-2 border-t border-white/10">
                      <span>TVA (applicable)</span>
                      <span className="font-mono">{formatDT(invoice.tvaAmount)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/20 mt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[14px] font-black uppercase tracking-wider text-[#C1121F]">Net à payer</span>
                    <span className="text-[26px] font-black text-white font-mono leading-none tracking-tight">{formatDT(invoice.grandTotalTTC)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceModal;
