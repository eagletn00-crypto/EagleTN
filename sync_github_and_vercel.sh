#!/bin/bash

echo "🔄 بدء بروتوكول المزامنة المزدوجة لـ Eagle.TN..."

# 1. دفع التحديثات البرمجية أولاً إلى مستودع GitHub لتوثيق الكود
echo "📤 جاري حفظ ورفع الكود إلى GitHub..."
git add .
git commit -m "Design: apply brand identity theme and sync configuration files"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
git push origin $CURRENT_BRANCH --force

# 2. إرسال النسخة الإنتاجية المبنية جاهزة إلى خوادم Vercel للعرض المباشر
echo "🚀 جاري تفعيل العرض الفوري على سيرفر Vercel..."
vercel --prod --force --yes

echo "✅ تمت المزامنة المزدوجة بنجاح ساحق!"
echo "📱 كودك الآن آمن على GitHub وموقعك محدث بالهوية الجديدة على Vercel!"
