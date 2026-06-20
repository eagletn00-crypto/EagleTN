#!/bin/bash

echo "🚀 بدء تجهيز التحديث وكسر الـ Cache..."

# 1. إنشاء أو تحديث ملف vercel.json لتعطيل الـ Cache على المتصفح والسيرفر
cat << 'JSON' > vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
        }
      ]
    }
  ]
}
JSON

# 2. إضافة التعديلات إلى Git
git add .

# 3. إنشاء الالتزام (Commit) مع طابع زمني فريد لإجبار Vercel على الاستجابة
git commit -m "Build: force clean deploy $(date +%s)"

# 4. دفع الكود إلى المستودع (يتعرف تلقائياً على الفرع الحالي)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📤 جاري الرفع إلى فرع ($CURRENT_BRANCH)..."
git push origin $CURRENT_BRANCH

echo "✅ تم الرفع بنجاح! السكربت انتهى من عمله."
