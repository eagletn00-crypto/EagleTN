export interface LegalSection {
  title_ar: string;
  text_ar: string;
  title_fr: string;
  text_fr: string;
}

export interface LegalTextType {
  title: string;
  subtitle: string;
  sections: LegalSection[];
}

export const legalText: LegalTextType = {
  title: "Cadre Légal & Conditions d'Utilisation (CGU)",
  subtitle: "Conforme à la législation tunisienne 2026",
  sections: [
    {
      title_ar: "⚠️ إشعار قانون المالية (قوانين الجباية 2025/2026):",
      text_ar: "طبقاً لأحكام قوانين الجباية التونسية النافذة، يلتزم نظام Eagle.tn قانوناً بتطبيق اقتطاع من المورد بنسبة 3% (Retenue à la source) على جميع المبالغ المستخلصة عند التوصيل (COD) لفائدة التجار والشركات الذين لا يملكون معرفاً جبائياً نشطاً (Patente).",
      title_fr: "⚠️ Avis Loi de Finances (Réglementation Fiscale 2025/2026):",
      text_fr: "Conformément à la législation fiscale tunisienne, Eagle.tn est légalement tenu d'appliquer une retenue à la source de 3% sur tous les montants collectés lors de la livraison (COD) pour les commerçants ne disposant pas d'une patente active."
    },
    {
      title_ar: "1. طبيعة الصفة القانونية للمنصة",
      text_ar: "تنشط منصة Eagle.tn باعتبارها 'مركزية نقل بضائع' (Centrale de transport de marchandises) ووسيط رقمي لوجستي بموجب القانون عدد 33 لسنة 2004 المتعلق بتنظيم النقل البري في تونس.",
      title_fr: "1. Statut Juridique de la Plateforme",
      text_fr: "Eagle.tn opère en tant que 'Centrale de transport de marchandises' et intermédiaire logistique numérique, conformément à la loi n° 33 du l'année 2004 relative à l'organisation du transport terrestre en Tunisie."
    },
    {
      title_ar: "2. حدود المسؤولية عن الشحن والتغليف",
      text_ar: "بموجب أحكام مجلة الالتزامات والعقود التونسية، تقع المسؤولية الكاملة لسلامة المحتوى الداخلي وجودته وقانونيته على عاتق المرسل. المنصة غير مسؤولة عن أي تلف ناتج عن سوء التغليف (Mauvais emballage).",
      title_fr: "2. Limites de Responsabilité & Emballage",
      text_fr: "Selon le Code des Obligations et des Contrats tunisien, la responsabilité de la sécurité du contenu incombe à l'expéditeur. La plateforme n'est pas responsable des dommages causés par un mauvais emballage."
    }
  ]
};
