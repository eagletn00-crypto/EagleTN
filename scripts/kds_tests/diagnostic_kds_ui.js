import fs from 'fs';
import path from 'path';

const filePath = path.resolve('apps/partner/src/screens/KitchenKDS.tsx');

console.log("==================================================");
console.log("🔍 EAGLE TN - فحص ملف الواجهة الرئيسية (KitchenKDS)");
console.log("==================================================");

try {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log("✅ تم العثور على الملف بنجاح. إليك المحتوى الحالي:\n");
  console.log("--------------------------------------------------");
  console.log(content);
  console.log("--------------------------------------------------");
} catch (e) {
  console.error("❌ تعذر العثور على الملف، يرجى التحقق من المسار:", e.message);
}
