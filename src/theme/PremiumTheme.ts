// ملف التنسيقات المطور والمطهر بالكامل لبيئة الويب
export const EagleColors = {
  primary: '#E50914',      // الأحمر الفاخر لـ EagleTN
  secondary: '#1F2937',    // الرمادي الداكن
  background: '#030712',   // الخلفية الليلية العميقة
  surface: '#111827',      // الأسطح والبطاقات
  text: '#FFFFFF',         // النصوص البيضاء
  textMuted: '#9CA3AF',    // النصوص الرمادية المطفأة
  accent: '#F59E0B',       // اللون الذهبي الملكي للاشتراكات والتاج
  success: '#10B981',      // الأخضر للعمليات الناجحة
};

export const GlassStyles = {
  background: 'rgba(17, 24, 39, 0.7)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
};

// شبكة أمان لمنع انهيار أي استدعاء قديم لـ StyleSheet
export const StyleSheet = {
  create: (styles: any) => styles
};

export default { EagleColors, GlassStyles, StyleSheet };
