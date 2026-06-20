#!/bin/bash
echo "🚀 جاري تفعيل بناء خارق ومباشر على Vercel بدون كاش..."

# تثبيت أداة Vercel إذا لم تكن موجودة
npm install -g vercel --disable-stdin

# تسجيل الدخول والرفع المباشر مع إجبار السيرفر على البناء النظيف
vercel --prod --force --yes

echo "✅ تم إرسال الأمر لـ Vercel بنجاح!"
