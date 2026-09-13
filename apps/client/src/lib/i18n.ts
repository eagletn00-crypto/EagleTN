export type Language = 'fr' | 'ar';

export const getLanguagePreference = (): Language => {
  return (localStorage.getItem('preferred_language') as Language) || 'fr';
};

export const setLanguagePreference = (lang: Language): void => {
  localStorage.setItem('preferred_language', lang);
};

export const translations: Record<string, Record<Language, string>> = {
  'error.unknown': { fr: 'Une erreur est survenue', ar: 'حدث خطأ غير متوقع' },
  'payment.title': { fr: 'Mode de paiement', ar: 'طريقة الدفع' },
  'payment.cod': { fr: 'Espèces (COD)', ar: 'نقدًا عند الاستلام' },
  'payment.card': { fr: 'Carte / e-Dinar', ar: 'بطاقة بنكية / بطاقة أدينار' },
  'price.subtotal': { fr: 'Sous-total', ar: 'المجموع الفرعي' },
  'price.delivery': { fr: 'Frais de livraison', ar: 'رسوم التوصيل' },
  'price.total': { fr: 'Total à payer', ar: 'المجموع الكلي' },
  'action.confirm': { fr: 'Confirmer la commande', ar: 'تأكيد الطلب' }
};

export function t(key: string, lang?: Language): string {
  const language = lang || getLanguagePreference();
  return translations[key]?.[language] || translations[key]?.['fr'] || key;
}

export function formatPrice(amount: number, lang?: Language): string {
  const language = lang || getLanguagePreference();
  const formatted = amount.toFixed(3);
  if (language === 'ar') {
    return `${formatted} د.ت`;
  }
  return `${formatted} DT`;
}

export function formatTime(date: Date, lang?: Language): string {
  const language = lang || getLanguagePreference();
  const locale = language === 'ar' ? 'ar-TN' : 'fr-TN';
  return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(date: Date, lang?: Language): string {
  const language = lang || getLanguagePreference();
  const locale = language === 'ar' ? 'ar-TN' : 'fr-TN';
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function getDirection(lang?: Language): 'ltr' | 'rtl' {
  const language = lang || getLanguagePreference();
  return language === 'ar' ? 'rtl' : 'ltr';
}

export function getTextAlignment(lang?: Language): 'text-left' | 'text-right' {
  const language = lang || getLanguagePreference();
  return language === 'ar' ? 'text-right' : 'text-left';
}
