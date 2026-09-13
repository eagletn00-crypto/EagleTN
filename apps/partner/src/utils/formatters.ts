/**
 * تحويل UUID الطويل إلى معرف قصير وأنيق مطابق لتطبيق الزبون والسائق
 * Example: '3fa0db5a-953a-4b91-8830-5a5c08cda7f8' -> '#EAGLE-3FA0'
 */
export const formatOrderId = (uuid?: string, prefix: string = 'EAGLE'): string => {
  if (!uuid) return `#${prefix}-0000`;
  
  if (uuid.startsWith('#') || uuid.startsWith('EAGLE-')) {
    return uuid.startsWith('#') ? uuid : `#${uuid}`;
  }

  const cleanId = uuid.replace(/-/g, '').substring(0, 4).toUpperCase();
  return `#${prefix}-${cleanId}`;
};

/**
 * تنسيق المبالغ المالية بالدينار التونسي (3 أرقام بعد الفاصلة)
 */
export const formatDT = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${(num || 0).toFixed(3)} DT`;
};
